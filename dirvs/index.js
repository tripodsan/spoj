/* global readline, print */

/*
  algorithm: do a shortest path finding while checking the terrain and visibility constraints.
  the lofs was tricky. the idea is to use a modified bresenham that also checks the off pixels,
  and then intersect the line-of-sight line with the face at this terrain. when the target is
  lower than the start, we only need to consider the far edges of the columns, otherwise the
  closer edges.

       ╱      ╲
     ┌╱┐      ┌╲┐
     * │      │ *
   ┌╱┤ │    ┌─┤ │╲
   * │ │    │ │ │ ╲
  ╱└─┴─┘    └─┴─┘

  but it never worked, probably due to some edge cases....

  then I implemented the same algo as https://github.com/Codes-iiita/SPOJ/blob/master/dirvs.cpp,
  which just scans first in X and then in Y direction, and calculates the intersection of the
  faces....this worked.

 */

const DIRS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

function lofs_x(grid, x0, y0, x1, y1, draw, inter) {
  if (x0 > x1) {
    let t = x0; x0 = x1; x1 = t;
    t = y0; y0 = y1; y1 = t;
  }
  // traverse from x0 to x1 and test both faces of the columns at that position
  const z0 = grid[y0][x0] + 0.5;
  const z1 = grid[y1][x1] + 0.5;
  const dz = z1 - z0;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const l = Math.sqrt(dx*dx + dy*dy);

  for (let x = x0; x < x1; x++) {
    // consider the face at the back of a field (in direction of travel)
    const xx = x + 1;
    const yy = y0 + 0.5 + (xx - x0 - 0.5) * dy / dx;
    const dxx = xx - x0 - 0.5;
    const dyy = yy - y0 - 0.5;
    const lp = Math.sqrt(dxx*dxx + dyy*dyy);
    const y = Math.floor(yy);
    const ir = y - yy;
    let e;
    if (ir === 0) {
      // if we hit a corner we check the 2 diagonal fields
      if (dy > 0) {
        // ┌─┐
        // └─*─┐
        //   └─┘
        e = Math.max(grid[y -1][x], grid[y][x + 1]);
      } else {
        //   ┌─┐
        // ┌─*─┘
        // └─┘
        e = Math.max(grid[y][x], grid[y - 1][x + 1]);
      }
    } else {
      // we check the 2 fields left and right
      // ┌─┬─┐
      // └─┴─┘
      e = Math.max(grid[y][x], grid[y][x + 1]);
    }
    // compute the z:
    const z = lp/l * dz + z0;
    if (inter) {
      inter.push({ x, y, ix: xx, iy: yy, lp, z, e });
    }
    if (z < e) {
      return [xx, yy, z];
    }
  }
  return null;
}

function lofs_y(grid, x0, y0, x1, y1, draw, inter) {
  if (y0 > y1) {
    let t = x0; x0 = x1; x1 = t;
    t = y0; y0 = y1; y1 = t;
  }
  // traverse from y0 to y1 and test both faces of the columns at that position
  const z0 = grid[y0][x0] + 0.5;
  const z1 = grid[y1][x1] + 0.5;
  const dz = z1 - z0;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const sx = dx > 0 ? 1 : -1;
  const l = Math.sqrt(dx*dx + dy*dy);

  for (let y = y0; y < y1; y++) {
    // consider the face at the back of a field (in direction of travel)
    const yy = y + 1;
    const xx = x0 + 0.5 + (yy - y0 - 0.5) * dx / dy;
    const dxx = xx - x0 - 0.5;
    const dyy = yy - y0 - 0.5;
    const lp = Math.sqrt(dxx*dxx + dyy*dyy);
    const x = Math.floor(xx);
    const ir = x - xx;
    let e;
    if (ir === 0) {
      // if we hit a corner we check the 2 diagonal fields
      if (sx > 0) {
        // ┌─┐
        // └─*─┐
        //   └─┘
        e = Math.max(grid[y][x - 1], grid[y + 1][x]);
      } else {
        //   ┌─┐
        // ┌─*─┘
        // └─┘
        e = Math.max(grid[y][x], grid[y + 1][x - 1]);
      }
    } else {
      // we check the 2 fields above and below
      // ┌─┐
      // ├*┤
      // └─┘
      e = Math.max(grid[y][x], grid[y + 1][x]);
    }
    // compute the z:
    const z = lp/l * dz + z0;
    if (inter) {
      inter.push({ x, y, ix: xx, iy: yy, lp, z, e });
    }
    if (z < e) {
      return [xx, yy, z];
    }
  }
  return null;
}

