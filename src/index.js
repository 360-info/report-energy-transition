
import '../node_modules/leaflet/dist/leaflet.css'
import 'leaflet'
import '../node_modules/leaflet-sidebar-v2/css/leaflet-sidebar.css'
import 'leaflet-sidebar-v2'
import {csv} from 'd3-fetch'
import csvFile from './data/irena-totals.csv'

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
// csvParse(csvFile, {
//   download: true,
//   header: true,
//   complete: function(data) {
//     console.log(data);


//   }
// })

csv(csvFile).then((d) => {
  console.log(d);

  //     // 1. initialise + populate menus

  //     // 2. add menu callbacks:
  //     //   - clear markers
  //     //   - recreate markers based on selections

})
