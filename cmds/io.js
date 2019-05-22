const path = require('path');
const ora = require('ora');
const puppeteer = require('puppeteer');
const isPkg = typeof process.pkg !== 'undefined';
const executablePath = puppeteer.executablePath().replace(/^.*?\/node_modules\/puppeteer\/\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium'));

module.exports = async (cmd, input, output, args) => {
  
	const debug = args.debug || args.d;
	
	const width = args.width || args.x;
	
	const height = args.height || args.y
	
	const spinner = ora().start();

  try {
  	
		const browser = await puppeteer.launch({ 
			headless: debug ? false : true,
			devtools: debug ? true : false, 
			executablePath: isPkg ? executablePath : puppeteer.executablePath()
		});
		
		const page = await browser.newPage();

		const func = function (cmd, debug) {
		  if (debug) {
		    debugger;
		  }
			var cxs = CanvasXpress.instances;
			for (var i = 0; i < cxs.length; i++) {
			 	var cx = cxs[i];
			 	var target = cx.target;			 	
			  switch (cmd) {
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
		
		var object = {
		  cmd: cmd,
			debug: debug,
			fun: func.toString()
		}

		await page._client.send('Page.setDownloadBehavior', {
		  behavior: 'allow', 
		  downloadPath: output
		});

		await page.goto(input);
		
		await page.evaluate( o => {
	    return new Function(' return (' + o.fun + ').apply(null, arguments)').call(null, o.cmd, o.debug);
		}, object );
		
		setTimeout(() => { 
			browser.close(); 
	    spinner.stop();
		}, debug ? 3000 : 500);
    
  } catch (err) {

  	spinner.stop()

    console.error(err);
  	
  }
  
}
