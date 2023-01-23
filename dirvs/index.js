/* global readline, print */

/*
  algorithm: do a shortest path finding while checking the terrain and visibility constraints.
  the lofs was tricky. the idea is to use a modified bresenham that also checks the off pixels.
  (the standard bresenham only draws the pixels 1,2,4,5 but the line effectively also goes through 5.)

  ┌───┬───┐
  x 1 │ 2 │
  └───┼───┼───┬───┐
      │ 3 │ 4 │ 5 x   (imagine line between the 2 x's)
      └───┴───┴───┘

  Then intersect the line-of-sight line with the face at this terrain. when the target is
  lower than the start, we only need to consider the far edges of the columns, otherwise the
  closer edges.

        ╱      ╲
      ┌╱┐      ┌╲┐
      * │      │ *
    ┌╱┤ │    ┌─┤ │╲
    * │ │    │ │ │ ╲
   ╱└─┴─┘    └─┴─┘

 */

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
      if (y !== yp && ye > 0) {
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
      if (x !== xp && xe > 0) {
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

const DIRS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

function solve(grid, x0, y0, x1, y1) {
  const W = grid[0].length;
  const H = grid.length;

  // init distance grid
  const dist = new Array(H);
  for (let y = 0; y < H; y++) {
    dist[y] = new Array(W).fill(Number.MAX_SAFE_INTEGER);
  }

  // remember path for drawing solution
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
