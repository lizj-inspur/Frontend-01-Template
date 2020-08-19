import {add} from "../src/add.js";
let assert = require("assert");

it (
  ("your test title",
  () => {
    let result = add(3,5);
    assert.equal(result,8);
  })
);
