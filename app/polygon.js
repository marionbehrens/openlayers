var styles = [
  /* We are using two different styles for the polygons:
   *  - The first style is for the polygons themselves.
   *  - The second style is to draw the vertices of the polygons.
   *    In a custom `geometry` function the vertices of a polygon are
   *    returned as `MultiPoint` geometry, which will be used to render
   *    the style.
   */
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  }),
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: 'orange'
      })
    }),
    geometry: function(feature) {
      // return the coordinates of the first ring of the polygon
      var coordinates = feature.getGeometry().getCoordinates()[0];
      console.log(feature.getGeometry().getCoordinates()[0][0]);
      return new ol.geom.MultiPoint(coordinates);
    }
  })
];

var geojsonObjectWithPixelCoords = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[[2000, -2000], [3000, -2000], [3000, -3000],
            [2000, -3000]]]
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[[4000, -400], [1000, -400], [1000, -800],
            [4000, -800]]]
      }
    }
  ]
};

var geojsonObjectWithGlobalCoords = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[[13.4, 52.5], [13.4, 52.6], [13.3, 52.6], [13.3, 52.5]]]
      }
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[[13.37, 52.52], [13.37, 52.67], [13.39, 52.67], [13.39, 52.52]]]
      }
    }
  ]
};

var projectionOptionsForPixels = {};

var projectionOptionsForEPSG = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
};

var getPolygonSource = function(geoJsonObject, projectionOptions) {
  return new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geoJsonObject, projectionOptions)
  });
}

var getPolygonLayer = function(projection) {
  return new ol.layer.Vector({
    source: ((projection == 'PIXELS') ? getPolygonSource(geojsonObjectWithPixelCoords, projectionOptionsForPixels) : getPolygonSource(geojsonObjectWithGlobalCoords, projectionOptionsForEPSG)),
    style: styles
  });
}
