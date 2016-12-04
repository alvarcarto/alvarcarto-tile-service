// Tile server using the node web framework Express (http://expressjs.com).
var app = require('express')();
var tilelive = require('tilelive');
require('tilelive-mapnik').registerProtocols(tilelive);
tilelive = require('tilelive-cache')(tilelive, {
    size: 10000
});

var filename = '../openstreetmap-carto/osm.xml';

tilelive.load('mapnik://' + filename, function(err, source) {
    if (err) throw err;
    app.get('/:z/:x/:y.*', function(req, res) {
        source.getTile(req.params.z, req.params.x, req.params.y, function(err, tile, headers) {
            // `err` is an error object when generation failed, otherwise null.
            // `tile` contains the compressed image file as a Buffer
            // `headers` is a hash with HTTP headers for the image.
            if (!err) {
                res.send(tile);
            } else {
                res.send('Tile rendering error: ' + err + '\n');
            }
        });
    });
});

console.log('Listening on port: ' + 8080);
app.listen(8080);
