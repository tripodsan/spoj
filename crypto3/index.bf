>>>>> # give some space for leading digits

# read input and subtract 48; interspace with 3
,---------- # subtract 10 to detect newline
[
  ---------- ---------- ----------
  -------  # subtract 37
  >>>     # leave 2 space
  ,
  ---------- # subtract 10 to detect newline
]<<<

[
  - # subtract the last 1 from the ascii
?
  # multiply with 2 and copy left
  [-<++>]

  >[-<+>]<<  # add the previous carry
?
  [->+< # minus 1
    [->+< # minus 2
      [->+< # minus 3
        [->+< # minus 4
          [->+< # minus 5
            [->+< # minus 6
              [->+< # minus 7
                [->+< # minus 8
                  [->+< # minus 9
                    [ # minus 10
                      > ---------- < # subtract 10
                      [->+<] # add remainder
                      <+> # set carry
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ]
  >
  + # add 1 for tracing
  ?
  <<< # proceed to next digit
]
?
# check last carry
>[<++<<]
>>
?

# output
[
  ++++++++++ ++++++++++ ++++++++++ ++++++++++ # add 47
  +++++++
  .
  >>>
]
