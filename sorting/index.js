import { readFile } from 'fs/promises';
import { Brainfuck } from '../utils/Brainfuck.js';

const bf = Brainfuck.parse(await readFile('index.bf', 'utf-8'))
  .withQuiet(false);

// console.log(bf.run('FAABBBCDE\n'));
console.log(bf.run('AABZRRRFGYHJKLAFGSWRGRBDVAG\n'));

console.log(bf.minify());
