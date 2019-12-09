// Note: Receives a `DOMException: Failed to execute 'open' on 'XMLHttpRequest'`
// error if the protocol isn't included!
const NETWORK = "demo-network";
const SERVER = "http://localhost";
const KMD_VERSION = "kmd-v0.5";

// Default to Primary node at startup.
let NODE = "Primary";

let ALGOD_PORT;
let ALGOD_TOKEN;

let KMD_PORT;
let KMD_TOKEN;

// We need to create new `algod` and `kmd` instances whenever a node is selected.
let algod;
let kmd;

// For holding the current transaction details.
let tx;

// Hack for the demo.
let lastGeneratedAccount = {};
let _signedTransaction = {};
let _rawTransaction = {};

