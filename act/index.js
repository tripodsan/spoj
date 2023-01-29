/* global readline, print */

const numTests = parseInt(readline(), 10);
for (let i = 0; i < numTests; i++) {
  const [N, C] = readline().split(/\s+/);
  print(C.slice(-1));
}
