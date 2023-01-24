/* global readline, print */
const results = [];
const numTests = parseInt(readline(), 10);
for (let i = 0; i < numTests; i++) {
  const m = new Map();
  const b = new Map();

  update = (o, n) => {
    m.set(o, n);
  }

  lookup = (id) => {
    const stack = [];
    let e = id;
    do {
      id = e;
      e = m.get(id);
      if (e) {
        stack.push(id);
      }
    } while (e);
    for (const i of stack) {
      m.set(i, id);
    }
    return id;
  }

  // p [the number of boys at conscription age <= 100000]
  let p = parseInt(readline(), 10);
  for (let i = 0; i < p; i++) {
    // PESEL and MRO code
    const [id, mro] = readline().split(/\s+/);
    b.set(parseInt(id, 10), mro);
  }
  // z [the number of closed down MRO points <= 100000]
  const z = parseInt(readline(), 10);
  for (let i = 0; i < z; i++) {
    // old_code new_code
    const [oc, nc] = readline().split(/\s+/);
    update(oc, nc);
  }

  p = parseInt(readline(), 10);
  for (let i = 0; i < p; i++) {
    const pesel = parseInt(readline(), 10);
    results.push(`${pesel} ${lookup(b.get(pesel))}`);
  }
  results.push('');

  // [empty line]
  readline();
}
print(results.join('\n'));
