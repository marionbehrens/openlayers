var getStyle = function(feature) {
  var coordinates = feature.getGeometry().getCoordinates();
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({ color: 'orange' }),
      stroke: new ol.style.Stroke({color: 'red', width: 1})
    }),
    text: new ol.style.Text({
      text: getText(feature)
    })
  });
}

var getText = function(feature) {
  return feature.getProperties()['name'];
}

var format = new ol.format.GeoJSON();

var getGeoJsonSource = function(url, projection, projectionOptions) {
  var geoJsonSource = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
      $.ajax(url).then(function(response) {
        geoJsonSource.clear();
        var features = format.readFeatures(response, projectionOptions);
        features.forEach(function(feature){
          feature.setStyle(getStyle(feature));
        });
        geoJsonSource.addFeatures(features);
      });
    },
    projection: ol.proj.get(projection),
    strategy: ol.loadingstrategy.bbox
  });
  return geoJsonSource;
}

var projectionOptionsForPixels = {};

var projectionOptionsForEPSG = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
};

var getGeoJsonLayer = function(projection) {
  return new ol.layer.Vector({
    source: ((projection == 'PIXELS') ? 
      getGeoJsonSource('markersWithPixelCoords.json', 'PIXELS', projectionOptionsForPixels) : 
      getGeoJsonSource('markersWithGlobalCoords.json', 'EPSG:3857', projectionOptionsForEPSG)
    )
  });
};
