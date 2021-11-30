import { Display } from "./display";
import { cityData } from "./types/types";

export class Algos {
    display: Display;
    // Converts from degrees to radians.
    toRadians(numberInDegress: number) {
        return (numberInDegress * Math.PI) / 180;
    };

    constructor(display: Display) {
        this.display = display;
    }
  
    resetCount() {
        if (!this.display.compareCountElement.classList.contains("d-none")) {
            this.display.compareCountElement.classList.add("d-none");
        }
        if (!this.display.swapCountElement.classList.contains("d-none")) {
            this.display.swapCountElement.classList.add("d-none");
        }

        this.display.compareCount = 0;
        this.display.swapCount = 0;
    }
  
  // Calculates the distance between Grenoble and the given city
    distanceFromGrenoble(city: cityData) {
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
  
  // Swap 2 values in array csvData
  // i is the index of the first city
  // j is the index of the second city
  function swap(i, j) {
    displayBuffer.push(["swap", i, j]); // Do not delete this line (for display)
    const temp = csvData[i];
    csvData[i] = csvData[j];
    csvData[j] = temp;
  }
  
  // Returns true if city with index i in csvData is closer to Grenoble than city with index j
  // i is the index of the first city
  // j is the index of the second city
  function isLess(i, j) {
    displayBuffer.push(["compare", i, j]); // Do not delete this line (for display)
    return csvData[i].dist < csvData[j].dist;
  }
  
  function shuffle() {
    for (let i = 0; i < csvData.length; i++) {
      const j = Math.floor(Math.random() * csvData.length);
      if (i !== j) swap(i, j);
    }
  }
  
  function randomsort() {
    let sorted = false;
    while (!sorted) {
      sorted = true;
      for (let i = 0; i < csvData.length - 1; i++) {
        if (isLess(i, i + 1)) {
          continue;
        }
        sorted = false;
        shuffle();
        break;
      }
    }
  }
  
  function insertsort() {
    resetCount();
    for (let i = 1; i < csvData.length; i++) {
      for (let j = i; j > 0 && isLess(j, j - 1); j--) {
        swap(j, j - 1);
      }
    }
  }
  
  function selectionsort() {
    resetCount();
    for (let i = 0; i < csvData.length; i++) {
      let min = i;
      for (let j = i + 1; j < csvData.length; j++) {
        if (isLess(j, min)) {
          min = j;
        }
      }
      if (min !== 1) {
        swap(i, min);
      }
    }
  }
  
  function bubblesort() {
    resetCount();
    for (let i = 0; i < csvData.length; i++) {
      let flag = false;
      for (let j = 0; j < csvData.length - i - 1; j++) {
        if (isLess(j + 1, j)) {
          flag = true;
          swap(j, j + 1);
        }
      }
      if (!flag) {
        return;
      }
    }
  }
  
  function gapscalc() {
    let ciuraGaps = [1, 4, 10, 23, 57, 132, 301, 701];
    ciuraGaps = ciuraGaps.filter((e) => e < csvData.length);
    if (csvData.length > Math.round(701 * 2.3)) {
      let gap = 701;
      while (gap < csvData.length) {
        gap = Math.round(gap * 2.3);
      }
      ciuraGaps.push(gap);
    }
  
    return ciuraGaps;
  }
  
  function shellsort() {
    resetCount();
    gaps = gapscalc();
    gap = gaps.pop();
    while (gap > 0) {
      for (let i = gap; i < csvData.length; i++) {
        for (let j = i; j >= gap && isLess(j, j - gap); j -= gap) {
          swap(j, j - gap);
        }
      }
      gap = gaps.pop();
    }
  }
  
  function merge(start, end) {
    let middle = Math.floor((start + end) / 2);
    let start1 = start,
      start2 = middle + 1;
    let end1 = middle,
      end2 = end;
  
    let index = start;
    let intermediate = [];
  
    while (start1 <= end1 && start2 <= end2) {
      if (isLess(start1, start2)) {
        intermediate[index] = csvData[start1];
        index++;
        start1++;
      } else if (isLess(start2, start1)) {
        intermediate[index] = csvData[start2];
        index++;
        start2++;
      }
    }
  
    while (start1 <= end1) {
      intermediate[index] = csvData[start1];
      index++;
      start1++;
    }
  
    while (start2 <= end2) {
      intermediate[index] = csvData[start2];
      index++;
      start2++;
    }
  
    index = start;
  
    while (index <= end) {
      // resource hungry operation intended to display the compare operation
      originalIndex = csvData.findIndex(
        (e) => e.dist == intermediate[index].dist
      );
      if (originalIndex >= 0) swap(originalIndex, index);
      index++;
    }
  }
  
  function mergesort(start = 0, end = csvData.length - 1) {
    resetCount();
    if (start < end) {
      const middle = Math.floor((start + end) / 2);
      mergesort(start, middle);
      mergesort(middle + 1, end);
      merge(start, end);
    }
  }
  
  function heapify(heapSize = csvData.length, parentIndex = 0) {
    let larger = parentIndex;
    let letfChildIndex = 2 * parentIndex + 1;
    let rightChildIndex = 2 * parentIndex + 2;
    if (letfChildIndex < heapSize && isLess(larger, letfChildIndex)) {
      larger = letfChildIndex;
    }
    if (rightChildIndex < heapSize && isLess(larger, rightChildIndex)) {
      larger = rightChildIndex;
    }
    if (larger !== parentIndex) {
      swap(parentIndex, larger);
      heapify(heapSize, larger);
    }
  }
  
  function heapsort() {
    resetCount();
    // Build max heap
    for (let i = Math.floor(csvData.length / 2); i >= 0; i--) {
      heapify(csvData.length, i);
    }
    // Swap indexes
    for (let i = csvData.length - 1; i > 0; i--) {
      swap(0, i);
      heapify(i, 0);
    }
  }
  
  function partition(start, end) {
    const pivotValue = csvData[end].dist;
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
      // resource hungry operation intended to display the compare operation
      const originalIndex = csvData.findIndex((e) => e.dist == pivotValue);
      if (isLess(i, originalIndex)) {
        swap(i, pivotIndex);
        pivotIndex++;
      }
    }
    swap(pivotIndex, end);
    return pivotIndex;
  }
  
