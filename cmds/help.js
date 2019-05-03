const menus = {
		
  main: `
    canvasxpress [command] <options>

    png ................ create a png file 
    test ............... test package
    version ............ show package version    
    help ............... show help menu for a command
    `,
    
  png: `
    --input, -i ........ <required> file or url with CanvasXpress visualizations:
                         file:///path/to/local/file.html
                         http://page/with/visualization.html
                         https://page/with/visualization.html
    --output, -o ....... [optional] directory path to save images
                         {default} './'
                         `,
  	
}

module.exports = (args) => {
  
	const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
  
}