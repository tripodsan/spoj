/* global readline, print */

function inc(s, i) {
  do {
    s[i] = (s[i] + 1) % 10;
  } while (s[i--] === 0 && i >= 0);
  return i;
}

function palindrom(s) {
  const digits = s.split('').map((d) => parseInt(d, 10));
  let l = digits.length;
  if (l === 1 && digits[0] < 9) {
    return String(digits[0] + 1);
  }

  let l2 = Math.floor(l / 2);
  // if already a palindrom, add 1 to it
  let isp = true;
  for (let i = 0; i < l2; i++) {
    if (digits[i] !== digits[l - i - 1]) {
      isp = false;
    }
  }
  if (isp) {
    if (inc(digits, l - 1) < 0) {
      digits.unshift(1);
      l = digits.length;
      l2 = Math.floor(l / 2);
    }
  }

  for (let i = 0; i < l2; i++) {
    const d0 = digits[i];
    const d1 = digits[l - i - 1];
    if (d0 < d1) {
      // if first digit is smaller, the opposite can't _reach_ it anymore, so we need to inc the next power(s)
      inc(digits, l - i - 2);
    }
    digits[l - i - 1] = digits[i];
  }
  return digits.join('');
}

const num = parseInt(readline(), 10);
for (let i = 0; i < num; i++) {
  print(palindrom(readline()));
}
