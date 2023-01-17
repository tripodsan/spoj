/* global readline, print */

/*
  apply https://brilliant.org/wiki/method-of-differences/
 */

function dump(cols) {
  console.log('-------------------------------------')
  for (let i = 0; i < cols[1].length; i++) {
    const row = new Array(cols.length);
    for (let j = 0; j < cols.length; j++) {
      row[j] = String(cols[j][i]);
    }
    console.log(row.join(' '));
  }
}

function solve(seq, S, C) {
  // special case
  if (S === 1) {
    return new Array(C).fill(seq[0]).join(' ');
  }
  // create a S+C * S matrix, but allocate by cols, as it is easier to calculate the differences
  const cols = [seq];
  // compute the differences
  let prev = seq;
  let lastD;
  for (let i = 1; i < S; i++) {
    const col = new Array(S + C).fill('.');
    cols.push(col);
    let constant = true;
    lastD = undefined;
    for (let j = 0; j < S - i; j++) {
      const d = prev[j + 1] - prev[j];
      col[j] = d;
      if (lastD !== undefined && d !== lastD) {
        constant = false;
      }
      lastD = d;
    }
    if (constant) {
      break;
    }
    prev = col;
  }
  // now fill up from the back
  const ret = [];
  for (let i = 0; i < C; i++) {
    let p = S - cols.length + i + 1;
    // console.log('p=', p);
    cols[cols.length - 1][p] = lastD;
    for (let k = cols.length - 2; k >= 0; k--) {
      p++;
      cols[k][p] = cols[k][p - 1] + cols[k + 1][p - 1];
    }
    ret.push(cols[0][p]);
  }
  // dump(cols);
  return ret.join(' ');
}

const numTests = parseInt(readline(), 10);
for (let i = 0; i < numTests; i++) {
  const [S, C] = readline().split(/\s+/).map((d) => parseInt(d, 10));
  const seq = readline().split(/\s+/).map((d) => parseInt(d, 10));
  print(solve(seq, S, C));
}
