import {json} from 'd3-fetch'
import geoJSONFile from './data/irena-totals.geojson'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

console.log("Parcel linking correctly! Aha!")

mapboxgl.accessToken =
  'pk.eyJ1IjoiamFtZXMtZ29sZGllIiwiYSI6ImNrdnQzOXRkczd0ZWcybnFwNXEzMDV6OWEifQ.YRo6Wgm0Yf_JoPofQJfmlQ';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [0, 30],
  zoom: 2,
  logoPosition: 'bottom-right',
  attributionControl: false

});

// add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// toggleSidebar: adapted from https://codesandbox.io/s/bjiow
// use css classes to animate sidebar movement in or out
function toggleSidebar(id) 
{

  console.log('Toggling...');

  // check if sidebar is 'collapsed'
  var elem = document.getElementById(id);
  var classes = elem.className.split(' ');
  var collapsed = classes.indexOf('collapsed') !== -1;

  var padding = {};

  // bring the sidebar back by removing 'collapsed'
  if (collapsed) 
  {
    console.log('Restoring sidebar...');
    classes.splice(classes.indexOf('collapsed'), 1);

    // adjust the map view to match the sidebar's restoration
    padding[id] = 300;
    map.easeTo({
      padding: padding,
      duration: 500
    });

  } 
  // otherwise, send the sidebar away by adding 'collapsed'
  else 
  {
    console.log('Dismissing sidebar...');
    padding[id] = 0;
    classes.push('collapsed');

    // adjust the map view to match the sidebar's dismissal
    map.easeTo({
      padding: padding,
      duration: 500
    });
  }

  // Update the class list on the element
  elem.className = classes.join(' ');

}

/* onload: attach sidebar event listeners */
map.on('load', function () {
  
  // initialise sidebar state
  toggleSidebar('left');
  document
    .getElementById("sidebarToggleBtn")
    .addEventListener("click", function() {
      toggleSidebar('left');
    });

  // call this to change the column mapping of the bubbles and labels
  function updateMapState() {

    // get control state
    const year = document.querySelector('#slider').value;
    const powerSource =
      document.querySelector('input[name="powerTypeGroup"]:checked').value;
    const indicator =
      document.querySelector('input[name="indicatorGroup"]:checked').value;
    console.log("Slider is " + year + "; source is " + powerSource +
        "; indicator is " + indicator);

    // change column mapping of circles and labels
    map.setPaintProperty('power-circles', 'circle-color',
      powerCircleColor(year, powerSource, indicator));
    map.setPaintProperty('power-circles', 'circle-radius',
      powerCircleRadius(year, powerSource, indicator));
    
    // set the plot title to the selected year
    document.getElementById('plotTitle').textContent =
      'Power gen and capacity in ' + String(year);
  }

  function powerCircleColor(year, powerSource, indicator) {
    console.log('Configuring colour')
    return powerSource == 'renewable' ? '#2fedce' : '#cc7802';
    // return [
    //   'interpolate',
    //   ['linear'],
    //   ['to-number', ['get', indicator + '.' + powerSource + '.' + year]],
    //   0,
    //   // scale low colours (@ low opacity) based on powerSource
    //   powerSource == 'renewable' ? '#ffff0033' : '#7f312133',
    //   // scale radius to the max of the selected indicator
    //   indicator == 'totalgen_gw' ? 5518446 : 1306693,
    //   // scale max colours (@ full opacity) based on powerSource
    //   powerSource == 'renewable' ? '#ffff00ff' : '#7f3121ff'
    // ]
  }

  function powerCircleRadius(year, powerSource, indicator) {
    console.log('Configuring radius')
    return [
      'interpolate',
      ['linear'],
      ['to-number', ['get', indicator + '.' + powerSource + '.' + year]],
      0,
      0,
      // scale radius to the max of the selected indicator
      indicator == "totalgen_gw" ? 5518446 : 1306693,
      50
    ]
  }

  function powerLabel(year, powerSource, indicator) {
    console.log('Configuring label')
    return [
      'concat',
      [
        'to-string',
        ['get', indicator + '.' + powerSource + '.' + year]
      ],
      '?'
    ]
  }

  function onDataLoaded(data) {
    console.log("Data loaded! Continuing initialisation...")
    console.log(data);

    // get initial control state
    const year = parseInt(document.querySelector('#slider').value, 10);
    const powerSource =
      document.querySelector('input[name="powerTypeGroup"]:checked').value;
    const indicator =
      document.querySelector('input[name="indicatorGroup"]:checked').value;
      console.log("Slider is " + year + "; source is " + powerSource +
        "; indicator is " + indicator);

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
        'circle-color': powerCircleColor(year, powerSource, indicator),
        'circle-opacity': 0.75,
        'circle-radius': powerCircleRadius(year, powerSource, indicator)
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
    // filterBy(year, powerSource, indicator)
    // filterBy(0);
    console.log("Attaching listeners...")
    document.getElementById('slider').addEventListener('input',
      updateMapState);
    document.getElementById('renewable-power').addEventListener('input',
      updateMapState);
    document.getElementById('nonrenewable-power').addEventListener('input',
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



