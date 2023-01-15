/* global readline, print */
const RE = /(\d+)([-+*])(\d+)/;

function add(a, b) {
  const max = Math.max(a.length, b.length);
  let ret = new Array(max);
  let i = 0;
  let c = 0;
  while (i < a.length || i < b.length) {
    const s = (a[i] || 0) + c + (b[i] || 0);
    ret[i] = s % 10;
    c = s >= 10 ? 1 : 0;
    i++;
  }
  if (c) {
    ret.push(c);
  }
  return ret;
}

function sub(a, b) {
  const max = Math.max(a.length, b.length);
  let ret = new Array(max);
  let i = 0;
  let c = 0;
  while (i < a.length || i < b.length) {
    const s = (a[i] || 0) + c - (b[i] || 0);
    ret[i] = (s + 10) % 10;
    c = s < 0 ? -1 : 0;
    i++;
  }
  while (ret[--i] === 0) {
    ret.pop();
  }
  return ret;
}

function mul(a, n) {
  if (n === 0) {
    return [0];
  }
  if (n === 1) {
    return [...a];
  }
  let ret = new Array(a.length);
  let i = 0;
  let c = 0;
  while (i < a.length) {
    const s = (a[i] || 0) * n + c;
    ret[i] = s % 10;
    c = Math.floor(s / 10);
    i++;
  }
  if (c) {
    ret.push(c);
  }
  return ret;
}

function addsub(a, b, r, op) {
  b = op + b;
  const max = Math.max(a.length, b.length, r.length);
  return [
    a.padStart(max),
    b.padStart(max),
    '-'.repeat(Math.max(b.length, r.length)).padStart(max),
    r.padStart(max),
    '',
  ].join('\n');
}

function longmul(sa, sb, a, b) {
  sb = '*' + sb;
  let max = Math.max(sa.length, sb.length);
  let ret = [
    [sa, sa.length],
    [sb, sb.length],
  ];
  let sum = [0];
  let mag = 0;
  while (b.length) {
    const n = b.shift();
    const p = mul(a, n);
    for (let i = 0; i < mag; i++) {
      p.unshift(0);
    }
    sum = add(sum, p);
    if (mag === 0) {
      const l = Math.max(sb.length, sum.length);
      ret.push(['-'.repeat(l), l]);
    }
    p.splice(0, mag);
    ret.push([p.reverse().join(''), p.length + mag]);
    max = Math.max(max, p.length + mag);
    mag++;
  }
  max = Math.max(max, sum.length);
  ret = ret.map(([s, l]) => ' '.repeat(max - l) + s);
  if (mag > 1) {
    ret.push('-'.repeat(sum.length).padStart(max));
    ret.push(sum.reverse().join('').padStart(max));
  }
  ret.push('');
  return ret.join('\n');
}

const num = parseInt(readline(), 10);
for (let i = 0; i < num; i++) {
  const [,a, op, b] = readline().match(RE);
  const n0 = a.split('').map((d) => parseInt(d, 10)).reverse();
  const n1 = b.split('').map((d) => parseInt(d, 10)).reverse();
  if (op === '*') {
    print(longmul(a, b, n0, n1));
  } else {
    const r = op === '+' ? add(n0, n1) : sub(n0, n1);
    print(addsub(a, b, r.reverse().join(''), op));
  }
}
