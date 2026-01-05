# json handling test

## Goals

- make `diffAndExtract()` utility method in `src/json-handling.js`

## Sample assets

- check sample assets in `src/assets`

## Constraints

- original set is `src/assets/0-old-set.json`
- new set is `src/assets/N-LABEL.json` series (ignore `src/assets/99-selected.json`)
- user selected set is `src/assets/99-selected.json` (based on `src/assets/0-old-set.json`)
- `title` is unique in same level
- `val` is exists or not

## Features

- return `diff` and `extracted` between `src/assets/99-selected.json` and `src/assets/N-LABEL.json` series
- can set `targetLevel` and `compareKey`; diff children of `targetLevel` node values using `compareKey`

## Procedures

- extract from new set using user selection(`src/assets/99-selected.json`), will be return `extracted`
- make `diff` list
  - `type`: `added`, `deleted` or `modified`
  - `path`: key of traversal path
  - diff result
    - `added`, `deleted`
      - `before`: deleted node object
      - `after`: added node object
    - `modified`
      - `before`: before value of `compareKey`
      - `after`: after value of `compareKey`
- return `{ diff, extracted }`
- must be `extracted` is matched with `N-LABEL-result.json`
- `scripts/test-json-handling.js` is test script, please check it
