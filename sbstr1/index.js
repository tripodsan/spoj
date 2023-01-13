import { readFile } from 'fs/promises';
import { Brainfuck } from '../utils/Brainfuck.js';

// console.log(BF.parse(await readFile('hello.bf', 'utf-8')).run());
// console.log(BF.parse(await readFile('inout.bf', 'utf-8')).run('Hello, world!'));

// const input = [];
// const expected = [];
// for (let i = 0; i < 1024; i++) {
//   for (let j = 0; j < 32; j++) {
//     const s0 = i.toString(2).padStart(10, '0');
//     const s1 = j.toString(2).padStart(5, '0');
//     input.push(`${s0} ${s1}`);
//     expected.push(s0.indexOf(s1) >= 0 ? 1 : 0);
//   }
// }
// console.log(input);

const input = [
  '1010110010 10110',
  '0000000000 00000',
  '1110111011 10011',
];

const bf = Brainfuck.parse(await readFile('index.bf', 'utf-8'))
  .withQuiet(false);

// while (input.length) {
//   console.log(input.length);
//   const tests = input.splice(0, 24);
//   const output = bf.run(tests.join('\n'));
//   const exp = expected.splice(0, 24).join('\n');
//   if (output.trim() !== exp.trim()) {
//     throw Error();
//   }
// }
console.log(bf.run(input.join('\n')));

// for (let i = 0; i < 6; i++) {
//   console.log(parseInt('1010110010'.substring(i, i + 5), 2));
// }
