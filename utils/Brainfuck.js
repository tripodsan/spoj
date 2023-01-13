const OPS = {
  '[': (ctx, ins) => {
    if (ctx.get() === 0) {
      ctx.pc = ins.adr;
    }
  },
  ']': (ctx, ins) => {
    if (ctx.get() !== 0) {
      ctx.pc = ins.adr;
    }
  },
  '>': (ctx, ins) => ctx.move(1),
  '<': (ctx, ins) => ctx.move(-1),
  '+': (ctx, ins) => ctx.add(1),
  '-': (ctx, ins) => ctx.add(-1),
  '.': (ctx, ins) => ctx.write(),
  ',': (ctx, ins) => ctx.read(),
  '?': (ctx, ins) => ctx.dump(ins),
  '!': (ctx, ins) => { debugger },
}

export class Brainfuck {
  static parse(bf) {
    const code = [];
    const stack = [];
    let line = 1;
    let col = 1;
    for (let i = 0; i < bf.length; i++) {
      const c = bf[i];
      const op = OPS[c];
      if (op) {
        const ins = {
          op,
          line,
          col,
        }
        code.push(ins);
        if (c === '[') {
          stack.push(code.length - 1);
        } else if (c === ']') {
          if (!stack.length) {
            throw Error(`unbalanced ]: line ${line}, col ${col}`);
          }
          const idx = stack.pop();
          const match = code[idx];
          match.adr = code.length - 1;
          ins.adr = idx;
        }
      } else if (c === '\n') {
        line++;
        col = 0;
      }
      col++;
    }
    if (stack.length) {
      throw Error('unmatched []');
    }
    return new Brainfuck(code);
  }

  constructor(code) {
    this.code = code;
  }

  withQuiet(v) {
    this.quiet = v;
    return this;
  }

  get() {
    return this.cells[this.ptr] || 0;
  }

  move(d) {
    this.ptr += d;
    if (this.ptr < 0) {
      throw Error('outofbounds');
    }
  }

  add(d) {
    this.cells[this.ptr] = (this.get() + d + 256) % 256;
  }

  read() {
    if (!this.input.length) {
      this.cells[this.ptr] = 0;
    } else {
      this.cells[this.ptr] = this.input.shift().charCodeAt(0);
    }
  }

  write() {
    this.output.push(String.fromCharCode(this.get()));
  }

  dump(ins) {
    if (!this.quiet) {
      const cs = [];
      for (let i = 0; i < this.cells.length; i++) {
        const c = i === this.ptr ? `→${this.cells[i] ?? 0}` : ` ${this.cells[i] ?? 0}`;
        cs.push(c.padStart(3));
      }
      console.log(`line:${String(ins.line).padEnd(4)} ptr:${String(this.ptr).padEnd(4)} cells: ${cs.join(' ')}`);
    }
  }

  run(input = '') {
    this.pc = 0;
    this.ptr = 0;
    this.cells = [];
    this.input = input.split('');
    this.output = [];

    while (this.pc >= 0 && this.pc < this.code.length) {
      const ins = this.code[this.pc];
      try {
        ins.op(this, ins);
      } catch (e) {
        throw Error(`Error: ${e.message}, line ${ins.line}, col ${ins.col}`);
      }
      this.pc++;
    }
    return this.output.join('');
  }
}
