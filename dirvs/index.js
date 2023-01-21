/* global readline, print */

const DIRS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

function dump(grid, x0, y0, x1, y1) {
  for (let y = 0; y < grid.length; y++) {
    const row = [...grid[y]];
    if (y === y0) {
      row[x0] = `\u001B[31m${row[x0]}\u001B[0m`;
    }
    if (y === y1) {
      row[x1] = `\u001B[31m${row[x1]}\u001B[0m`;
    }
    console.log(row.join(' '));
  }
}

function lofs(grid, x0, y0, x1, y1, draw, inter) {
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  const l = Math.sqrt(dx*dx + dy*dy);

  // consider visible when p0 === p1
  if (l === 0) {
    return null;
  }

  let sx;
  let sy;
  let t;

  if (dx > dy) {
    if (x0 > x1) {
      t = x0; x0 = x1; x1 = t;
      t = y0; y0 = y1; y1 = t;
    }
    sx = 1;
    sy = y1 > y0 ? dy / dx : -dy / dx;
  } else {
    if (y0 > y1) {
      t = x0; x0 = x1; x1 = t;
      t = y0; y0 = y1; y1 = t;
    }
    sx = x1 > x0 ? dx / dy : -dx / dy;
    sy = 1;
  }
  const z0 = grid[y0][x0] + 0.5;
  const z1 = grid[y1][x1] + 0.5;
  const dz = z1 - z0;

  let blocked = null;

  // remember previous sample
  let px = x0;
  let py = y0;
  function plot(x, y, ix, iy, c = 2) {
    const dxx = ix - x0 - 0.5;
    const dyy = iy - y0 - 0.5;
    const lp = Math.sqrt(dxx*dxx + dyy*dyy);
    const z = dz * lp / l + z0;

    // if going upwards, check the front edge, otherwise the back
    const tx = dz >= 0 ? x : px;
    const ty = dz >= 0 ? y : py;
    const e = grid[ty][tx];
    if (inter) {
      inter.push({ x: tx, y: ty, ix, iy, lp, z, e });
    }
    if (z < e && !blocked) {
      blocked = [ix, iy, z];
    }
    if (draw) {
      grid[ty][tx] = c;
    }
    px = x;
    py = y;
  }
  // plot first one
  // plot(x0, y0, x0 + 0.5, y0 + 0.5);

  // optimize for 90° cases
  if (dx === 0 || dy === 0) {
    let x = x0;
    let y = y0;
    do {
      x += sx;
      y += sy;
      plot(x, y, x + sy/2, y + sx/2, 4);
    } while (x !== x1 || y !== y1);
    return blocked;
  }

  // optimize for 45° cases
  if (dx === dy) {
    let x = x0;
    let y = y0;
    const ix = sx > 0 ? 0 : 1;
    do {
      x += sx;
      y += sy;
      plot(x, y, x + ix, y, 4);
    } while (x !== x1 || y !== y1);
    return blocked;
  }

  // the line of sight connects the 2 center points of the voxels.
  let xx = x0 + 0.5;
  let yy = y0 + 0.5;

  // first step to the edge of the pixel
  xx += sx / 2;
  yy += sy / 2;

  let xp = x0;
  let yp = y0;
  while (true) {
    const x = Math.floor(xx);
    const y = Math.floor(yy);
    if (sx === 1) {
      const ir = yy - y;
      if (y !== yp && ir > 0) {
        const ix = sy > 0
          ? x - (ir) / sy
          : x + (1 - ir) / sy;
        const iy = sy > 0 ? y : yp;
        plot(x - 1, y, ix, iy, 3);
      }
      plot(x, y, x, yy);
    } else {
      const ir = xx - x;
      if (x !== xp && ir > 0) {
        const iy = sx > 0
          ? y - (ir) / sx
          : y + (1 - ir) / sx;
        const ix = sx > 0 ? x : xp;
        plot(x, y - 1, ix, iy, 3);
      }
      plot(x, y, xx, y);
    }
    if (x === x1 && y === y1 || blocked && !draw) {
      break;
    }
    xp = x;
    yp = y;
    xx += sx;
    yy += sy;
  }
  return blocked;
}

