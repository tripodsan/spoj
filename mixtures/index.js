/* global readline, print */

function solve(colors, p, l, cache) {
  // console.log(' '.repeat(d), p, p + l)
  let best = cache[p][l];
  if (!best) {
    if (l === 1) {
      best = [colors[p], 0];
    } else if (l === 2) {
      best = [(colors[p] + colors[p + 1]) % 100, colors[p] * colors[p + 1]];
    } else {
      // generate all possible segmentations
      let bestColor = 0;
      let bestSmoke = Number.MAX_SAFE_INTEGER;
      for (let i = 1; i < l; i++) {
        const [c0, s0] = solve(colors, p, i, cache);
        const [c1, s1] = solve(colors, p + i, l - i, cache);
        const c = (c0 + c1) % 100;
        const s = (c0 * c1) + s0 + s1;
        if (s < bestSmoke) {
          bestSmoke = s;
          bestColor = c;
        }
      }
      best = [bestColor, bestSmoke];
    }
    cache[p][l] = best;
  }
  return best;
}


const results = []
let line;
while (line = readline()) {
  const N = parseInt(line, 10);
  const colors = readline().split(/\s+/).map((d) => parseInt(d, 10));
  const cache = new Array(N);
  for (let i = 0; i < N; i++) {
    cache[i] = new Array(N);
  }
  results.push(solve(colors, 0, N, cache)[1]);
}
print(results.join('\n'));
