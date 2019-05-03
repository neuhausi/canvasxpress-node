const ora = require('ora');
const puppeteer = require('puppeteer');

module.exports = async (input, output, test) => {
  
	const spinner = ora().start();

  try {
  	
		const browser = await puppeteer.launch({ headless: test ? false : true, devtools: false });
		
		const page = await browser.newPage();

		await page._client.send('Page.setDownloadBehavior', {
		  behavior: 'allow', 
		  downloadPath: output
		});

		await page.goto(input);
		
		await page.evaluate( () => {

			var cxs = CanvasXpress.instances;
			for (var i = 0; i < cxs.length; i++) {
			 	var cx = cxs[i];
			 	var target = cx.target;
			 	cx.saveSVG(false, target + '.svg');
			};
			
		});
		
		setTimeout(() => { 
			browser.close(); 
	    spinner.stop();
		}, test ? 3000 : 500);
    
  } catch (err) {

  	spinner.stop()

    console.error(err);
  	
  }
  
}
