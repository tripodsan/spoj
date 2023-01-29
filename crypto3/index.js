import { readFile } from 'fs/promises';
import { Brainfuck } from '../utils/Brainfuck.js';

const input = '7123\n'

const bf = Brainfuck.parse(await readFile('index.bf', 'utf-8'))
  .withQuiet(false);

console.log(bf.run(input));

