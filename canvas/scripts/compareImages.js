const path = require('path');
const fs = require('fs');
const https = require('https');
const ora = require('ora');
const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
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

	const skip = args.skip || args.s;
	
	const graph = args.graph || args.g || false;
	
	const number = args.number || args.n || false;
	
	const index = "https://www.canvasxpress.org/html/index.html";
	
	const buildDir = ( __dirname + "html").replace('node/canvas/scripts', '');
	
	const currentDir = ( __dirname + "site").replace('scripts', '');

	const outDir = currentDir.replace('site', 'build');

	try {

		const browser = await puppeteer.launch({ 
			headless: debug ? false : true,
			devtools: debug ? true : false, 
			executablePath: isPkg ? executablePath : puppeteer.executablePath(),
			args: ['--no-sandbox',
						 '--allow-file-access-from-files',
						 '--enable-local-file-accesses']
		});

		const page = await browser.newPage();
		
		const compare = function(sit, cur, dif) {
 			var img1 = readImage(cur, function () {
        var img2 = readImage(sit, function () {
          var diff = new PNG({width: img1.width, height: img1.height});
          var pixl = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1}, true);
          diff.pack().pipe(fs.createWriteStream(dif));
  	      console.log(dif + ": " + pixl + " different");
        });
      });					
		}
		
		const readImage = function (p, f) {
      return fs.createReadStream(p).pipe(new PNG()).on('parsed', f);
	  }
		
		await page.goto(index);

		const images = await page.evaluate( () => Array.from( document.getElementsByClassName('thumbnail'), a => a.href ) );
		
		for ( let i = 0; i < images.length; i++ ) {
			var tst = path.basename(images[i]).replace(/-/g, '');
			var inp = buildDir + '/' + path.basename(images[i]);
		  if (graph) {
		   	if (number) {
		   		if (!tst.match(graph + number)) {
		   			continue;
		   		}	    		
		   	} else {
		   		if (!tst.match(graph)) {
		   			continue;
		   		}
		   	}
		  }
      // Build / Current image
      await require('../../cmds/io')("png", inp, outDir, args);
      // Site image
      await require('../../cmds/io')("png", images[i], currentDir, args);
		}
		
	  await setTimeout(() => { 
	  	browser.close(); 
	    spinner.stop();
		}, tmout);

	  for ( let i = 0; i < images.length; i++ ) {
			var tst = path.basename(images[i]).replace(/-/g, '');
			var sit = currentDir + '/' + path.basename(images[i]).replace(/-/g, '').replace('.html', '.png');
			var cur = outDir + '/' + path.basename(images[i]).replace(/-/g, '').replace('.html', '.png');			
	    var dif = cur.replace('.png', '.diff.png');
		  if (graph) {
		   	if (number) {
		   		if (!tst.match(graph + number)) {
		   			continue;
		   		}	    		
		   	} else {
		   		if (!tst.match(graph)) {
		   			continue;
		   		}
		   	}
		  }
      // Compare pages
      await compare(sit, cur, dif);
		}  
		
	} catch (err) {

		console.error(err);

	}

}