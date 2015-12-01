var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point([3223, -2218]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});

var iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    opacity: 0.9,
    src: 'markers/greenMarker_48.png'
  })
});

var circleFeature = new ol.Feature({
  geometry: new ol.geom.Point([5555, -1111]),
  name: '5555 / -1111',
  population: 5555,
  rainfall: 1111
});

var circleStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 20,
    opacity: 0.75,
    fill: new ol.style.Fill({color: 'pink'})
  }),
  text: new ol.style.Text({
    font: '12px helvetica,sans-serif',
    text: "Circle",
    fill: new ol.style.Fill({color: 'green'}),
    stroke: new ol.style.Stroke({color: 'black'})
  })
});

var getTextStyle = function(feature){
  return new ol.style.Text({
    text: getText(feature),
    fill: new ol.style.Fill({color: 'green'}),
    stroke: new ol.style.Stroke({color: 'black'})
  })
};

var getText = function(feature) {
  var text = feature.get('name');
    console.log(text);
  return text;
};

iconFeature.setStyle(iconStyle);
circleFeature.setStyle(circleStyle);

var vectorSource = new ol.source.Vector({
  features: [iconFeature, circleFeature]
});

var vectorLayer = new ol.layer.Vector({
  source: vectorSource
});

