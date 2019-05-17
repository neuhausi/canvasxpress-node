const minimist = require('minimist');
const path = require('path');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

module.exports = () => {

	clear();
	
	console.log(
	  chalk.green(
	    figlet.textSync('CanvasXpress', { horizontalLayout: 'full' })
	  )
	);
	
	const args = minimist(process.argv.slice(2));

  let cmd = args._[0] || 'help';

  let input = args.input || args.i || false;
  
  let output = args.output || args.o || "./";
  
  if (args.version || args.v) {
    cmd = 'version';
  }

  if (args.help || args.h) {
    cmd = 'help';
  } 
  
  switch (cmd) {

    case 'png':
    	if (input) {
        require('./cmds/png')(input, output);    		
    	} else {
        require('./cmds/help')(args);    		
    	}
      break;
      
    case 'svg':
    	if (input) {
        require('./cmds/svg')(input, output);    		
    	} else {
        require('./cmds/help')(args);    		
    	}
      break;

    case 'json':
    	if (input) {
        require('./cmds/json')(input, output);    		
    	} else {
        require('./cmds/help')(args);    		
    	}
      break;

    case 'version':
      require('./cmds/version')(args);
      break;

    case 'help':
      require('./cmds/help')(args);
      break;
  	
    case 'test':
      require('./cmds/png')("https://canvasxpress.org/html/bar-3.html", "./test/", true);
      require('./cmds/svg')("https://canvasxpress.org/html/bar-3.html", "./test/", true);
      require('./cmds/json')("https://canvasxpress.org/html/bar-3.html", "./test/", true);
      break;

    case 'debug':
    	require('./cmds/debug')("file://" + __dirname + "/src/canvasXpress.html", "./src/");
    	break;
      
    default:
      console.error(`"${cmd}" is not a valid command!`);
      break;

  }
  

}