const Web3 = require("web3");
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');

const RPC_HOST = "http://127.0.0.1:8546";
const FUNDING_ACCOUNT_PRIVATE_KEY = "0xff18eec4d870927f4a8acdf458b0a3ec8e96f58eeeb7cb15a9ccd37633c2b8fd";

const engine = new ProviderEngine()
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const fundingAccount = web3.eth.accounts.privateKeyToAccount(FUNDING_ACCOUNT_PRIVATE_KEY);

const ETHER = web3.utils.toWei('1', 'ether');

const initialiseAccounts = async ({amount = ETHER, accountsToCreate = 1} = {}) => {
  const accounts = [];
  for(let i=0; i<accountsToCreate; i++){
    accounts.push(web3.eth.accounts.create());
  }

  const nonce = await web3.eth.getTransactionCount(fundingAccount.address, "pending");

  // Create transactions for each account
  const txns = accounts.map((acc, i) => ({
    gas: 21000,
    to: acc.address,
    from: fundingAccount.address,
    value: amount,
    nonce: nonce + i,
  }));

  // Sign transactions
  const signedTxPromise = txns.map(tx => fundingAccount.signTransaction(tx));
  const signedTx = await Promise.all(signedTxPromise);

  // Send signed transactions
  const sendTxPromise = signedTx.map(tx => web3.eth.sendSignedTransaction(tx.rawTransaction));
  const sentTxReceipts = await Promise.all(sendTxPromise);

  return accounts;
}

initialiseAccounts()
.then(res => {
  console.log(res);
})
.catch(console.error)

initialiseAccounts()
.then(res => {
  console.log(res);
})
.catch(console.error)