/* global readline, print */

function solve(colors, p, l, cache = new Map(), d = 0) {
  // console.log(' '.repeat(d), p, p + l)
  if (l === 1) {
    return [colors[p], 0];
  }
  if (l === 2) {
    return [(colors[p] + colors[p + 1]) % 100, colors[p] * colors[p + 1]];
  }
  const key = `${p},${l}`;
  let best = cache.get(key);
  if (!best) {
    best = [0, Number.MAX_SAFE_INTEGER];
    // generate all possible segmentations
    for (let i = 1; i < l; i++) {
      const [c0, s0] = solve(colors, p, i, cache, d + 1);
      const [c1, s1] = solve(colors, p + i, l - i, cache, d + 1);
      const c = (c0 + c1) % 100;
      const s = (c0 * c1) + s0 + s1;
      if (s < best[1]) {
        best = [c, s];
      }
    }
    cache.set(key, best);
  }
  return best;
}


const results = []
let line;
while (line = readline()) {
  const N = parseInt(line, 10);
  const colors = readline().split(/\s+/).map((d) => parseInt(d, 10));
  results.push(solve(colors, 0, N)[1]);
}
print(results.join('\n'));
