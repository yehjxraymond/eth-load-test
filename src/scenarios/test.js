const path = require('path');
const { fork } = require('child_process');

const process = fork(path.join(__dirname, '/sendToSelf.js'), ['0xff18eec4d870927f4a8acdf458b0a3ec8e96f58eeeb7cb15a9ccd37633c2b8fd']);

/*
process.send({ mails:"2" });
*/
// listen for messages from forked process

let msgCount = 0;

process.on('message', (message) => {
  console.log(message);
  msgCount++;
  if(msgCount > 5){
    process.send({ mails:"2" });
  }
});