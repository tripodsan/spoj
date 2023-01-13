[
  # BF implementation for https://www.spoj.com/problems/SORTING/
  # use the input as index into an array to count the number of occurrences of the letters
  # and then output them sequentially.
  # the counters have 1 free cell in between, used to move the ptr
  # the layout is: ACC COUNTER
]
>> # leave 2 space at the beginning to avoid backtrack below 0

, ---------- # read first char
[
  ---------- ---------- ---------- ---------- ---------- ---- # subtract 54
  [  # while not zero; propagate the acc to the right
    -[->>+<<]+>> # duplicate the input minus 1 but leave a trace (ptr on ACC)
  ]
  <+ # increment the letter counter
  <[-<<]>> # trace back
  ?
  , ---------- # read next char and subtract 10 stop if newline
]

# output chars
++++++++++ ++++++++++ ++++++ # init ACC with 26
[
  <++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++ +> # init left with 91
  [-<->>>+<<]> # copy the acc to the right and calc 91 minus ACC (ptr on COUNTER)
  [-
    <<.>> # output COUNT letters
  ]
  > # move to next ACC
-]
