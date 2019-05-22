const path = require('path');
const ora = require('ora');
const puppeteer = require('puppeteer');
const isPkg = typeof process.pkg !== 'undefined';
const executablePath = puppeteer.executablePath().replace(/^.*?\/node_modules\/puppeteer\/\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium'));

module.exports = async (input, output, debug) => {
  
	const spinner = ora().start();

  try {
  	
		const browser = await puppeteer.launch({ 
			headless: debug ? false : true,
			devtools: debug ? true : false, 
			executablePath: isPkg ? executablePath : puppeteer.executablePath()
		});
		
		const page = await browser.newPage();

		await page._client.send('Page.setDownloadBehavior', {
		  behavior: 'allow', 
		  downloadPath: output
		});

		await page.goto(input);
		
		await page.evaluate( (debug) => {

			if (debug) {
			  debugger;
			}

			var cxs = CanvasXpress.instances;
			for (var i = 0; i < cxs.length; i++) {
			 	var cx = cxs[i];
			 	var target = cx.target;
			 	cx.saveSVG(false, target + '.svg');
			};
			
		}, debug);
		
		setTimeout(() => { 
			browser.close(); 
	    spinner.stop();
		}, debug ? 3000 : 500);
    
  } catch (err) {

  	spinner.stop()

    console.error(err);
  	
  }
  
}
