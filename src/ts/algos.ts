import { Display } from "./display";
import { AlgoNames, Operations } from "./enums/enums";
import { CityDisplayData } from "./types/types";
import { sleep } from "./utils/utils";

export class Algos {
  INTERVAL: number;
  display: Display;

  // Converts from degrees to radians
  toRadians(numberInDegress: number) {
    return (numberInDegress * Math.PI) / 180;
  }

  constructor(display: Display, interval: number) {
    this.display = display;
    this.INTERVAL = interval;
  }

  resetCount() {
    this.display.compareCount = 0;
    this.display.swapCount = 0;
  }

  // While building a CityData object, calculates the distance between Grenoble and the given city
  distanceFromGrenoble(city: { [key: string]: string }) {
    const R = 6371;
    const GrenobleLat = this.toRadians(45.166667);
    const GrenobleLong = this.toRadians(5.716667);
    const cityLat = this.toRadians(parseFloat(city.latitude));
    const cityLong = this.toRadians(parseFloat(city.longitude));

    const deltaLat = cityLat - GrenobleLat;
    const deltaLong = cityLong - GrenobleLong;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(GrenobleLat) *
        Math.cos(cityLat) *
        Math.sin(deltaLong / 2) *
        Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;

    return d;
  }

  /**
   * Swap two cities in csvData and render the operation
   * @param i index of the first city
   * @param j index of the second city
   * @warning use await at each call of this method
   */
  async swap(i: number, j: number) {
    await sleep(this.INTERVAL); // Do not delete this line (for timing)
    this.display.oneStep([Operations.SWAP, i, j]); // Do not delete this line (for display)
    const temp = this.display.csvData[i];
    this.display.csvData[i] = this.display.csvData[j];
    this.display.csvData[j] = temp;
  }

  /**
   * Returns true if city with index i in csvData is closer to Grenoble than city with index j
   * @param i index of the first city
   * @param j index of the second city
   * @warning use await at each call of this method
   */
  async isLess(i: number, j: number) {
    await sleep(this.INTERVAL); // Do not delete this line (for timing)
    this.display.oneStep([Operations.COMPARE, i, j]); // Do not delete this line (for display)
    return this.display.csvData[i].dist < this.display.csvData[j].dist;
  }

  async shuffle() {
    for (let i = 0; i < this.display.csvData.length; i++) {
      const j = Math.floor(Math.random() * this.display.csvData.length);
      if (i !== j) {
        await this.swap(i, j);
      }
    }
  }

  async randomSort() {
    let sorted = false;
    while (!sorted) {
      sorted = true;
      for (let i = 0; i < this.display.csvData.length - 1; i++) {
        if (await this.isLess(i, i + 1)) {
          continue;
        }
        sorted = false;
        await this.shuffle();
        break;
      }
    }
  }

  async insertSort() {
    for (let i = 1; i < this.display.csvData.length; i++) {
      for (let j = i; j > 0 && await this.isLess(j, j - 1); j--) {
        await this.swap(j, j - 1);
      }
    }
  }

  async selectionSort() {
    for (let i = 0; i < this.display.csvData.length; i++) {
      let min = i;
      for (let j = i + 1; j < this.display.csvData.length; j++) {
        if (await this.isLess(j, min)) {
          min = j;
        }
      }
      if (min !== 1) {
        await this.swap(i, min);
      }
    }
  }

  async bubbleSort() {
    for (let i = 0; i < this.display.csvData.length; i++) {
      let flag = false;
      for (let j = 0; j < this.display.csvData.length - i - 1; j++) {
        if (await this.isLess(j + 1, j)) {
          flag = true;
          await this.swap(j, j + 1);
        }
      }
      if (!flag) {
        return;
      }
    }
  }

  gapsCalc(): number[] {
    let ciuraGaps = [1, 4, 10, 23, 57, 132, 301, 701];
    ciuraGaps = ciuraGaps.filter((e) => e < this.display.csvData.length);
    if (this.display.csvData.length > Math.round(701 * 2.3)) {
      let gap = 701;
      while (gap < this.display.csvData.length) {
        gap = Math.round(gap * 2.3);
      }
      ciuraGaps.push(gap);
    }

    return ciuraGaps;
  }

  async shellSort() {
    const gaps: number[] = this.gapsCalc();
    let gap: number = gaps.pop();
    while (gap > 0) {
      for (let i = gap; i < this.display.csvData.length; i++) {
        for (let j = i; j >= gap && await this.isLess(j, j - gap); j -= gap) {
          await this.swap(j, j - gap);
        }
      }
      gap = gaps.pop();
    }
  }