  function quicksort(start = 0, end = csvData.length - 1) {
    resetCount();
    if (start < end) {
      const index = partition(start, end);
      quicksort(start, index - 1);
      quicksort(index + 1, end);
    }
  }
  
  function partition3(start, end) {
    const pivotValue = csvData[start].dist;
    let pivotIndex = start;
    let secondPivotIndex = end;
    let i = start + 1;
  
    while (i <= secondPivotIndex) {
      // resource hungry operation intended to display the compare operation
      const originalIndex = csvData.findIndex((e) => e.dist == pivotValue);
      if (isLess(i, originalIndex)) {
        swap(i, pivotIndex);
        pivotIndex++;
        i++;
      } else if (isLess(originalIndex, i)) {
        swap(i, secondPivotIndex);
        secondPivotIndex--;
      } else {
        i++;
      }
    }
    return [pivotIndex, secondPivotIndex];
  }
  
  function quick3sort(start = 0, end = csvData.length - 1) {
    resetCount();
    if (start < end) {
      const index = partition3(start, end);
      quick3sort(start, index[0] - 1);
      quick3sort(index[1] + 1, end);
    }
  }
  
  function sort(algo) {
    switch (algo) {
      case "random":
        randomsort();
        break;
      case "insert":
        insertsort();
        break;
      case "select":
        selectionsort();
        break;
      case "bubble":
        bubblesort();
        break;
      case "shell":
        shellsort();
        break;
      case "merge":
        mergesort();
        break;
      case "heap":
        heapsort();
        break;
      case "quick":
        quicksort();
        break;
      case "quick3":
        quick3sort();
        break;
      default:
        throw "Invalid algorithm " + algo;
    }
  }  
}