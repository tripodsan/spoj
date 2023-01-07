/* global readline, print */

function primes(max) {
  const len = Math.sqrt(max);
  const ret = [];
  const prime = new Array(max + 1).fill(true);
  for (let i = 2; i <= max; i++) {
    if (prime[i] === true) {
      ret.push(i);
      if (i < len) {
        for (let j = i * 2; j <= max; j += i) {
          prime[j] = false;
        }
      }
    }
  }
  return ret;
}

function *segmentedSieve(n, m, prime) {
  // highest prime in pre-computed sieve
  const limit = prime[prime.length - 1];
  const mark = new Array(limit+1);

  // Divide the range [n...m] in different segments with size sqrt(n)
  let low = n;
  let high = n + limit - 1;

  while (low <= m) {
    high = Math.min(high, m);

    // a value in mark[i] will finally be false if 'i-low' is not a prime, else true.
    mark.fill(true);

    // use the precomputed primes to find primes in current segment
    for (const p of prime) {
      // find the minimum number in [low...high] that is a multiple of prime[i] (divisible by p)
      // for example, if low is 31 and p is 3, we start with 33.
      let loLim = Math.floor(low/p) * p;
      if (loLim < low){
        loLim += p;
      }
      // mark all multiples of p
      for (let j = loLim; j <= high; j += p){
        mark[j - low] = false;
      }
    }

    for (let i = low; i <= high; i++){
      if (mark[i - low] === true) {
        yield i;
      }
    }
    low = low + limit;
    high = high + limit;
  }
}

let num = parseInt(readline(), 10);
while (num--) {
  const [min, max] = readline().trim()
    .split(/\s+/)
    .map((d) => parseInt(d, 10));

  // compute all primes from [0...sqrt(10^9)] with a simple sieve
  // (10^9 is the maximum prime we need to find, based on the puzzle parameters)
  const ps = primes(Math.floor(Math.sqrt(1000000000)) + 1);
  const limit = ps[ps.length - 1];
  if (min <= limit) {
    for (const p of ps) {
      if (p >= min && p <= max) {
        print(p);
      }
    }
  }
  if (max > limit) {
    for (const p of segmentedSieve(Math.max(min, limit), max, ps)) {
      if (p >= min && p <= max) {
        print(p);
      }
    }
  }
  print();
}
