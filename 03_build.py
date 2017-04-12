# -*- coding: utf-8 -*-
import json
from jinja2 import Template

with open("config.json") as f:
    config = json.load(f)

with open("birds.json") as f:
    birds = json.load(f)

with open("template.html") as f:
    template = Template(f.read())

with open("output/index.html","w") as f:
    f.write(template.render(config=config, birds=birds))