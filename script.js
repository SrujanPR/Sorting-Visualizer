const arrayContainer = document.getElementById("array-container");
const generateArrayButton = document.getElementById("generate-array");
const inputArrayButton = document.getElementById("input-array");
const startSortingButton = document.getElementById("start-sorting");
const stopSortingButton = document.getElementById("stop-sorting");
const previousStepButton = document.getElementById("previous-step");
const speedSlider = document.getElementById("speed");
const themeToggle = document.getElementById("theme-toggle");
const descriptionDiv = document.getElementById("description");
const dropdownButton = document.getElementById("dropdown-button");
const dropdownContent = document.getElementById("dropdown-content");

let array = [];
let history = [];
let stopSorting = false;
let delay = 100;
let selectedAlgorithm = "bubble"; // default

// Theme Toggle
const icon = document.getElementById("icon");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  icon.textContent = document.body.classList.contains("light-mode") ? "🌙" : "☀️";
});

// Dropdown Handling
dropdownButton.addEventListener("click", () => {
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});

dropdownContent.querySelectorAll("div").forEach((item) => {
  item.addEventListener("click", () => {
    selectedAlgorithm = item.dataset.value;
    dropdownButton.textContent = `${item.textContent} ▼`;
    const info = algorithmInfo[selectedAlgorithm];
    document.getElementById("algo-desc").textContent = info.desc;
    document.getElementById("algo-time").textContent = info.time;
    document.getElementById("algo-space").textContent = info.space;
    dropdownContent.style.display = "none";
  });
});


// Descriptions of Sorting Algorithms
const algorithmInfo = {
  bubble: {
    desc: "Bubble Sort: Repeatedly compares adjacent elements and swaps them if they are in the wrong order.",
    time: "Time Complexity: Best O(n), Average O(n²), Worst O(n²)",
    space: "Space Complexity: O(1)"
  },
  selection: {
    desc: "Selection Sort: Selects the smallest element from the unsorted part and swaps it with the first element.",
    time: "Time Complexity: Best O(n²), Average O(n²), Worst O(n²)",
    space: "Space Complexity: O(1)"
  },
  insertion: {
    desc: "Insertion Sort: Builds the sorted array one item at a time by inserting elements into their correct positions.",
    time: "Time Complexity: Best O(n), Average O(n²), Worst O(n²)",
    space: "Space Complexity: O(1)"
  },
  merge: {
    desc: "Merge Sort: Divides the array into halves, sorts them, and then merges the sorted halves.",
    time: "Time Complexity: Best O(n log n), Average O(n log n), Worst O(n log n)",
    space: "Space Complexity: O(n)"
  },
  quick: {
    desc: "Quick Sort: Picks a pivot and partitions the array into elements smaller and larger than the pivot.",
    time: "Time Complexity: Best O(n log n), Average O(n log n), Worst O(n²)",
    space: "Space Complexity: O(log n)"
  },
  heap: {
    desc: "Heap Sort: Converts the array into a heap and repeatedly extracts the maximum element.",
    time: "Time Complexity: Best O(n log n), Average O(n log n), Worst O(n log n)",
    space: "Space Complexity: O(1)"
  }
};


// Generate Random Array
function generateArray() {
  stopSorting = true;
  arrayContainer.innerHTML = "";
  array = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 10);
  history = [];
  displayArray();
}

