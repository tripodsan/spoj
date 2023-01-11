/* global readline, print */
function rev(n) {
  return parseInt(n.split('').reverse().join(''), 10);
}


const num = parseInt(readline(), 10);
const results = new Array(num);
for (let i = 0; i < num; i++) {
  const [a, b] = readline().trim()
    .split(/\s+/);

  results[i] = String(rev(String(rev(a) + rev(b))));
}

print(results.join('\n'));
