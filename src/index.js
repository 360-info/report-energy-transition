
import '../node_modules/leaflet/dist/leaflet.css'
import 'leaflet'
import '../node_modules/leaflet-sidebar-v2/css/leaflet-sidebar.css'
import 'leaflet-sidebar-v2'
import * as csvParser from 'papaparse'
import csvFile from './data/irena.csv'

console.log("Parcel linking correctly! Aha!")

let map = L.map("map", {
  zoom: 5,
  center: { lat: -37, lon: 140 } 
})

L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  }).addTo(map)


/* initalise the sidebar */

// create the sidebar instance and add it to the map
var sidebar = L.control.sidebar({ container: "sidebar" })
  .addTo(map)
  .open("home");

// be notified when a panel is opened
sidebar.on("content", function (ev) {
    switch (ev.id) {
        case "autopan":
        sidebar.options.autopan = true;
        break;
        default:
        sidebar.options.autopan = false;
    }
});

/* load the data and initialise its layers */
console.log(csvFile);
// const csvFile = new URL('data/irena.csv', import.meta.url);
csvParser.parse(csvFile, {
  download: true,
  complete: function(data) {
    console.log(data);

    // marker adding goes here!
  }
})