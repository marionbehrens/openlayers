var setup = [{
  "extent": [0.000000, -4437.000000, 6445.000000, 0.000000],
  "name": "Netzplan"
}, {
  "extent": [0.000000, -4096.000000, 8192.000000, 0.000000],
  "name": "Netzplan2"
}, {
  "extent": [0.000000, -4096.000000, 8192.000000, 0.000000],
  "name": "Luftbild"
}];


var mapMinZoom = 0;
var mapMaxZoom = 5;
var mapMaxResolution = 1.000000;


var mapResolutions = [];
for (var z = mapMinZoom; z <= mapMaxZoom; z++) {
  mapResolutions.push(Math.pow(2, mapMaxZoom - z) * mapMaxResolution);
}

var mapTileGrid;
var imageLayer;
var imageView;

function imageChanged(projection) {

  var config = setup[0];

  setup.forEach(function(c) {
    if (c.name == projection.substring(projection.indexOf(':') + 1)) {
      config = c;
    }
  });

  mapTileGrid = new ol.tilegrid.TileGrid({
    extent: config.extent,
    minZoom: mapMinZoom,
    resolutions: mapResolutions
  });

  imageLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      projection: 'PIXELS',
      tileGrid: mapTileGrid,
      url: config.name + "/{z}/{x}/{y}.png"
    })
  });

  imageView = new ol.View({
    projection: ol.proj.get('PIXELS'),
    extent: config.extent,
    maxResolution: mapTileGrid.getResolution(0)
  });
}