// Display Array
function displayArray() {
  arrayContainer.innerHTML = "";
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 3}px`;
    const valueSpan = document.createElement("span");
    valueSpan.textContent = value;
    bar.appendChild(valueSpan);
    arrayContainer.appendChild(bar);
  });
}

// Input Custom Array
function inputArray() {
  stopSorting = true;
  const input = prompt("Enter numbers separated by commas:");
  if (input) {
    array = input.split(",").map(Number).filter((num) => !isNaN(num));
    history = [];
    displayArray();
  }
}

// Helper Function to Swap Bars
function swapBars(bar1, bar2) {
  const tempHeight = bar1.style.height;
  const tempValue = bar1.firstChild.textContent;
  bar1.style.height = bar2.style.height;
  bar1.firstChild.textContent = bar2.firstChild.textContent;
  bar2.style.height = tempHeight;
  bar2.firstChild.textContent = tempValue;
}

// Save Current Array State
function saveState() {
  history.push([...array]);
}

// Revert to Previous State
function revertToPreviousState() {
  if (history.length > 0) {
    array = history.pop();
    displayArray();
  }
}

// Bubble Sort
async function bubbleSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (stopSorting) return;
      bars[j].style.backgroundColor = "red";
      bars[j + 1].style.backgroundColor = "red";
      if (array[j] > array[j + 1]) {
        saveState();
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapBars(bars[j], bars[j + 1]);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      bars[j].style.backgroundColor = "var(--bar-color)";
      bars[j + 1].style.backgroundColor = "var(--bar-color)";
    }
    bars[array.length - i - 1].style.backgroundColor = "green";
  }
}

// Selection Sort
async function selectionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length; i++) {
    if (stopSorting) return;
    let minIndex = i;
    bars[minIndex].style.backgroundColor = "red";
    for (let j = i + 1; j < array.length; j++) {
      if (stopSorting) return;
      bars[j].style.backgroundColor = "blue";
      if (array[j] < array[minIndex]) {
        bars[minIndex].style.backgroundColor = "var(--bar-color)";
        minIndex = j;
        bars[minIndex].style.backgroundColor = "red";
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      bars[j].style.backgroundColor = "var(--bar-color)";
    }
    if (minIndex !== i) {
      saveState();
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      swapBars(bars[i], bars[minIndex]);
    }
    bars[i].style.backgroundColor = "green";
  }
}

// Insertion Sort
async function insertionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 1; i < array.length; i++) {
    if (stopSorting) return;
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      if (stopSorting) return;
      saveState();
      array[j + 1] = array[j];
      swapBars(bars[j], bars[j + 1]);
      j--;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    array[j + 1] = key;
  }
  displayArray();
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
  if (start < end) {
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
  }
}

async function merge(start, mid, end) {
  if (stopSorting) return;
  const tempArray = [];
  const bars = document.getElementsByClassName("bar");
  let i = start, j = mid + 1;
  while (i <= mid && j <= end) {
    if (stopSorting) return;
    bars[i].style.backgroundColor = "red";
    bars[j].style.backgroundColor = "red";
    if (array[i] <= array[j]) {
      tempArray.push(array[i++]);
    } else {
      tempArray.push(array[j++]);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  while (i <= mid) tempArray.push(array[i++]);
  while (j <= end) tempArray.push(array[j++]);
  for (let k = start; k <= end; k++) {
    array[k] = tempArray[k - start];
    bars[k].style.height = `${array[k] * 3}px`;
    bars[k].firstChild.textContent = array[k];
    bars[k].style.backgroundColor = "green";
  }
}

// Quick Sort
async function quickSort(low = 0, high = array.length - 1) {
  if (low < high) {
    const pi = await partition(low, high);
    if (pi === -1) return;
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  const pivot = array[high];
  const bars = document.getElementsByClassName("bar");
  let i = low - 1;
  bars[high].style.backgroundColor = "red";
  for (let j = low; j < high; j++) {
    if (stopSorting) return -1;
    bars[j].style.backgroundColor = "blue";
    if (array[j] < pivot) {
      i++;
      saveState();
      [array[i], array[j]] = [array[j], array[i]];
      swapBars(bars[i], bars[j]);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    bars[j].style.backgroundColor = "var(--bar-color)";
  }
  saveState();
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  swapBars(bars[i + 1], bars[high]);
  return i + 1;
}

// Heap Sort
async function heapSort() {
  const n = array.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    if (stopSorting) return;
    saveState();
    [array[0], array[i]] = [array[i], array[0]];
    swapBars(document.getElementsByClassName("bar")[0], document.getElementsByClassName("bar")[i]);
    await new Promise((resolve) => setTimeout(resolve, delay));
    await heapify(i, 0);
  }
}

async function heapify(n, i) {
  if (stopSorting) return;
  const bars = document.getElementsByClassName("bar");
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  if (left < n && array[left] > array[largest]) largest = left;
  if (right < n && array[right] > array[largest]) largest = right;
  if (largest !== i) {
    saveState();
    [array[i], array[largest]] = [array[largest], array[i]];
    swapBars(bars[i], bars[largest]);
    await new Promise((resolve) => setTimeout(resolve, delay));
    await heapify(n, largest);
  }
}

// Sorting Button Code:
startSortingButton.addEventListener("click", () => {
  stopSorting = false;
  if (selectedAlgorithm === "bubble") bubbleSort();
  else if (selectedAlgorithm === "selection") selectionSort();
  else if (selectedAlgorithm === "insertion") insertionSort();
  else if (selectedAlgorithm === "merge") mergeSort();
  else if (selectedAlgorithm === "quick") quickSort();
  else if (selectedAlgorithm === "heap") heapSort();
});

// Speed Control
speedSlider.addEventListener("input", () => {
  delay = parseInt(speedSlider.value);
});

// Button Events
generateArrayButton.addEventListener("click", generateArray);
inputArrayButton.addEventListener("click", inputArray);
stopSortingButton.addEventListener("click", () => (stopSorting = true));
previousStepButton.addEventListener("click", revertToPreviousState);

// Initialize
generateArray();
