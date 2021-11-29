// Converts from degrees to radians.
Number.prototype.toRadians = function() {
  return this * Math.PI / 180;
};


// Calculates the distance between Grenoble and the given city
function distanceFromGrenoble(city)
{
  const R = 6371;
  const GrenobleLat = 45.166667.toRadians();
  const GrenobleLong = 5.716667.toRadians();
  const cityLat = parseFloat(city.latitude).toRadians();
  const cityLong = parseFloat(city.longitude).toRadians();

  const deltaLat = cityLat - GrenobleLat;
  const deltaLong = cityLong - GrenobleLong;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(GrenobleLat) * Math.cos(cityLat) *
            Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c;

  return d;
}

// Swap 2 values in array csvData
// i is the index of the first city
// j is the index of the second city
function swap(i,j)
{
  displayBuffer.push(['swap', i, j]); // Do not delete this line (for display)
  const temp = csvData[i];
  csvData[i] = csvData[j];
  csvData[j] = temp;
}

// Returns true if city with index i in csvData is closer to Grenoble than city with index j
// i is the index of the first city
// j is the index of the second city
function isLess(i, j)
{
  displayBuffer.push(['compare', i, j]); // Do not delete this line (for display)
  return csvData[i].dist < csvData[j].dist;
}

function shuffle()
{
  for (let i = 0; i < csvData.length; i++) {
    const j = Math.floor(Math.random() * csvData.length);
    swap(i, j);
  }
}

function randomsort()
{
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 0; i < csvData.length - 1; i++) {
      if (isLess(i, i + 1)) {
        continue;
      }
    sorted = false;
    shuffle();
    }
  }
}

function insertsort()
{
  for (let i = 1; i < csvData.length; i++) {
    for (let j= i; j > 0 && isLess(j, j - 1); j--) {
      swap(j, j - 1);
    }
  }
  console.log(csvData);
}

function selectionsort()
{
  for (let i = 0; i < csvData.length; i++) {
    let min = i;
    for (let j = i + 1; j < csvData.length; j++) {
      if (isLess(j, min)) {
        min = j;      }
    }
    if (min  !== 1) {
      swap(i, min);
    }
  }
}

function bubblesort()
{
  for (let i = 0; i < csvData.length ; i++) {
    for(let j = 0 ; j < csvData.length - i - 1; j++) {
      if (isLess(j + 1, j)) {
        swap(j, j + 1);
      }
   }
  }
}

function shellsort()
{
  console.log("shellsort - implement me !");
}

function mergesort()
{
  console.log("mergesort - implement me !");
}

function heapsort()
{
  console.log("heapsort - implement me !");
}

function quicksort()
{
  console.log("quicksort - implement me !");
}
function quick3sort()
{
  console.log("quick3sort - implement me !");
}


function sort(algo)
{
  switch (algo)
  {
    case 'random': randomsort();break;
    case 'insert': insertsort();break;
    case 'select': selectionsort();break;
    case 'bubble': bubblesort();break;
    case 'shell': shellsort();break;
    case 'merge': mergesort();break;
    case 'heap': heapsort();break;
    case 'quick': quicksort();break;
    case 'quick3': quick3sort();break;
    default: throw 'Invalid algorithm ' + algo;
  }
}
