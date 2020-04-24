# Alvar Carto Tile Service

This service provides map tiles for https://design.alvarcarto.com. It depends
on Mapnik server which has been installed as guided in https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md.

The underlying tile server is [Tilestrata](https://github.com/naturalatlas/tilestrata/).

Quick intro:

* This service renders 256x256 map tiles for Leaflet
* Caches map tiles to local filesystem


## Local docker development

To get started:

* `docker-compose run tile bash`
* `nvm use 8`
* `npm install` and exit the bash session back to host
* `docker-compose up`
