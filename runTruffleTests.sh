#!/bin/bash
for filename in ./test/*.test.js; do
   echo "$filename"
   truffle test "$filename" --compile-none
  done