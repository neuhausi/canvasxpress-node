const minimist = require('minimist');
const path = require('path');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

module.exports = () => {
	
	const args = minimist(process.argv.slice(2));

  let cmd = args._[0] || 'help';

  let input = args.input || args.i || false;
  
  let output = args.output || args.o || "./";
  
  let target = args.target || args.t || false;
  
  let data = args.data || args.d || false;
  
  let config = args.config || args.c || false;
  
  let events = args.events || args.e || false;
  
  if (args.version || args.v) {
    cmd = 'version';
  }

  if (args.help || args.h) {
    cmd = 'help';
  } 
  
  if (target && data && config) {
  	cmd = 'process';
  }
  
  if (cmd != 'process') {
  	clear();
  	
  	console.log(
  	  chalk.green(
  	    figlet.textSync('CanvasXpress', { horizontalLayout: 'full' })
  	  )
  	); 	
  }
  
	switch (cmd) {

  	case 'csv':
  	case 'png':
    case 'svg':
    case 'json':
    case 'reproduce':
    	if (input) {
        require('./cmds/io')(cmd, input, output, args);    		
    	} else {
        require('./cmds/help')(args);    		
    	}
      break;
    case 'canvas':
      require(path.resolve(input).split('.').slice(0, -1).join('.'))(args);
      break;
    case 'version':
      require('./cmds/version')(args);
      break;

    case 'help':
      require('./cmds/help')(args);
      break;
  	
    case 'test':
      require('./cmds/io')("png", "https://canvasxpress.org/html/bar-3.html", "./test/", args);
      require('./cmds/io')("svg", "https://canvasxpress.org/html/bar-3.html", "./test/", args);
      require('./cmds/io')("json", "https://canvasxpress.org/html/bar-3.html", "./test/", args);
      break;

    case 'process':
    	console.error('Coming soon!');
    	break;
      
    default:
      console.error(`"${cmd}" is not a valid command!`);
      break;

  }
  

}