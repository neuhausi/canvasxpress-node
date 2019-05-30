const path = require('path');
const fs = require('fs');
const https = require('https');
const ora = require('ora');
const puppeteer = require('puppeteer');
const isPkg = typeof process.pkg !== 'undefined';
const executablePath = puppeteer.executablePath().replace(/^.*?\/node_modules\/puppeteer\/\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium'));

const download  = ( url, destination ) => new Promise( ( resolve, reject ) => {
	const file = fs.createWriteStream( destination );
	https.get( url, response => {
		response.pipe( file );
		file.on( 'finish', () => {
			file.close( resolve( true ) );
		});
	})
	.on( 'error', error => {
		fs.unlink( destination );
		reject( error.message );
	});
});

module.exports = async (args) => {

	const debug = args.debug || args.d;

	const tmout = args.timeout || args.t;

	const spinner = ora().start();

	const skip = args.skip || args.n;
	
	try {

		if (!skip) {
			
			const browser = await puppeteer.launch({ 
				headless: debug ? false : true,
				devtools: debug ? true : false, 
				executablePath: isPkg ? executablePath : puppeteer.executablePath(),
				args: ['--no-sandbox',
							 '--allow-file-access-from-files',
							 '--enable-local-file-accesses']
			});

			const page = await browser.newPage();

			let result;

			await page.goto(index);

			const images = await page.evaluate( () => Array.from( document.images, e => e.src ) );

			for ( let i = 0; i < images.length; i++ ) {
				result = await download(images[i], './canvas/build/' + path.basename(images[i]));
				if (result === true) {
					console.log(images[i], 'downloaded successfully.');
				} else {
					console.log('Error:', images[i], 'was not downloaded.');
					console.error(result);
				}
			}

			await setTimeout(() => { 
				browser.close(); 
		    spinner.stop();
			}, tmout);
			
		} else {
			
	    spinner.stop();			
			
		}
		
		const directory = ( __dirname + "images/ex").replace('node/canvas/scripts', '');
		
		fs.readdir(directory, function(err, items) {
	    for (var i=0; i<items.length; i++) {
	      console.log(directory + '/' + items[i]);
	    }
	  });

		
		
	} catch (err) {

		console.error(err);

	}

}