import assert from 'assert';
import {  dirname, resolve } from 'path'
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { Brainfuck } from './Brainfuck.js';

const __testdir = dirname(fileURLToPath(import.meta.url));
describe('Brainfuck Tests', () => {
  it('Runs the hello world', async () => {
    const out = Brainfuck.parse(await readFile(resolve(__testdir, 'fixtures', 'hello.bf'), 'utf-8')).run();
    assert.strictEqual(out, 'Hello World!\n');
  });

  it('echos the input', async () => {
    const out = Brainfuck.parse(await readFile(resolve(__testdir, 'fixtures', 'echo.bf'), 'utf-8')).run('foobar');
    assert.strictEqual(out, 'foobar');
  });

  it('subtracts a from b', async () => {
    const out = Brainfuck.parse(await readFile(resolve(__testdir, 'fixtures', 'ab.bf'), 'utf-8')).run('');
    assert.strictEqual(out, '\x07');
  });
});

