/*
y = a*p*b*q
u = p*q - p - q - 1;
  = p(q - 1) - q + 1
  = p(q-1) - (q - 1)
  = (p-1)*(q-1)

x = a*p+b*q

    1*p + 0*q
    2*p
    3*p
    4*p
    5*p
    .
    q*p

    1*p + 1*q
    2*p + 1*q
    .
    q*(p-1) + 1*q

    ==> (p-1)*(q-1) / 2 pairs fulfill x=a*p+b*q

o = u / 2;


 */

const q = 31;
const p = 51;

let u = 0;

const x = new Array(p*q).fill(1);

for (let i = 1; i <= p*q; i++) {
  if (i % p && i % q) {
    u++;
  }
}
console.log('u', u, (p -1) * (q - 1));

for (let a = 0; a <= q; a++) {
  for (let b = 0; b <= p; b++) {
    x[a*p + b*q] = 0;
  }
}
console.log('o', x.reduce((s, v) => s + v, 0));
