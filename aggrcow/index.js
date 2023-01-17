/* global readline, print */

/*
  algorithm: binary search over the minimum cow distance to find its maximum.
  given f(n), where n is the minimum cow distance, f(n) returns -1 if  there are not enough
  cows to fill the stalls with the given distance N, and 1 if there are too many cows for the
  given distance.
 */

function findDistance(stalls, N, C) {
  const L = N - 1; // length od deltas

  // starting high mark
  let hi = stalls[L] - stalls[0];
  // trivial case
  if (C === 2) {
    return hi;
  }

  // we're only interested in the differences between stalls, so calc the deltas
  let deltas = new Array(L);
  for (let i = 0; i < L; i++) {
    deltas[i] = stalls[i + 1] - stalls[i];
  }

  // find minimum distance between to stalls. this is the starting low.
  let lo = hi;
  for (let i = 0; i < L; i++) {
    lo = Math.min(lo, deltas[i]);
  }
  // binary search
  while (lo < hi) {
    let m = (hi + lo) / 2;
    // console.log(`lo=${lo} hi=${hi} m=${m}`);
    // fill stalls
    let i = 0;
    let s = 0;
    let c = 1; // start with 1 cow
    while (i < L && c < C) {
      // add the distance to the next stall
      s += deltas[i++];
      if (s >= m) {
        // if the minimum distance is reached, place a cow
        c++;
        s = 0;
      }
    }
    // console.log(`i=${i} L=${L} c=${c} C=${C}`);
    if (i < L || c === C) {
      // there is still more room, so we can increase the minimum distance
      lo = Math.ceil(m);
    } else  {
      // not enough room
      hi = Math.floor(m);
    }

  }
  return lo;
}

const numTests = parseInt(readline(), 10);
for (let i = 0; i < numTests; i++) {
  const [N, C] = readline().split(/\s+/).map((d) => parseInt(d, 10));
  const stalls = new Array(N);
  let i = 0;
  while (i < N) {
    // also support multiple numbers on a single line to simplify test inputs
    const line = readline().split(/\s+/).map((d) => parseInt(d, 10));
    for (let j = 0; j < line.length; j++) {
      stalls[i++] = line[j];
    }
  }
  stalls.sort((c0, c1) => c0 - c1);
  print(findDistance(stalls, N, C));
}
