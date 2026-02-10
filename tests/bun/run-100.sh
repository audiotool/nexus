#!/bin/bash
# runs `bun run stop.ts` 100 times and reports how many failed
cd "$(dirname "${BASH_SOURCE[0]}")"
f=0
for i in {1..100}; do
  output=$(bun run stop.ts 2>&1)
  if [ $? -eq 0 ]; then
    echo "[$i] ok"
  else
    echo "[$i] FAIL:"
    echo "$output"
    ((f++))
  fi
done
echo "$((100-f)) passed, $f failed"
((f==0))