function lofs(grid, x0, y0, x1, y1, draw, inter) {
  const blocked = lofs_x(grid, x0, y0, x1, y1, draw, inter);
  if (blocked) {
    return blocked;
  }
  return lofs_y(grid, x0, y0, x1, y1, draw, inter);
}


function lofs_xy(grid, x0, y0, x1, y1, draw, inter) {
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

  if (sx === 1) {
    // iterate over x
    sy = sy > 0 ? 1 : -1;
    let yp = y0;
    let y = y0;
    let ye = (dx + dy) / 2; // start at middle of the right edge
    for (let x = x0 + 1; x <= x1; x++) {
      const ir = sy > 0 ? ye / dx : (dx - ye) / dx;
      const yy = y + ir;
      if (y !== yp && ir > 0) {
        const ix = sy > 0
          ? x - (ir) / sy
          : x + (1 - ir) / sy;
        const iy = sy > 0 ? y : yp;
        plot(x - 1, y, ix, iy, 3);
      }
      plot(x, y, x, yy);
      if (blocked && !draw) {
        break;
      }
      yp = y;
      ye += dy;
      if (ye >= dx) {
        y += sy;
        ye -= dx;
      }
    }
  } else {
    // iterate over y
    sx = sx > 0 ? 1 : -1;
    let xp = x0;
    let x = x0;
    let xe = (dx + dy) / 2; // start at middle of the bottom edge
    for (let y = y0 + 1; y <= y1; y++) {
      const ir = sx > 0 ? xe / dy : (dy - xe) / dy;
      const xx = x + ir;
      if (x !== xp && ir > 0) {
        const iy = sx > 0
          ? y - (ir) / sx
          : y + (1 - ir) / sx;
        const ix = sx > 0 ? x : xp;
        plot(x, y - 1, ix, iy, 3);
      }
      plot(x, y, xx, y);
      if (blocked && !draw) {
        break;
      }
      xp = x;
      xe += dx;
      if (xe >= dy) {
        x += sx;
        xe -= dy;
      }
    }
  }

  return blocked;
}

function solve_astar(grid, x0, y0, x1, y1) {
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

function solve(grid, x0, y0, x1, y1) {
  const W = grid[0].length;
  const H = grid.length;

  // init distance grid
  const dist = new Array(H);
  for (let y = 0; y < H; y++) {
    dist[y] = new Array(W).fill(Number.MAX_SAFE_INTEGER);
  }

  // remember path for drawing solution;
  const cameFrom = new Map();

  // mark start
  dist[y0][x0] = 0;

  const q = []; // todo, use heap
  q.push({
    d: 0,
    v: [x0, y0],
  });
  while (q.length) {
    let { v, d } = q.shift();
    if (v[0] === x1 && v[1] === y1) {
      const path = [];
      do {
        path.unshift(v);
        v = cameFrom.get(v);
      } while (v);
      return path
    }
    const e = grid[v[1]][v[0]];
    for (const dir of DIRS) {
      const x = v[0] + dir[0];
      const y = v[1] + dir[1];
      if (x < 0 || x >= W || y < 0 || y >= H) {
        continue;
      }
      if (dist[y][x] < Number.MAX_SAFE_INTEGER) {
        // already visited
        continue;
      }
      // The technician can climb at most 1 metre up or descend at most 3 metres down in a single step.
      const delta = grid[y][x] - e;
      if (delta > 1 || delta < -3) {
        continue;
      }
      if (!lofs(grid, x,y, x0, y0) || !lofs(grid, x, y, x1, y1)) {
        dist[y][x] = d + 1;
        const n = [x, y];
        cameFrom.set(n, v);
        q.push({
          v: n,
          d: d + 1,
        });
      } else {
        // not visible
        dist[y][x] = -1;
      }
    }
    q.sort((e0, e1) => e0.d - e1.d);
  }
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
