/* global readline, print */

/*

He calculated the number of seconds from midnight 1970.01.01 GMT to the moment of attack,
squared it, divided it by 4000000007 and sent the remainder by e-mail to McDecimal's.
 q = (x*x) % p

 if p is prime and p = 3 (mod 4), which is true, then:

 x = +/-  q^((p+1)/4) (mod p)

 */

function powerMod(q, e, p) {
  q = BigInt(q);
  p = BigInt(p);
  let x = 1n;
  q = q % p;
  while (e) {
    if (e % 2) {
      x = x * q % p
    }
    e = Math.floor(e / 2);
    q = (q * q) % p;
  }
  return Number(x);
}

const p = 4000000007;
const q = 1749870067;
const k = (p + 1) / 4;

let x = powerMod(q, k, p);
// check if inverse is smaller
let xi = p - x;
if (xi < x) {
  x = xi;
}
const d = new Date(Number(x*1000));

const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][(d.getUTCDay() + 6) % 7];
const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()];
const pad = (n) => String(n).padStart(2, '0');
console.log(`${day} ${mon} ${d.getUTCDate()} ${pad(d.getUTCHours())}:${pad(d.getMinutes())}:${pad(d.getUTCSeconds())} ${d.getFullYear()}`);
