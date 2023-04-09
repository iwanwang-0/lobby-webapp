import snapshot from '@snapshot-labs/snapshot.js';

const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);

export default client;
