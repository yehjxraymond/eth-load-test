const Web3 = require("web3");

const RPC_HOST = "http://127.0.0.1:8545";
const web3 = new Web3(RPC_HOST);
const privateKey = process.argv[2];

const startTime = new Date();
let sending = true;
let txCount = 0;

const reportSummary = () => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const stopTime = new Date();
  process.send({
    type: "SUMMARY",
    from: account.address,
    duration: stopTime - startTime,
    transactions: txCount
  });
}

const reportTransaction = (tx) => {
  const {from, transactionHash} = tx;
  process.send({
    type: "TX",
    from,
    transactionHash,
  });
}

const sendToSelf = async () => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const signedTx = await account.signTransaction({
    gas: 21000,
    to: account.address,
    from: account.address,
    value: 10,
  });
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};

const sendToSelfLoop = async () => {
  while(sending){
    const receipt = await sendToSelf();
    reportTransaction(receipt);
    txCount++;
  }
}

process.on('message', (message) => {
  reportSummary()
  process.exit(0);
});

sendToSelfLoop();