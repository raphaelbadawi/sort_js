import { CityData } from "./types/types";

export abstract class DataHolder {
  csvData: CityData[];

  setData(data: CityData[]) {
    function num_dptIsntNAN(elt: CityData): boolean {
      return !(isNaN(elt.dist) || elt.latitude == 0 || elt.longitude == 0);
    }

    this.csvData = data.filter(num_dptIsntNAN);
  }
}
