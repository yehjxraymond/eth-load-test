let liveChildProcesses = 0;
let counter = 0;

const handleTransaction = (message, thisProcess) => {
  console.log(message.from);
  counter ++;
  if(counter >= 5){
    thisProcess.send({ mails:"2" });
  }
}

const handleSummary = (message) => {console.log(message)}

const processMessageHandler = (thisProcess) => (message) => {
  switch(message.type){
    case "TX":
      handleTransaction(message, thisProcess);
      break;
    case "SUMMARY":
      handleSummary(message, thisProcess);
      break;
    default:
      console.log("Unknown message received from child");
  }
}

const processExitHandler = () => {
  liveChildProcesses--;
  if(liveChildProcesses <= 0){
    console.log("Summary processing here!");
  }
}

const processHandler = (proc) => {
  liveChildProcesses++;
  proc.on("message", processMessageHandler(proc));
  proc.on("exit", processExitHandler);
}


module.exports = processHandler;