  async merge(start: number, end: number) {
    let middle = Math.floor((start + end) / 2);
    let start1 = start,
      start2 = middle + 1;
    let end1 = middle,
      end2 = end;

    let index = start;
    let intermediate = [];

    while (start1 <= end1 && start2 <= end2) {
      if (await this.isLess(start1, start2)) {
        intermediate[index] = this.display.csvData[start1];
        index++;
        start1++;
      } else if (await this.isLess(start2, start1)) {
        intermediate[index] = this.display.csvData[start2];
        index++;
        start2++;
      }
    }

    while (start1 <= end1) {
      intermediate[index] = this.display.csvData[start1];
      index++;
      start1++;
    }

    while (start2 <= end2) {
      intermediate[index] = this.display.csvData[start2];
      index++;
      start2++;
    }

    index = start;

    while (index <= end) {
      // resource hungry operation intended to display the compare operation
      let originalIndex: number = this.display.csvData.findIndex(
        (e) => e.dist == intermediate[index].dist
      );
      if (originalIndex >= 0) await this.swap(originalIndex, index);
      index++;
    }
  }

  async mergeSort(start = 0, end = this.display.csvData.length - 1) {
    if (start < end) {
      const middle = Math.floor((start + end) / 2);
      await this.mergeSort(start, middle);
      await this.mergeSort(middle + 1, end);
      await this.merge(start, end);
    }
  }

  async heapify(heapSize = this.display.csvData.length, parentIndex = 0) {
    let larger = parentIndex;
    let letfChildIndex = 2 * parentIndex + 1;
    let rightChildIndex = 2 * parentIndex + 2;
    if (letfChildIndex < heapSize && await this.isLess(larger, letfChildIndex)) {
      larger = letfChildIndex;
    }
    if (rightChildIndex < heapSize && await this.isLess(larger, rightChildIndex)) {
      larger = rightChildIndex;
    }
    if (larger !== parentIndex) {
      await this.swap(parentIndex, larger);
      await this.heapify(heapSize, larger);
    }
  }

  async heapSort() {
    // Build max heap
    for (let i = Math.floor(this.display.csvData.length / 2); i >= 0; i--) {
      await this.heapify(this.display.csvData.length, i);
    }
    // Swap indexes
    for (let i = this.display.csvData.length - 1; i > 0; i--) {
      await this.swap(0, i);
      await this.heapify(i, 0);
    }
  }

  async partition(start: number, end: number) {
    const pivot = this.display.csvData[end] as CityDisplayData;
    const pivotValue = pivot.dist;
    pivot.is_pivot = true;
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
      // resource hungry operation intended to display the compare operation
      const originalIndex = this.display.csvData.findIndex(
        (e) => e.dist == pivotValue
      );
      if (await this.isLess(i, originalIndex)) {
        await this.swap(i, pivotIndex);
        pivotIndex++;
      }
    }
    await this.swap(pivotIndex, end);
    return pivotIndex;
  }

  async quickSort(start = 0, end = this.display.csvData.length - 1) {
    if (start < end) {
      const index = await this.partition(start, end);
      await this.quickSort(start, index - 1);
      await this.quickSort(index + 1, end);
    }
  }

  async partition3(start: number, end: number) {
    const pivotValue = this.display.csvData[start].dist;
    let pivotIndex = start;
    let secondPivotIndex = end;
    let i = start + 1;

    while (i <= secondPivotIndex) {
      // resource hungry operation intended to display the compare operation
      const originalIndex = this.display.csvData.findIndex(
        (e) => e.dist == pivotValue
      );
      if (await this.isLess(i, originalIndex)) {
        await this.swap(i, pivotIndex);
        pivotIndex++;
        i++;
      } else if (await this.isLess(originalIndex, i)) {
        await this.swap(i, secondPivotIndex);
        secondPivotIndex--;
      } else {
        i++;
      }
    }
    return [pivotIndex, secondPivotIndex];
  }

  async quick3Sort(start = 0, end = this.display.csvData.length - 1) {
    if (start < end) {
      const index = await this.partition3(start, end);
      await this.quick3Sort(start, index[0] - 1);
      await this.quick3Sort(index[1] + 1, end);
    }
  }

  sort(algo: AlgoNames) {
    this.resetCount();
    switch (algo) {
      case AlgoNames.RANDOM:
        this.randomSort();
        break;
      case AlgoNames.INSERT:
        this.insertSort();
        break;
      case AlgoNames.SELECT:
        this.selectionSort();
        break;
      case AlgoNames.BUBBLE:
        this.bubbleSort();
        break;
      case AlgoNames.SHELL:
        this.shellSort();
        break;
      case AlgoNames.MERGE:
        this.mergeSort();
        break;
      case AlgoNames.HEAP:
        this.heapSort();
        break;
      case AlgoNames.QUICK:
        this.quickSort();
        break;
      case AlgoNames.QUICK3:
        this.quick3Sort();
        break;
      default:
        throw "Invalid algorithm " + algo;
    }
  }
}
