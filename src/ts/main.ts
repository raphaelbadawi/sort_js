require("../scss/_main.scss");
const d3 = require("d3");
import { CityData } from "./types/types";
import { Display } from "./display";
import { Algos } from "./algos";
import { AlgoNames } from "./enums/enums";

// Toggle notifications depending on selected algo
document.querySelector("#algo-select").addEventListener("change", ({ target }) => {
  const value: AlgoNames = (target as HTMLSelectElement).options[(target as HTMLSelectElement).selectedIndex].value as AlgoNames;
  if (value == AlgoNames.QUICK || value == AlgoNames.QUICK3) {
    document.querySelector("#quickSortNotification").classList.remove("is-invisible");
    return;
  }
  document.querySelector("#quickSortNotification").classList.add("is-invisible");
})

// Launch selected algo with its associated display on click
document.querySelector("#start-btn").addEventListener("click", () => {
  document.querySelectorAll(".sortNotification").forEach((el) => el.classList.remove("is-invisible"));

  // Start the animated display
  const intervalInput = document.querySelector(
    "#interval"
  ) as HTMLInputElement;
  const interval = parseInt(intervalInput.value);
  const display: Display = new Display();
  const algos: Algos = new Algos(display, interval);
  const dataSet = document.querySelector("#data-set") as HTMLSelectElement;

  d3.dsv(";", dataSet.options[dataSet.selectedIndex].value, (d: {[key: string]: string}): CityData => {
    return {
      num_dpt: +d.num_dpt, // convert "Year" column to Date
      latitude: +d.latitude,
      longitude: +d.longitude,
      nom_ddpt: d.nom_ddpt,
      nom_commune: d.nom_commune,
      codes_postaux: d.codes_postaux,
      dist: algos.distanceFromGrenoble(d),
      str: `${d.nom_commune} ( ${d.num_dpt} ) ${Math.floor(algos.distanceFromGrenoble(d))} km`
    };
  }).then((data: CityData[]) => {
    algos.display.setData(data);
    console.log("Data loaded ...", algos.display.csvData);

    algos.display.setupDisplay();

    // Sort csvData
    const algoSelect = document.querySelector(
      "#algo-select"
    ) as HTMLSelectElement;
    const algo = algoSelect.options[algoSelect.selectedIndex].value as AlgoNames;
    algos.sort(algo);
  });
});
