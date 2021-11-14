
// import {csv} from 'd3-fetch'
// import csvFile from './data/irena-totals.csv'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

console.log("Parcel linking correctly! Aha!")

mapboxgl.accessToken =
  'pk.eyJ1IjoiamFtZXMtZ29sZGllIiwiYSI6ImNrdnQzOXRkczd0ZWcybnFwNXEzMDV6OWEifQ.YRo6Wgm0Yf_JoPofQJfmlQ';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
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
    toggleSidebar('left');

    document
      .getElementById("sidebarToggleBtn")
      .addEventListener("click", function() {
        toggleSidebar('left');
      });
});



