function main() {
  const $canvas = document.getElementById('canvas');
  const $overlay = document.getElementById('overlay');
  const $solve = document.getElementById('solve');
  const $info = document.getElementById('info');
  const $elev = document.getElementById('elevation');
  const $mode = document.getElementById('mode');
  const $radius = document.getElementById('radius');
  const $load = document.getElementById('load');
  const $save = document.getElementById('save');
  const $code = document.getElementById('code');
  const $reset = document.getElementById('reset');
  const $dim_x = document.getElementById('dim_x');
  const $dim_y = document.getElementById('dim_y');
  const $b0_x = document.getElementById('b0_x');
  const $b0_y = document.getElementById('b0_y');
  const $b1_x = document.getElementById('b1_x');
  const $b1_y = document.getElementById('b1_y');
  const ctx = $canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const ctx2 = $overlay.getContext('2d');
  const CW = $canvas.width;
  const CH = $canvas.height;
  let W = 20;
  let H = 20;
  let Z = 800 / 20;
  let b0 = [];
  let b1 = [];
  let grid;
  onReset();

  function drawPixel(x, y) {
    const e = grid[y][x];
    ctx.fillStyle = e === 0 ? 'black' : `hsl(${e * 36},100%,50%)`;
    if (x === b0[0] && y === b0[1] || x === b1[0] && y === b1[1]) {
      ctx.fillStyle = 'white';
    }
    ctx.fillRect(x * Z, y * Z, Z - 1, Z - 1);
  }

  function update() {
    ctx.clearRect(0, 0, CW, CH);
    // ctx2.clearRect(0, 0, CW, CH);

    // draw pixels
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        drawPixel(x, y);
      }
    }
  }

  function paint(x, y, e) {
    const r = parseInt($radius.value, 10);
    if (Number.NaN === r) {
      return;
    }
    for (let yy = -r; yy <= r; yy++) {
      const sy = yy + y;
      if (sy < 0 || sy >= H) {
        continue;
      }
      for (let xx = -r; xx <= r; xx++) {
        const sx = xx + x;
        const sr = Math.sqrt(xx*xx + yy*yy);
        if (sr < r && sx >= 0 && sx < W) {
          grid[sy][sx] = e;
          drawPixel(sx, sy);
        }
      }
    }
  }

  function draw(x, y) {
    const mode = $mode.value;
    if (mode === 'draw') {
      paint(x, y, parseInt($elev.value, 10));
    }

  }

  function calcLofs(x0, y0, x1, y1, draw, inter) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let z0 = (grid[y0][x0] + 0.5) * 8;
    let z1 = (grid[y1][x1] + 0.5) * 8;
    if (dx > dy) {
      if (x0 > x1) {
        let t = z0; z0 = z1; z1 = t;
      }
    } else {
      if (y0 > y1) {
        let t = z0; z0 = z1; z1 = t;
      }
    }
    const dz = z1 - z0;
    const v = lofs(grid, x0, y0, x1, y1, draw, inter);
    x0 += 0.5;
    y0 += 0.5;
    x1 += 0.5;
    y1 += 0.5;
    if (v) {
      ctx2.strokeStyle = '#00FF00'
      ctx2.beginPath();
      ctx2.moveTo(x0 * Z, y0 * Z);
      ctx2.lineTo(v[0] * Z, v[1] * Z);
      ctx2.closePath();
      ctx2.stroke();
      ctx2.strokeStyle = '#002000'
      ctx2.beginPath();
      ctx2.moveTo(x1 * Z, y1 * Z);
      ctx2.lineTo(v[0] * Z, v[1] * Z);
      ctx2.closePath();
      ctx2.stroke();
      ctx2.fillStyle = '#eeeeee';
      ctx2.fillText(`z=${v[2]}`, v[0] * Z + 20, v[1] * Z + 20);
    } else {
      ctx2.strokeStyle = '#00FF00'
      ctx2.beginPath();
      ctx2.moveTo(x0 * Z, y0 * Z);
      ctx2.lineTo(x1 * Z, y1 * Z);
      ctx2.closePath();
      ctx2.stroke();
    }
    if (inter?.length) {
      for (let i = 0; i < inter.length; i++) {
        const { x, y, ix, iy } = inter[i];
        ctx2.beginPath();
        ctx2.ellipse(ix * Z, iy * Z, 3, 3, 0, 0, Math.PI*2);
        ctx2.closePath();
        ctx2.strokeStyle = '#ff2222';
        ctx2.stroke();
        ctx2.fillStyle = '#111111';
        ctx2.fillText(`${i}`, x * Z + Z / 2, y * Z + Z / 2);
      }

      const dx = x1 - x0;
      const dy = y1 - y0;
      const l = Math.sqrt(dx*dx + dy*dy);
      const max = 800; //Math.min(800, l * Z);
      inter.unshift({lp: 0, e: z0 / 8 - 0.5});
      inter.push({ lp: l, e: z1 / 8 - 0.5});
      const from = dz >= 0 ? 0 : 1;
      const to = dz >= 0 ? inter.length - 1 : inter.length;
      for (let i = from; i < to; i++) {
        let i0 = dz >= 0 ? inter[i] : inter[i - 1];
        let i1 = dz >= 0 ? inter[i + 1] : inter[i];
        let { lp: lp0, e: e0 } = i0;
        let { lp: lp1, e: e1 } = i1;
        let e = dz >= 0 ? e0 : e1;
        const xx0 = max/l * lp0;
        const xx1 = max/l * lp1;
        e *= 8;
        ctx2.beginPath();
        ctx2.moveTo(xx0, 900 - e)
        ctx2.lineTo(xx0, 900);
        ctx2.moveTo(xx1, 900 - e)
        ctx2.lineTo(xx1, 900);
        ctx2.moveTo(xx0, 900 - e)
        ctx2.lineTo(xx1, 900 - e);
        ctx2.closePath();
        ctx2.strokeStyle = '#333333';
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.ellipse(inter[i].lp * max/l, 900 - inter[i].e * 8, 5, 5, 0, 0, Math.PI*2);
        ctx2.closePath();
        ctx2.strokeStyle = '#ff2222';
        ctx2.stroke();
        ctx2.stroke();
        ctx2.fillStyle = '#eeeeee';
        ctx2.fillText(`${i - 1}`, xx0 + (xx1 - xx0) / 2, 895);
      }
      ctx2.beginPath();
      ctx2.moveTo(0, 900 - z0)
      ctx2.lineTo(max, 900 - z1);
      ctx2.closePath();
      ctx2.strokeStyle = '#33ff33';
      ctx2.stroke();
    }
  }

  let wasMeta;

  function onMouseMove(evt) {
    if (solving) {
      return;
    }
    const x = Math.floor(evt.offsetX / Z);
    const y = Math.floor(evt.offsetY / Z);
    if (x >= 0 && x < W && y >= 0 && y < H) {
      // onReset();
      // grid[15][15]=8;
      // grid[14][16]=6;
      // grid[13][17]=4;
      // grid[12][18]=2;
      // grid[11][19]=0;
      //
      // grid[14][14]=6;
      // grid[13][13]=4;
      // grid[12][12]=2;
      // grid[11][11]=0;
      //
      // grid[16][14]=6;
      // grid[17][13]=4;
      // grid[18][12]=2;
      // grid[19][11]=0;
      // for (let yy  = 5; yy < 25; yy++) {
      //   grid[yy][25] = 9;
      // }
      // for (let x = 0; x < 10; x++) {
      //   grid[1][x + 10] = x;
      //   grid[4][x + 10] = 4;
      //   grid[11][x + 17] = x;
      //   grid[12][x + 17] = x;
      //   grid[13][x + 17] = x;
      //   grid[14][x + 17] = x;
      //   grid[15][x + 17] = x;
      //   grid[16][x + 17] = x;
      //   grid[17][x + 17] = x;
      //   grid[18][x + 17] = x;
      //   grid[19][x + 17] = x;
      // }
      // for (let i = 0; i < 10; i++) {
      //   grid[i + 15][i + 2] = 9;
      // }
      // ctx2.clearRect(0, 0, CW, CH);
      // calcLofs(b0[0], b0[1], x, y, true, []);
      // update();
      const e = grid[y][x];
      $info.value = `${x}x${y}: ${e}`;
    }
    if (evt.buttons === 1) {
      draw(x,y);
    }
    if (evt.metaKey) {
      wasMeta = true;
      ctx2.clearRect(0, 0, CW, CH);
      calcLofs(x, y, b0[0], b0[1], false, []);
      calcLofs(x, y, b1[0], b1[1]);
    } else if (wasMeta) {
      wasMeta = false;
      update();
    }
  }

  let solving = false;
  function onSolve() {
    if (solving) {
      return;
    }
    solving = true;
    $info.value = 'solving...';
    setTimeout(() => {
      const t0 = Date.now();
      const path = solve(grid, b0[0], b0[1], b1[0], b1[1]);
      const t1 = Date.now();
      solving = false;
      if (!path.length) {
        $info.value = 'Mission impossible!';
      } else {
        $info.value = `${path.length - 1} steps in (${t1-t0}ms)`;
        ctx.fillStyle = 'white';
        for (const [x, y] of path) {
          ctx.fillRect(x * Z, y * Z, Z - 1, Z - 1);
        }
      }
    }, 0);
  }

  function onReset() {
    W = parseInt($dim_x.value);
    H = parseInt($dim_y.value);
    Z = Math.floor(800 / Math.max(W, H));
    grid = new Array(H);
    for (let i = 0; i < H; i++) {
      grid[i] = new Array(W).fill(1);
    }
    b0[0] = parseInt($b0_x.value);
    b0[1] = parseInt($b0_y.value);
    b1[0] = parseInt($b1_x.value);
    b1[1] = parseInt($b1_y.value);
    update();
  }

  function onSave() {
    const res = [`${H} ${W}`];
    for (let y = 0; y < H; y++) {
      res.push(grid[y].join(' '));
    }
    res.push(`${b0[1]+1} ${b0[0]+1} ${b1[1]+1} ${b1[0]+1}`);
    $code.value = res.join('\n');
  }

  function onLoad() {
    const rows = $code.value.split('\n');
    [H, W] = rows.shift().split(/\s+/).map((d) => parseInt(d, 10));
    $dim_x.value = W;
    $dim_y.value = H;
    onReset();
    grid = new Array(H);
    for (let y = 0; y < H; y++) {
      grid[y] = rows.shift().split(/\s+/).map((d) => parseInt(d, 10));
    }
    let [y0, x0, y1, x1] = rows.shift().split(/\s+/).map((d) => parseInt(d, 10));
    $b0_x.value = b0[0] = x0 - 1;
    $b0_y.value = b0[1] = y0 - 1;
    $b1_x.value = b1[0] = x1 - 1;
    $b1_y.value = b1[1] = y1 - 1;
    update();
  }

  $overlay.addEventListener('mousemove', onMouseMove);
  $solve.addEventListener('click', onSolve);
  $load.addEventListener('click', onLoad);
  $save.addEventListener('click', onSave);
  $reset.addEventListener('click', onReset);
  update();
}


window.requestAnimationFrame(main);


