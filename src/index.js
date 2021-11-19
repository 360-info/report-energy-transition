import {json} from 'd3-fetch'
import geoJSONFile from './data/irena-totals.geojson'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

console.log("Parcel linking correctly! Aha!")

// mapbox token is injected by parcel from an environment variable
// use either a src/.env file or the netlify deploy template
let mapbox_token = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = mapbox_token;

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/james-goldie/ckw5rwsnl2jb714pqrhp3hteg/draft',
  center: [0, 30],
  zoom: 2,
  logoPosition: 'bottom-right',
  // attributionControl: false
});

// add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl(
  {container: document.querySelector('body')}));


/* onload: attach sidebar event listeners */
map.on('load', function () {

  // call this to change the column mapping of the bubbles and labels
  function updateMapState() {

    // get control state
    const year = document.querySelector('#slider').value;
    const indicator =
      document.querySelector('input[name="indicatorGroup"]:checked').value;
    console.log("Slider is " + year + "; indicator is " + indicator);

    // change column mapping of circles and labels
    map.setPaintProperty('power-circles', 'circle-color',
      powerCircleColor(year, indicator));
    map.setPaintProperty('power-circles', 'circle-radius',
      powerCircleRadius(year, indicator));
    
    // set the plot title to the selected year
    document.getElementById('plotTitle').textContent =
      'Energy transition: ' + String(year);
  }

  function powerCircleColor(year, indicator) {
    console.log('Configuring colour w/: ' + "prop" + indicator + '_renewable.' + year)
    return [
      'interpolate',
      ['linear'],
      ['to-number', ['get', "prop" + indicator + '_renewable.' + year]],
      0,   "#543005",
      0.1, "#8c510a",
      0.2, "#bf812d",
      0.3, "#dfc27d",
      0.4, "#f6e8c3",
      0.5, "#c7eae5",
      0.6, "#80cdc1",
      0.7, "#35978f",
      0.8, "#01665e",
      0.9, "#003c30"
    ]
  }

  function powerCircleRadius(year, indicator) {
    console.log('Configuring radius w/: ' + "all" + indicator + '.' + year)
    return [
      'interpolate',
      ['linear'],
      ['sqrt', ['to-number', ['get', "all" + indicator + '.' + year]]],
      0,
      0,
      // scale radius to the max of the selected indicator
      indicator == "gen_gwh" ? 2740 : 1380,
      100
    ]
  }

  // function powerLabel(year, indicator) {
  //   console.log('Configuring label')
  //   return [
  //     'concat',
  //     [
  //       'to-string',
  //       ['get', indicator + '.' + '.' + year]
  //     ],
  //     '?'
  //   ]
  // }

  function onDataLoaded(data) {
    console.log("Data loaded! Continuing initialisation...")
    console.log(data);

    // get initial control state
    const year = parseInt(document.querySelector('#slider').value, 10);
    const indicator =
      document.querySelector('input[name="indicatorGroup"]:checked').value;
      console.log("Slider is " + year + "; indicator is " + indicator);

    // format the time property we want to filter on
    // data.features = data.features.map((d) => {
    //   d.properties
    // })

    // create the map layer and labels
    map.addSource('power', {
      'type': 'geojson',
      data: data
      });
    map.addLayer({
      'id': 'power-circles',
      'type': 'circle',
      'source': 'power',
      'paint': {
        'circle-color': powerCircleColor(year, indicator),
        'circle-opacity': 0.75,
        'circle-radius': powerCircleRadius(year, indicator)
      }
    });
    // map.addLayer({
    //   'id': 'power-labels',
    //   'type': 'symbol',
    //   'source': 'power',
    //   'layout': {
    //     'text-field': ['concat', ['to-string', ['get', 'mag']], 'm'],
    //     'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    //     'text-size': 12
    //   },
    //   'paint': {
    //     'text-color': 'rgba(0,0,0,0.5)'
    //   }
    // });

    // initialise, then set up a callback for the input slider
    // filterBy(year, indicator)
    // filterBy(0);
    console.log("Attaching listeners...")
    document.getElementById('slider').addEventListener('input',
      updateMapState);
    document.getElementById('generated').addEventListener('input',
      updateMapState);
    document.getElementById('capacity').addEventListener('input',
      updateMapState);

    // TODO - add event listeners for radio buttons too
  }

  function onDataError(err) {
    console.log("Error loading data!");
    console.log(err);
  }

  // load data
  console.log("Loading data...")
  console.log(json);
  json(geoJSONFile).then(onDataLoaded, onDataError);

});



