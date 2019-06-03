const path = require('path');
const ora = require('ora');
const puppeteer = require('puppeteer');
const isPkg = typeof process.pkg !== 'undefined';
const executablePath = puppeteer.executablePath().replace(/^.*?\/node_modules\/puppeteer\/\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium'));

module.exports = async (cmd, input, output, args) => {
  
	const debug = args.debug || args.d;
	
	const width = args.width || args.x || 800;
	
	const height = args.height || args.y || 800;	
	
	const tmout = args.timeout || args.t || 500;
	
	const spinner = ora().start();
	
	const defhtml = ("file://" + __dirname + "/src/canvasXpress.html").replace('/cmds', '');
	
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

    if (!input.match(/^file|^http/)) {
      input = "file://" + path.resolve(input);
    }
		
	  var msg = (cmd == 'csv' ? 'png' : cmd);
	  var out = path.basename(input).replace(/-/g, '').replace('.html', '.' + cmd);
		console.log("Creating " + msg + " file from " + input + " ("  + output + "/" + out + ")");

		const iter = function (cmd, input, output, debug, args, width, height) {
		  if (debug) {
		    debugger;
		  }
		  try {
				var cxs = CanvasXpress.instances;
				for (var i = 0; i < cxs.length; i++) {
				 	var cx = cxs[i];
				 	var target = cx.target;			 	
				  switch (cmd) {
				    case 'csv':
				    	cx.setDimensions(width, height);
				    	try {
				    		var config = args.config || args.c;
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
		  } catch (err) {
				console.log(err);
		  }
		}
		
		const obj = {
		  cmd: cmd,
		  input: input,
		  output: output,
			debug: debug,
			args: args,
			fun: iter.toString(),
			width: width,
			height: height
		}

		const fun = function(o) {
			return new Function(' return (' + o.fun + ').apply(null, arguments)').call(null, o.cmd, o.input, o.output, o.debug, o.args, o.width, o.height);
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
		}, cmd == 'csv' ? tmout + 2500 : tmout);
		
  } catch (err) {

    console.error(err);
  	
  }
  
}