function solve(grid, x0, y0, x1, y1) {
  const W = grid[0].length;
  const H = grid.length;
  const key = (v) => v[0] + v[1]*W;
  const begK = y0 * W  + x0;
  const endK = y1 * W  + x1;

  const visible = new Map();

  const isVisible = (grid, k, x, y) => {
    let vis = visible.get(k);
    if (vis === undefined) {
      vis = !lofs(grid, x,y, x0, y0) || !lofs(grid, x, y, x1, y1);
      visible.set(k, vis);
    }
    return vis;
  }

  function *neighbours(v) {
    const e0 = grid[v[1]][v[0]]; // elevation of v
    for (const d of DIRS) {
      const x = v[0] + d[0];
      const y = v[1] + d[1];
      if (x >= 0 && x < W && y >= 0 && y < H) {
        const e1 = grid[y][x]; // elevation of n
        // The technician can climb at most 1 metre up or descend at most 3 metres down in a single step.
        const d = e1 - e0;
        if (d <= 1 && d >= -3) {
          const k = x + y*W;
          if (isVisible(grid, k, x, y)) {
            yield [x, y];
          }
        }
      }
    }
  }

  // use manhattan distance as heuristic
  const h = (v) => Math.abs(v[0] - x1) + Math.abs(v[1] - y1);

  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  const openSet = new Map();
  openSet.set(begK, [x0, y0]);

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
  const cameFrom = new Map();

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore = new Map();
  gScore.set(begK, 0);

  // For node n, fScore[n] := gScore[n] + h(n).
  const fScore = new Map();
  fScore.set(begK, h([x0, y0]));

  while (openSet.size) { // openSet is not empty
    // current := the node in openSet having the lowest fScore[] value
    let currentK = null;
    let current = null;
    let low = Number.MAX_SAFE_INTEGER;
    for (const [vk, v] of openSet.entries()) {
      let f = fScore.get(vk);
      if (f === undefined) {
        f = Number.MAX_SAFE_INTEGER;
      }
      if (f < low) {
        low = f;
        currentK = vk;
        current = v;
      }
    }
    if (!current) {
      return [];
    }

    if (currentK === endK) {
      const total_path = [];
      do {
        total_path.unshift(current);
        [currentK, current] = cameFrom.get(currentK) || [];
      } while (current);
      return total_path
    }

    openSet.delete(currentK);

    /// for each neighbor of current
    for (const neighbor of neighbours(current)) {
      const nk = key(neighbor);
      // tentative_gScore is the distance from start to the neighbor through current
      let tentative_gScore = Number.MAX_SAFE_INTEGER;
      if (gScore.has(currentK)) {
        tentative_gScore = gScore.get(currentK) + 1; // distance is always 1
      }
      let scoreNeighbor = gScore.get(nk);
      if (scoreNeighbor === undefined) {
        scoreNeighbor = Number.MAX_SAFE_INTEGER;
      }

      // This path to neighbor is better than any previous one. Record it!
      if (tentative_gScore < scoreNeighbor) {
        cameFrom.set(nk, [currentK, current]);
        gScore.set(nk, tentative_gScore);
        fScore.set(nk, tentative_gScore + h(neighbor));
        openSet.set(nk, neighbor);
      }
    }
  }
  // Open set is empty but goal was never reached
  return [];
}

function run() {
  const results = [];
  const numTests = parseInt(readline(), 10);
  for (let i = 0; i < numTests; i++) {
    const [H, W] = readline().split(/\s+/).map((d) => parseInt(d, 10));
    const grid = new Array(H);
    for (let y = 0; y < H; y++) {
      grid[y] = readline().split(/\s+/).map((d) => parseInt(d, 10));
    }
    let [y0, x0, y1, x1] = readline().split(/\s+/).map((d) => parseInt(d, 10));
    if (i  > -1) {
      const path = solve(grid, x0 - 1, y0 - 1, x1 - 1, y1 - 1);
      // for (const [x,y] of path) {
      //   grid[y][x] = `\u001B[1m${grid[y][x]}\u001B[0m`;
      // }
      // x1 = 8;
      // y1 = 4;
      // console.log(lofs(grid, x0 - 1, y0 - 1, x1 - 1, y1 - 1, true));
      // dump(grid, x0 - 1, y0 - 1, x1 -1, y1 - 1);
      results.push(path.length
        ? `The shortest path is ${path.length - 1} steps long.`
        : 'Mission impossible!');
    }
  }
  print(results.join('\n'));
}

try {
  console.log(window);
} catch (e) {
  run();
}
