# -*- coding: utf-8 -*-
import json
import random
from urllib.request import urlretrieve
from urllib.parse import urlsplit

with open("config.json") as f:
    config = json.load(f)

with open("birds.json") as f:
    birds = json.load(f)

def get_media(url, file_name):
    ext = urlsplit(url).path.split(".")[-1]
    media_filename = "%s.%s"%(file_name, ext)
    print("    Retrieving %s"%media_filename)
    urlretrieve(url, "output/media/"+media_filename)
    return media_filename

#def asciize_url(url):
#    parts = list(urlsplit(url))
#    parts[2] = quote(parts[2])
#    return urlunsplit(parts)

for bird in birds:
    print("  Processing %s"%bird["latin_name"])
    bird["picture_files"] = []
    bird["sound_files"] = []
    base_name = bird["latin_name"].replace(" ","_")
    i = 0
    for url in bird["sounds"]:
        i += 1
        bird["sound_files"].append(get_media(url, "%s_%d"%(base_name,i)))
    for url in bird["pictures"]:
        i += 1
        bird["picture_files"].append(get_media(url + "?width=300", "%s_%d"%(base_name,i)))
    
with open("birds.json","w") as f:
    json.dump(birds, f, indent=2)