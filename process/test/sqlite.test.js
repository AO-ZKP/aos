import { test } from 'node:test'
import * as assert from 'node:assert'
import AoLoader from '@permaweb/ao-loader'
import fs from 'fs'

const wasm = fs.readFileSync('./process.wasm')
const options = { format: "wasm64-unknown-emscripten-draft_2024_02_15" }

const env = {
  Process: {
    Id: 'AOS',
    Owner: 'FOOBAR',
    Tags: [
      { name: 'Name', value: 'Thomas' }
    ]
  }
}

async function init(handle) {
  const {Memory} = await handle(null, {
    Target: 'AOS',
    From: 'FOOBAR',
    Owner: 'FOOBAR',
    'Block-Height': '999',
    Id: 'AOS',
    Module: 'WOOPAWOOPA',
    Tags: [
      { name: 'Name', value: 'Thomas' }
    ]
  }, env)
  return Memory
}

const msg = (cmd) => ({
  Target: 'AOS',
  From: 'FOOBAR',
  Owner: 'FOOBAR',
  ['Block-Height']: "1000",
  Id: "AOS",
  Module: "WOOPAWOOPA",
  Tags: [
    { name: 'Action', value: 'Eval' }
  ],
  Data: cmd
})


test('create sqlite db, run insert & select', async () => {
  const handle = await AoLoader(wasm, options)
  const start = await init(handle)
  const run1 = `
  local sqlite3 = require("lsqlite3")

  db = sqlite3.open_memory()
  
  db:exec[[
    CREATE TABLE test (id INTEGER PRIMARY KEY, content);
    INSERT INTO test VALUES (NULL, 'Hello Lua');
    INSERT INTO test VALUES (NULL, 'Hello Sqlite3');
    INSERT INTO test VALUES (NULL, 'Hello ao!!!');
  ]]
  return "ok"
  `
 
  
  const msg1 = msg(run1)
  const result1 = await handle(start, msg1, env)
  console.log('result1:\n' + result1.Output?.data)
  assert.equal(result1.Output?.data, 'ok')

  const run2 = `
  local s = ""

  for row in db:nrows("SELECT * FROM test") do
    s = s .. row.id .. ": " .. row.content .. "\\n"
  end

  return s
  `
  const msg2 = msg(run2)
  // const result2 = await handle2(result1.Memory, msg2, env)
  const result2 = await handle(result1.Memory, msg2, env)
  console.log('\nresult2:\n' + result2.Output?.data)
  assert.equal(result2.Output?.data, '1: Hello Lua\n2: Hello Sqlite3\n3: Hello ao!!!\n')
})
