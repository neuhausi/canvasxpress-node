const ora = require('ora');
const puppeteer = require('puppeteer');

module.exports = async () => {
  
	const spinner = ora().start();

  try {

    const input = "https://canvasxpress.org/html/bar-3.html";
    
    const output = "./debug";

		const browser = await puppeteer.launch({ headless: false, devtools: false });
		
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
			 	browser;
			 	var target = cx.target;
			 	cx.print(false, target + '.png');
			};
			
		});
		
  } catch (err) {

  	spinner.stop()

    console.error(err);
  	
  }
  
}
