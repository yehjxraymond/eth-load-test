let liveChildProcesses = 0;
let counter = 0;

const handleTransaction = (message) => {
  console.log(message.from);
  counter ++;
}

let globalStartTime;
let globalStopTime;
let totalTx = 0; 

const handleSummary = (message) => {
  if(!globalStartTime){
    globalStartTime = message.startTime;
  }else{
    globalStartTime = message.startTime < globalStartTime ? message.startTime : globalStartTime;
  }
  if(!globalStopTime){
    globalStopTime = message.stopTime;
  }else{
    globalStopTime = message.stopTime > globalStopTime ? message.stopTime : globalStopTime;
  }
  totalTx += message.transactions;
}

const processMessageHandler = (message) => {
  switch(message.type){
    case "TX":
      handleTransaction(message);
      break;
    case "SUMMARY":
      handleSummary(message);
      break;
    default:
      console.log("Unknown message received from child");
  }
}

const processExitHandler = () => {
  liveChildProcesses--;
  if(liveChildProcesses <= 0){
    console.log("Duration:", globalStopTime - globalStartTime);
    console.log("Transactions:", totalTx);
    console.log("Tx/s:", totalTx * 1000/(globalStopTime-globalStartTime));
  }
}

const processHandler = (proc) => {
  liveChildProcesses++;
  proc.on("message", processMessageHandler);
  proc.on("exit", processExitHandler);
}


module.exports = processHandler;