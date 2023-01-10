/* global readline, print */

// read all tests first
const num = parseInt(readline(), 10);
const tests = new Array(num);
for (let i = 0; i < num; i++) {
  tests[i] = [i, parseInt(readline(), 10)];
}

// sort by N
tests.sort((t0, t1) => t0[1] - t1[1]);

// solve
let n = 1;
let zeros = 0;
for (let i = 0; i < num; i++) {
  const test = tests[i];
  const m = test[1];
  while (n <= m) {
    if (n % 5 === 0) {
      let f = n;
      while (f % 5 === 0) {
        zeros++;
        f /= 5;
      }
    }
    n++;
  }
  test[1] = zeros;
}

// sort by index
tests.sort((t0, t1) => t0[0] - t1[0]);

print(tests.map((t) => t[1]).join('\n'));
