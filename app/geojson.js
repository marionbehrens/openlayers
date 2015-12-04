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
  if (isPixelProjection(projection)) 
    return (2.0 / Math.pow(resolution, 0.8));
  else
    return (1.5 / Math.pow(resolution, 0.2));
}

var showTextLabel = function(resolution, projection) {
  if (isPixelProjection(projection)) 
    return (resolution < 2.0);
  else 
    return (resolution < 10.0);
}

var getFont = function(projection) {
  if (isPixelProjection(projection)) 
    return '16px sans-serif';
  else 
    return '12px sans-serif';
}

var getTextOffsetY = function(projection) {
  if (isPixelProjection(projection)) 
    return -12;
  else 
    return -10;
}

var getText = function(feature, resolution, projection) {
  if (showTextLabel(resolution, projection))
    return feature.getProperties()['name'];
}

var format = new ol.format.GeoJSON();

var getGeoJsonSource = function(projection) {
  var url = getUrl(projection);
  var projectionOptions = getProjectionOptions(projection);
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

function isPixelProjection(projection) {
  return (projection.substring(0, 'PIXELS'.length) === 'PIXELS');
}

function getProjectionName(projection) {
  return (projection.substring(projection.indexOf(':') + 1));
}

function getProjectionOptions(projection) {
  if (isPixelProjection(projection)) {
    return {};
  }
  else {
    return {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    };
  }
}

function getUrl(projection) {
  if (isPixelProjection(projection)) {
    return getProjectionName(projection) + '/markersWithPixelCoords.json';
  }
  else {
    return 'markersWithGlobalCoords.json';
  }
}

var getGeoJsonLayer = function(projection) {
  return new ol.layer.Vector({
    source: getGeoJsonSource(projection),
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

  var url = getUrl(projection);

  $.ajax(url).then(function(response) {
    var features = format.readFeatures(response);
    features.push(feature);
    console.log(features);

    var sendString = format.writeFeatures(features);
    var postUrl = (isPixelProjection(projection)) ? '/pixel' : '/global';

    $.ajax({
      type : "POST",
      url: postUrl,
      contentType: "application/json; charset=utf-8",
      dataType : 'json', // expecting JSON to be returned
      data: sendString,
      success : function(){
        console.log("success");
        geoJsonLayer.setSource(getGeoJsonSource(projection));
      },
      error : function(){
        console.log("error");
      }
    });
  });

}
