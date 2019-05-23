const path = require('path');
const ora = require('ora');
const puppeteer = require('puppeteer');
//const fs = require('fs');
//const mime = require('mime');
//const URL = require('url').URL;
const isPkg = typeof process.pkg !== 'undefined';
const executablePath = puppeteer.executablePath().replace(/^.*?\/node_modules\/puppeteer\/\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium'));

module.exports = async (cmd, input, output, args) => {
  
	const debug = args.debug || args.d;
	
	const width = args.width || args.x;
	
	const height = args.height || args.y
	
	const spinner = ora().start();
	
	const defhtml = ("file://" + __dirname + "/src/canvasXpress.html").replace('/cmds', '');

  try {
  	
		const browser = await puppeteer.launch({ 
			headless: debug ? false : true,
			devtools: debug ? true : false, 
			executablePath: isPkg ? executablePath : puppeteer.executablePath()
		});
		
		const page = await browser.newPage();

		const iter = function (cmd, input, debug, args) {
		  if (debug) {
		    debugger;
		  }
			var cxs = CanvasXpress.instances;
			for (var i = 0; i < cxs.length; i++) {
			 	var cx = cxs[i];
			 	var target = cx.target;			 	
			  switch (cmd) {
			    case 'csv':
			    	var config = args.config || args.c;
			    	try {
				    	var conf = config ? JSON.parse(config) : false;
				    	cx.dataURL = input;
				    	cx.remoteTransitionEffect = 'none';
				    	cx.getDataFromURL(target, conf, false, false, function(){
				  			var cxs = CanvasXpress.instances;
							 	var cx = cxs[cxs.length - 1];
							 	var target = cx.target;			 	
				    		cx.print(false, target + '.png');
				    	});			    		
			      } catch (err) {
			      	spinner.stop()
			        console.error(err);
			      }
			    	break;
			    case 'png':
					 	cx.print(false, target + '.png');
			    	break;
			    case 'svg':
					 	cx.saveSVG(false, target + '.svg');
			    	break;
			    case 'json':
					 	cx.save(false, target + '.json');
			    	break;
			  }			 	
		  }
		}
		
		const obj = {
		  cmd: cmd,
		  input: input,
			debug: debug,
			args: args,
			fun: iter.toString()
		}

		const fun = function(o) {
			return new Function(' return (' + o.fun + ').apply(null, arguments)').call(null, o.cmd, o.input, o.debug, o.args);
		}
		
		await page._client.send('Page.setDownloadBehavior', {
		  behavior: 'allow', 
		  downloadPath: output
		});

		await page.goto(cmd == 'csv' ? defhtml : input);
			
		await page.evaluate( fun, obj );

		await setTimeout(() => { 
			browser.close(); 
	    spinner.stop();
		}, debug ? 300000 : cmd == 'csv' ? 3000 : 500);
    
  } catch (err) {

  	spinner.stop()

    console.error(err);
  	
  }
  
}
