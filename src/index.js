const path = require('path');
const Web3 = require("web3");
const { fork } = require('child_process');

const processHandler = require('./processHandler');
const setupAccounts = require('./setupAccounts');

const RPC_HOST = "http://127.0.0.1:8545";
const FUNDING_ACCOUNT_PRIVATE_KEY = "0xff18eec4d870927f4a8acdf458b0a3ec8e96f58eeeb7cb15a9ccd37633c2b8fd";
const RUN_DURATION = 60000;
const NUM_ACCOUNTS = 60;

const web3 = new Web3(RPC_HOST);

let accounts;
let childProcesses;

const setup = async () => {
  accounts = await setupAccounts({
    web3,
    fundingAccountPrivateKey: FUNDING_ACCOUNT_PRIVATE_KEY,
    accountsToCreate: NUM_ACCOUNTS
  });
  return accounts;
}

const runScenarios = async (accs) => {
  childProcesses = accs.map(acc => {
    const childProcess = fork(path.join(__dirname, './scenarios/sendToSelf.js'), [acc.privateKey]);
    processHandler(childProcess);
    return childProcess;
  });
  setTimeout(()=> {
    childProcesses.forEach(p => p.send({exit: 1}));
  }, RUN_DURATION);
}

setup()
.then(runScenarios);