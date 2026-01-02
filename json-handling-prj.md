# json handling test

## Goals

- make `diffAndExtract()` utility method

## Sample assets

- check sample assets in `src/assets`

## Constraints

- original set is `src/assets/0-old-set.json`
- new set is `src/assets/N-label.json` series (ignore `src/assets/99-selected.json`)
- user selected set is `src/assets/99-selected.json` (based on `src/assets/0-old-set.json`)
- `title` is unique in same level
- `val` is exists or not

## Features

- return `diff` and `extracted` between `src/assets/99-selected.json` and `src/assets/N-label.json` series
- can set `targetLevel` and `compareKey`; diff children of `targetLevel` node values using `compareKey`

## Procedures

- extract from new set using user selection(`src/assets/99-selected.json`), will be return `extracted`
- make `diff` list
- return `{ diff, extracted }`
