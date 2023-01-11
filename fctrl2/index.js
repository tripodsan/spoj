/* global readline, print */

const BASE = 1e7;
const BASE_LOG_10 = 7;

function mul(a, n) {
  const l = a.length;
  const r = new Array(l);
  let c = 0;
  let i = 0;
  while (i < a.length) {
    const p = a[i] * n + c;
    c = Math.floor(p / BASE);
    r[i++] = p - c * BASE;
  }
  while (c > 0) {
    r[i++] = c % BASE;
    c = Math.floor(c / BASE);
  }
  return r;
}

function toString(v) {
  let l = v.length;
  let str = String(v[--l]);
  while (--l >= 0) {
    str += String(v[l]).padStart(BASE_LOG_10, '0');
  }
  return str;
}

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
let n = 1;
let f = [1];
for (let i = 0; i < num; i++) {
  const [idx, m] = tests[i];
  while (n <= m) {
    f = mul(f, n);
    n++;
  }
  results[idx] = toString(f);
}

print(results.join('\n'));
