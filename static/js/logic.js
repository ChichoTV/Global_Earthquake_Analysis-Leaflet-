
  var tile=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var layers = {
    "-10-10": new L.LayerGroup(),
    "10-30": new L.LayerGroup(),
    "30-50": new L.LayerGroup(),
    "50-70": new L.LayerGroup(),
    "70-90": new L.LayerGroup(),
    "90+": new L.LayerGroup()
  };

  var info = L.control({
    position: "bottomright"
  });

  var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 3,
    layers:[
      layers['-10-10'],
      layers['10-30'],
      layers["30-50"],
      layers["50-70"],
      layers["70-90"],
      layers["90+"]
    ]
  });
  // var overlays = {
  //   "-10-10": layers['-10-10'],
  //   "10-30": layers['10-30'],
  //   "30-50": layers["30-50"],
  //   "50-70": layers["50-70"],
  //   "70-90": layers["70-90"],
  //   "90+":layers["90+"]
  // };

  // L.control.layers(null, overlays).addTo(myMap);
 

  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };

  info.addTo(myMap);
  tile.addTo(myMap);

  document.querySelector(".legend").innerHTML=('<h4>Legend</h4> <i style="background: Green"></i><span>-10-10</span>')

  var url='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

  function mag_scale(feat){
    if(feat.properties.mag<3){
        return 100;
      }
    else if(feat.properties.mag>=3 && feat.properties.mag<=3.9 ){
        return 200;
      }
    else if(feat.properties.mag>=4 && feat.properties.mag<=4.9){
        return 300;
      }
    else if(feat.properties.mag>=5 && feat.properties.mag<=5.9){
        return 400;
        }
    else if(feat.properties.mag>=6 && feat.properties.mag<=6.9){
            return 500;
        }
    else if(feat.properties.mag>=7 && feat.properties.mag<=7.9){
        return 600;
        }
    else {
        return 700;
    }
  }
  function depth_scale(feat){
      if (feat.geometry.coordinates['2']<10){
          return 'Green';
      }
      else if (feat.geometry.coordinates['2']>=10 && feat.geometry.coordinates['2']<30){
        return 'LawnGreen';
    }
    else if (feat.geometry.coordinates['2']>=30 && feat.geometry.coordinates['2']<50){
        return 'GreenYellow';
    }
    else if (feat.geometry.coordinates['2']>=50 && feat.geometry.coordinates['2']<70){
        return '#F0E68C';
    }
    else if (feat.geometry.coordinates['2']>=70 && feat.geometry.coordinates['2']<90){
        return 'Yellow';
    }
    else {
        return 'GoldenRod';
    }
  }

  d3.json(url,function(resp){
      console.log(resp.features['25'].geometry.coordinates['0'])
      console.log(depth_scale(resp.features['50']))
      resp.features.forEach(function(data){
        L.circle([data.geometry.coordinates['0'], data.geometry.coordinates['1']],{
            color: 'white',
            fillColor: depth_scale(data),
            fillOpacity: .8,
            radius: mag_scale(data)*200
        }).bindPopup('<h2> Magnitude: '+data.properties.mag+'</h2>'+'<hr> <h3> Depth:'+data.geometry.coordinates['2']+'</h3>').addTo(myMap)
      })
  })