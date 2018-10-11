const initialiseAccounts = async ({
  web3,
  fundingAccountPrivateKey,
  amount = web3.utils.toWei('1', 'ether'),
  accountsToCreate = 1,
} = {}) => {
  const fundingAccount = web3.eth.accounts.privateKeyToAccount(fundingAccountPrivateKey);

  const accounts = [];
  for(let i=0; i<accountsToCreate; i++){
    accounts.push(web3.eth.accounts.create());
    //accounts.push(web3.eth.accounts.privateKeyToAccount(fundingAccountPrivateKey));
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

module.exports = initialiseAccounts;