/* 
var tty = require('tty'); 
var ttys = require('ttys'); 
var rl = require('readline');  
 
var stdin = ttys.stdin; 
var stdout = ttys.stdout; 

stdout.write("hello world\n");
stdout.write("\033[1A");
stdout.write("lizj"); */



const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What do you think of Node.js? ', (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.close();
});