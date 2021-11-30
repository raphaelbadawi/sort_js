import { cityData } from "./types/types";
const d3 = require("d3");
import { Display } from "./display";

let csvData = null;
let timer = null;

document.querySelector("#start-btn").addEventListener("click", () => {
  csvData = null;
  const display: Display = new Display();
  const dataSet = document.querySelector("#data-set") as HTMLSelectElement;

  d3.dsv(";", dataSet.options[dataSet.selectedIndex].value, (d: cityData) => {
    return {
      num_dpt: +d.num_dpt, // convert "Year" column to Date
      latitude: +d.latitude,
      longitude: +d.longitude,
      nom_ddpt: d.nom_ddpt,
      nom_commune: d.nom_commune,
      codes_postaux: d.codes_postaux,
      dist: distanceFromGrenoble(d),
      str:
        d.nom_commune +
        " (" +
        d.num_dpt +
        ") " +
        Math.floor(distanceFromGrenoble(d)) +
        "km",
    };
  }).then((data: cityData[]) => {
    display.setData(data);

    console.log("Data loaded ...", csvData);

    display.setupDisplay();

    // Sort csvData
    const algoSelect = document.querySelector(
      "#algo-select"
    ) as HTMLSelectElement;
    const algo = algoSelect.options[algoSelect.selectedIndex].value;
    sort(algo);

    // Start the animated display
    const intervalInput = document.querySelector(
      "#interval"
    ) as HTMLInputElement;
    const interval = parseInt(intervalInput.value);
    clearInterval(timer);
    timer = window.setInterval(function () {
      display.oneStep();
    }, interval);
  });
});
