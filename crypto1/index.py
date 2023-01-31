import time
p = 4000000007
q = int(input())
e = (p + 1) // 4
x = pow(q, e, p)
if (x > p / 2):
    x = p - x
print(time.asctime(time.gmtime(x)))
