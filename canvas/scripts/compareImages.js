const util = require('util');
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const isPkg = typeof process.pkg !== 'undefined';
const executablePath = puppeteer.executablePath().replace(/^.*?\/node_modules\/puppeteer\/\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium'));

module.exports = async (args) => {

	const dirname = process.cwd().replace('/bin/canvasxpress', '');
	//const dirname = process.argv[1].replace('/bin/canvasxpress', '');
	
	const today = new Date().toISOString().replace('-', '').split('T')[0].replace('-', '');
	
	const logFile = fs.createWriteStream((dirname + '/logs/compareImages-' + today + '.log'), {flags : 'a'});
	
	const logStdout = process.stdout;
  
	const debug = args.debug || args.d;

	const tmout = args.timeout || args.t;

	const spinner = ora().start();

	const graph = args.graph || args.g || false;
	
	const number = args.number || args.n || false;
	
	const directory = args.directory || args.f;
	
	const index = "https://www.canvasxpress.org/html/index.html";
	
  const buildDir = directory || (dirname + "html").replace('node', '');
	
	const currentDir = ( dirname + "/canvas/site");

	const outDir = currentDir.replace('site', 'build');

	console.log = function () {
	  logFile.write(util.format.apply(null, arguments) + '\n');
	  logStdout.write(util.format.apply(null, arguments) + '\n');
	}
	console.error = console.log;

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
		
		const func = () => Array.from( document.getElementsByClassName('thumbnail'), a => a.href );

		const images = await page.evaluate( `(${func.toString()})()` );
		
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