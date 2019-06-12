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

    default:
      console.error(`"${cmd}" is not a valid command!`);
      break;

  }
  

}