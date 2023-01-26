/* global readline, print */

const [N, M] = readline().split(/\s+/).map((d) => parseInt(d, 10));
const trees = readline().split(/\s+/).map((d) => parseInt(d, 10));

// sort the trees by height, descending
trees.sort((t0, t1) => t1 - t0);

let s = 0;
let i = 0;
let t = trees[0];
let h = t;
while (s < M && i < trees.length) {
  // console.log(`s=${s} i=${i} h=${h} t=${t}`);
  // if the height is too big, lower it but sum up the wood that would have been cut at a lower height
  if (h > t) {
    s += i;
    h--;
  } else {
    // move to next tree
    t = trees[++i];
    // and add the amount cut from that one
    s += Math.max(t - h, 0);
  }
}

print(h);
