var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//Perfomring A GET request to get the data

d3.json(queryUrl, function (data) {
  createFeatures(data.features);
});

function markersize(mag) {
  return mag * 25000;
}

function getColor(mag) {
  var color = "";
  if (mag > 5) {
    return (color = "#FF6347");
  } else if (mag > 4) {
    return (color = "#FFA500");
  } else if (mag > 3) {
    return (color = "#FA8072");
  } else if (mag > 2) {
    return (color = "#FFD700");
  } else if (mag > 1) {
    return (color = "#ADFF2F");
  } else {
    return (color = "#7FFF00");
  }
}

function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<h3>Magnitude: " +
          feature.properties.mag +
          "<h3><h3>Location: " +
          feature.properties.place +
          "<h3><hr><h3>" +
          new Date(feature.properties.time) +
          "</h3>"
      );
    },

    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng, {
        radius: markersize(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: "white",
        fillOpacity: 0.9,
        weight: 0.7,
      });
    },
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  var streetmap = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY,
    }
  );

  var satmap = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY,
    }
  );

  var darkmap = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY,
    }
  );

  var outdoormap = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY,
    }
  );

  // Pulling Tectonic Plates Data
  var tectonicLayers = new L.LayerGroup();
  var tectonicUrl =
    "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  d3.json(tectonicUrl, function (plateData) {
    L.geoJSON(plateData, {
      color: "Orange",
      weight: 2,
    }).addTo(tectonicLayers);
  });

  //Creating A Basemaps

  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    Satellite: satmap,
    Outdoors: outdoormap,
  };

  //Creating an Overlay Map

  var overlayMaps = {
    Earthquakes: earthquakes,
    FaultLines: tectonicLayers,
  };

  //Creating a Default map

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes, tectonicLayers],
  });

  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

  /// Creating A Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {

    var div = L.DomUtil.create('div','info legend'),
        magnitudes = [0,1,2,3,4,5],
        labels = [];

    div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>" 
    // loop through our density intervals and generate a label for each interval
    for (var i=0; i < magnitudes.length; i++){
      div.innerHTML +=
        '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
        magnitudes[i] + (magnitudes[i+1]?'&ndash;' + magnitudes[i+1] +'<br>': '+');
      }
      return div;
  };
  legend.addTo(myMap);
}

  


