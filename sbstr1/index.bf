+ # 24 input lines
[->

# generate the first decimal; remember the input bits
# a = previous dec
[->++<]   # b = a * 2
>> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+<+>>]    # b = b plus c; a = copy of input
< ?
[->++<]   # b = a * 2
>> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+<+>>]    # b = b plus c; a = copy of input
< ?
[->++<]   # b = a * 2
>> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+<+>>]    # b = b plus c; a = copy of input
< ?
[->++<]   # b = a * 2
>> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+<+>>]    # b = b plus c; a = copy of input
< ?
[->++<]   # b = a * 2
>> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+<+>>]    # b = b plus c; a = copy of input
< ?

# now generate the 4 subsequent decimals
# create a copy and b = a * 2
[->+>++<<]
>+< # add 1 to the number to avoid zeros when testing

?
# check if first bit was set; if so we need to substract 32
<<<<<?[->>>>>>> -------- -------- -------- -------- <<<<<<<]>>>>>>>
# read input add add it
> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+>]    # b = b plus c
< ?

# repeat 4 times
[->+>++<<]
>+< # add 1 to the number to avoid zeros when testing

<<<<<<?[->>>>>>>> -------- -------- -------- -------- <<<<<<<<]>>>>>>>>
> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+>]    # b = b plus c
< ?

[->+>++<<]
>+< # add 1 to the number to avoid zeros when testing
<<<<<<<?[->>>>>>>>> -------- -------- -------- -------- <<<<<<<<<]>>>>>>>>>
> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+>]    # b = b plus c
< ?

[->+>++<<]
>+< # add 1 to the number to avoid zeros when testing
<<<<<<<<?[->>>>>>>>>> -------- -------- -------- -------- <<<<<<<<<<]>>>>>>>>>>
> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+>]    # b = b plus c
< ?

[->+>++<<]
>+< # add 1 to the number to avoid zeros when testing
<<<<<<<<<?[->>>>>>>>>>> -------- -------- -------- -------- <<<<<<<<<<<]>>>>>>>>>>>
> , -------- -------- -------- -------- -------- --------  # c = input minus 48
[-<+>]    # b = b plus c
< ?
[->+<]
>+> ? # add 1 to the number to avoid zeros when testing

# generate the dec of the test string
, -------- -------- -------- -------- # skip space
?

+++++         # i = 5
[>            # while i
  , -------- -------- -------- -------- -------- --------  # input minus 48
  > [->++<]   # c = b * 2
  > [-<+>]    # b = c
  << [->+<]   # b plus= a
<-]>>         # dec i
+# add 1 to the number to avoid zeros when testing
?
# now cells look like this:
# 0   0   0   0   0   0  21   0  11   0  22   0  12   0  25   0  18   0   0 →23   0
# copy the test number besides the input numbers and add a 1 1sentinel
[-<<+<<+<<+<<+<<+<<+>>>>>>>>>>>>]+<+<<<<<<<<<<<<
# 0   0   0   0   0   0 →21  23  11  23  22  23  12  23  25  23  18  23   1   0   0
?

[->-<]> # test if the pairs match
[
  [-]> # if no match reset and test next pair
  [->-<]>
  ?
]
>?
# if the next is non zero then it matched otherwise the sentinel matched and the next is 0
[
  [[-]>] # reset all
  >
  + # prepare output
  <
]
> ++++++++ ++++++++ ++++++++ ++++++++ ++++++++ ++++++++ .[-] # output and reset
++++++++++.[-] # output new line
<<<<<<<<< <<<<<<<<< <<< # back to the beginning and process next line

,[-] # read newline
?
<]

