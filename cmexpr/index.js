/* global readline, print */

const PRECEDENCE = {
  '/': 2,
  '*': 2,
  '-': 1,
  '+': 1,
}

const LHS = {
  '/': true,
  '-': true,
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
    // - a right parenthesis (i.e. ")"):
    else if (c === ')') {
      // output all ops until the opening parenthesis
      while (ops[0] !== '(') {
        out.push(ops.shift());
      }
      // and discard it
      ops.shift();
    }
    else {
      // out any operator that has a greater precedence first
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

function infix(pfx) {
  const stack = [];
  while (pfx.length) {
    const c = pfx.shift();
    const p = PRECEDENCE[c];
    if (p) {
      const rhs = stack.pop();
      const lhs = stack.pop();
      const le = p > lhs.p ? `(${lhs.e})` : lhs.e;
      const re = p > rhs.p || p === rhs.p && LHS[c] ? `(${rhs.e})` : rhs.e;
      stack.push({
        e:`${le}${c}${re}`,
        p,
      });
    } else {
      stack.push({
        e: c,
        p: 9,
      });
    }
  }
  return stack[0].e;
}

const num = parseInt(readline(), 10);
for (let i = 0; i < num; i++) {
  const exp = readline();
  const pfx = shuntingYard(exp.split(''));
  // print('----------------------------');
  // print(exp);
  // print(pfx.join(''));
  print(infix(pfx));
}
