import { test } from 'node:test';
import * as assert from 'node:assert';
import AoLoader from '@permaweb/ao-loader';
import fs from 'fs'
import format from '../format.js';

const wasm = fs.readFileSync('./process.wasm');
const options = { format: format }

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

test('run random generator successfully', async () => {
	const handle = await AoLoader(wasm, options);
	const start = await init(handle)

	const data = `
		local crypto = require(".crypto")

		return crypto.random();
	`;
	const msg = {
		Target: 'AOS',
		From: 'FOOBAR',
		Owner: 'FOOBAR',
		['Block-Height']: '1000',
		Id: '1234xyxfoo',
		Module: 'WOOPAWOOPA',
		Tags: [{ name: 'Action', value: 'Eval' }],
		Data: data,
	};

	const result = await handle(start, msg, env);
	assert.equal(result.Output?.data, 532713800);
	assert.ok(true);
});
