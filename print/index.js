/* global readline, print */

function primes(max, r0, r1) {
  const res = [];
  const len = Math.sqrt(max);
  const ret = [];
  const prime = new Array(max + 1).fill(true);
  for (let i = 2; i <= max; i++) {
    if (prime[i] === true) {
      ret.push(i);
      if (i>= r0 && i <= r1) {
        res.push(i);
      }

      if (i < len) {
        for (let j = i * 2; j <= max; j += i) {
          prime[j] = false;
        }
      }
    }
  }
  if (res.length) {
    print(res.join('\n'));
  }
  return ret;
}

function segmentedSieve(n, m, prime) {
  const mark = new Array((m-n)+1).fill(true);
  const res = [];

  // use the precomputed primes to find primes in current segment
  for (const p of prime) {
    // find the minimum number in [n...m] that is a multiple of prime[i] (divisible by p)
    // for example, if low is 31 and p is 3, we start with 33.
    let j = Math.ceil(n/p) * p;
    // mark all multiples of p
    while (j <= m) {
      mark[j - n] = false;
      j += p;
    }
  }

  for (let i = n; i <= m; i++){
    if (mark[i - n] === true) {
      res.push(i);
    }
  }
  if (res.length) {
    print(res.join('\n'));
  }
}

let num = parseInt(readline(), 10);
while (num--) {
  const [min, max] = readline().trim()
    .split(/\s+/)
    .map((d) => parseInt(d, 10));

  // compute all primes from [0...sqrt(10^9)] with a simple sieve
  // (10^9 is the maximum prime we need to find, based on the puzzle parameters)
  const ps = primes(Math.floor(Math.sqrt(2147483647)) + 1, min, max);
  const limit = ps[ps.length - 1];
  if (max > limit) {
    segmentedSieve(Math.max(min, limit), max, ps);
  }
}
