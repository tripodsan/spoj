/* global readline, print */

// read all tests first
const num = parseInt(readline(), 10);
const tests = new Array(num);
const results = new Array(num);
for (let i = 0; i < num; i++) {
  tests[i] = [i, parseInt(readline(), 10)];
}

// sort by N
tests.sort((t0, t1) => t0[1] - t1[1]);

// solve
let n = 5;
let zeros = 0;
for (let i = 0; i < num; i++) {
  const [idx, m] = tests[i];
  while (n <= m) {
    let f = n;
    while (f % 5 === 0) {
      zeros++;
      f /= 5;
    }
    n+= 5;
  }
  results[idx] = zeros;
}

print(results.join('\n'));
