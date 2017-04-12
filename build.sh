#!/bin/bash

virtualenv -p python3 tmp_env
source tmp_env/bin/activate
pip install jinja2
pip install sparqlwrapper
python 01_get_data.py
rm output/media/*.*
python 02_get_assets.py
python 03_build_html.py
deactivate
rm -r tmp_env