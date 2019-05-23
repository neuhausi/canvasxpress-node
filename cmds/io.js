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

  try {
  	
		const browser = await puppeteer.launch({ 
			headless: debug ? false : true,
			devtools: debug ? true : false, 
			executablePath: isPkg ? executablePath : puppeteer.executablePath()
		});
		
		const page = await browser.newPage();

		const iter = function (cmd, debug, args) {
		  if (debug) {
		    debugger;
		  }
		  if (cmd == 'csv') {
		  	
		  } else {
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
		}
		
		const obj = {
		  cmd: cmd,
			debug: debug,
			args: args,
			fun: iter.toString()
		}

		const fun = function(o) {
			return new Function(' return (' + o.fun + ').apply(null, arguments)').call(null, o.cmd, o.debug, o.args);
		}
		
		await page._client.send('Page.setDownloadBehavior', {
		  behavior: 'allow', 
		  downloadPath: output
		});

		if (cmd == 'csv') {
			
			//const responses = [];

			//page.on('response', resp => {
			//  responses.push(resp);
			//});

			//page.on('load', () => {
			//  responses.map(async (resp, i) => {
			//    const request = await resp.request();
			//    const url = new URL(request.url);
			//    const split = url.pathname.split('/');
			//    let filename = split[split.length - 1];
			//    if (!filename.includes('.')) {
			//      filename += '.html';
			//    }
			//    const buffer = await resp.buffer();
			//    fs.writeFileSync(filename, buffer);
			//  });
			//});

			//await page.goto("file://" + __dirname + "/src/canvasXpress.html", {waitUntil: 'networkidle'});
			
		} else {

			await page.goto(input);
			
		}
		
		await page.evaluate( fun, obj );
		
		setTimeout(() => { 
			browser.close(); 
	    spinner.stop();
		}, debug ? 3000 : 500);
    
  } catch (err) {

  	spinner.stop()

    console.error(err);
  	
  }
  
}
