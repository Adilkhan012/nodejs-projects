// Code work: read traits.json file and add some N to all token ids
// Run like: node main.js > traits-v1.json

import { tokens_ } from "./_4_MaleShirt.js";

const N = 2776;

let tokens = tokens_.map((token) => ({
  ...token,
  tokenId: Number(token.tokenId) + N,
}));

console.log(JSON.stringify(tokens, null, 4));
