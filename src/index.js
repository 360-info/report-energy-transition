
// import {csv} from 'd3-fetch'
// import csvFile from './data/irena-totals.csv'

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

console.log("Parcel linking correctly! Aha!")

mapboxgl.accessToken =
  'pk.eyJ1IjoiamFtZXMtZ29sZGllIiwiYSI6ImNrMjl1cjJzeDEwOXkzY28ybzZueHZvMG8ifQ.7bZwZ_XjBfm8kRDlkTlgZA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});