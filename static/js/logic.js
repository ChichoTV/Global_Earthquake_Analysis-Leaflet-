
  var tile=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var info = L.control({
    position: "bottomright"
  });

  var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 3,
  });
 

  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };

  info.addTo(myMap);
  tile.addTo(myMap);

  document.querySelector(".legend").innerHTML=('<h4>Depth</h4> <i style="background: Green"></i><span>-10-10</span><br><i style="background: LawnGreen"></i><span>10-30</span><br><i style="background: GreenYellow"></i><span>30-50</span><br><i style="background: #F0E68C"></i><span>50-70</span><br><i style="background: Yellow"></i><span>70-90</span><br><i style="background: GoldenRod"></i><span>90+</span><br>')

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