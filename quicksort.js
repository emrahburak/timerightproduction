function quicksort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);

  return [...quicksort(left), pivot, ...quicksort(right)];
}

// Usage example
const numbers = [34, 7, 23, 32, 5, 62];
console.log(quicksort(numbers)); // Output: [5, 7, 23, 32, 34, 62]
