# -*- coding: utf-8 -*-
import json
import random
from urllib.request import urlretrieve
from urllib.parse import urlsplit

with open("config.json") as f:
    config = json.load(f)

with open("birds.json") as f:
    birds = json.load(f)

print("2. Retrieving media files from Wikimedia commons")

def get_media(url, file_name):
    ext = urlsplit(url).path.split(".")[-1].lower()
    media_filename = "%s.%s"%(file_name, ext)
    print("    Retrieving %s"%url)
    try:
        urlretrieve(url, "output/media/"+media_filename)
    except Exception as e:
        print("   Error: %s"%e)
    return media_filename

for bird in birds:
    print("  Processing %s"%bird["latin_name"])
    base_name = bird["latin_name"].replace(" ","_")
    bird["sound_file"] = get_media(bird["audio"], base_name)
    bird["picture_file"] = get_media(bird["picture"] + "?width=300", base_name)
    
with open("birds.json","w") as f:
    json.dump(birds, f, indent=2)