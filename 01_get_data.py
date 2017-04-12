# -*- coding: utf-8 -*-
import json
from SPARQLWrapper import SPARQLWrapper, JSON

with open("config.json") as f:
    config = json.load(f)

print("1. Retrieving data from Wikidata")

firstquery = """
  PREFIX entity: <http://www.wikidata.org/entity/>
  SELECT ?species ?taxon ?family_name ?audio ?picture
  WHERE
  {
    ?species wdt:P105 entity:Q7432 . #Looking for species
    ?species wdt:P225 ?taxon . #Querying the Taxon (latin name) for the bird
    ?species wdt:P171* ?family . #Looking for the family-level parent taxon
    ?family wdt:P225 ?family_name .
    ?family wdt:P105 entity:Q35409 . 
    ?family wdt:P171* entity:Q5113 . #It has to belong to Birds
    ?species wdt:P51 ?audio .
	?species wdt:P18 ?picture .
  }
"""

sparql = SPARQLWrapper("http://query.wikidata.org/sparql")
sparql.setQuery(firstquery)
sparql.setReturnFormat(JSON)
results = sparql.query().convert()

animal_dict = {}

for result in results["results"]["bindings"]:
    uri = result["species"]["value"]
    if not uri in animal_dict:
        animal_dict[uri] = {
            "uri": uri,
            "sounds": [],
            "pictures": [],
            "latin_name": result["taxon"]["value"],
            "common_names": {},
            "family": result["family_name"]["value"]
        }
    animal = animal_dict[uri]
    audio = result["audio"]["value"]
    picture = result["picture"]["value"]
    if audio not in animal["sounds"]:
        animal["sounds"].append(audio)
    if picture not in animal["pictures"]:
        animal["pictures"].append(picture)

uris = list(animal_dict.keys())
print("  %d birds found, now querying labels"%len(uris))

chunksize = 10

for k in range(0, len(uris), chunksize):

    print("    Processing batch %d of %d"%(1+k, len(uri)//chunksize))

    sub_uris = uris[k:k+chunksize]

    nextquery = """
    SELECT ?species ?common_name
    WHERE
    {
        ?species wdt:P1843 ?common_name .
        VALUES ?species { <%(species_list)s> }
        FILTER ( %(lang_filter)s )
    }
    """%{
        "species_list": "> <".join(sub_uris),
        "lang_filter": " || ".join(
            ['LANGMATCHES(LANG(?common_name),"%(code)s")'%lg for lg in config["languages"]]
        )
    }

    sparql = SPARQLWrapper("http://query.wikidata.org/sparql")
    sparql.setQuery(nextquery)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    for result in results["results"]["bindings"]:
        animal_names = animal_dict[result["species"]["value"]]["common_names"]
        lang = result["common_name"]["xml:lang"]
        if not animal_names.get(lang, None):
            animal_names[lang] = result["common_name"]["value"]

with open("birds.json","w") as f:
    json.dump(
        sorted(
            animal_dict.values(),
            key = lambda animal: "%s %s"%(animal["family"], animal["latin_name"])
        ),
        f,
        indent=2
    )
