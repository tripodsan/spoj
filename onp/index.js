/* global readline, print */

const PRECEDENCE = {
  '^': 5,
  '/': 4,
  '*': 3,
  '−': 2,
  '+': 1,
}

/**
 * from https://en.wikipedia.org/wiki/Shunting_yard_algorithm#The_algorithm_in_detail
 * @param s
 * @returns {string}
 */
function shuntingYard(s) {
  const out = [];
  const ops = [];
  while (s.length) {
    const c = s.shift();
    if (c >= 'a' && c <= 'z') {
      // put the operand to the output queue
      out.push(c);
    }
    else if (c === '(') {
      // push the left parenthesis to the output stack
      ops.unshift(c);
    }
    //     - a right parenthesis (i.e. ")"):
    else if (c === ')') {
      // output all ops until the opening parenthesis
      while (ops[0] !== '(') {
        out.push(ops.shift());
      }
      // and discard it
      ops.shift();
    }
    else {
      // out any operator that has a greater precedence first (we ignore the association,
      // since the puzzle doesn't have such inputs
      const p = PRECEDENCE[c];
      while (ops.length && ops[0] !== '(' && PRECEDENCE[ops[0]] >= p) {
        out.push(ops.shift());
      }
      // finally put the new operator to the stck
      ops.unshift(c);
    }
  }

  // output the remaining operators
  out.push(...ops);
  return out;
}

const num = parseInt(readline(), 10);
for (let i = 0; i < num; i++) {
  print(shuntingYard(readline().split('')).join(''));
}
