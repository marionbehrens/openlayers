var style = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({ color: 'orange' }),
      stroke: new ol.style.Stroke({color: 'red', width: 1})
    }),
    text: new ol.style.Text({
      text: '',
      fill: new ol.style.Fill({ color: 'red' })
    })
});

var getText = function(feature) {
  return feature.getProperties()['name'];
}

var getScale = function(resolution, projection) {
  if (projection == 'PIXELS') 
    return (2.0 / Math.pow(resolution, 0.8));
  else
    return (1.5 / Math.pow(resolution, 0.2));
}

var showTextLabel = function(resolution, projection) {
  if (projection == 'PIXELS') 
    return (resolution < 2.0);
  else 
    return (resolution < 10.0);
}

var getFont = function(projection) {
  if (projection == 'PIXELS') 
    return '16px sans-serif';
  else 
    return '12px sans-serif';
}

var getTextOffsetY = function(projection) {
  if (projection == 'PIXELS') 
    return -12;
  else 
    return -10;
}

var getText = function(feature, resolution, projection) {
  if (showTextLabel(resolution, projection))
    return feature.getProperties()['name'];
}

var format = new ol.format.GeoJSON();

var getGeoJsonSource = function(url, projection, projectionOptions) {
  var geoJsonSource = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
      $.ajax(url).then(function(response) {
        geoJsonSource.clear();
        var features = format.readFeatures(response, projectionOptions);
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
    ),
    style: function(feature, resolution) {
      style.getText().setText(getText(feature, resolution, projection));
      var scale = getScale(resolution, projection);
      style.getImage().setScale(scale);
      style.getText().setFont(getFont(projection));
      style.getText().setScale(scale);
      style.getText().setOffsetY(getTextOffsetY(projection) * scale);
      return [style];
    }  
  });
};

function addFeatureToGeoJson(feature, geoJsonLayer, projection) {

  var url = (projection == 'PIXELS') ? 'markersWithPixelCoords.json' : 'markersWithGlobalCoords.json';
  $.ajax(url).then(function(response) {
    var features = format.readFeatures(response);
    features.push(feature);
    console.log(features);

    var sendString = format.writeFeatures(features);
    var postUrl = (projection == 'PIXELS') ? '/pixel' : '/global';

    $.ajax({
      type : "POST",
      url: postUrl,
      contentType: "application/json; charset=utf-8",
      dataType : 'json', // expecting JSON to be returned
      data: sendString,
      success : function(){
        console.log("success");
        geoJsonLayer.setSource((projection == 'PIXELS') ? 
          getGeoJsonSource('markersWithPixelCoords.json', 'PIXELS', projectionOptionsForPixels) : 
          getGeoJsonSource('markersWithGlobalCoords.json', 'EPSG:3857', projectionOptionsForEPSG)
        );
      },
      error : function(){
        console.log("error");
      }
    });
  });

}
