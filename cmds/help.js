const menus = {
		
  main: `
    canvasxpress [command] <options>

    png ................ create a png file 
    svg ................ create a svg file 
    json ............... create a json file 
    test ............... test package
    debug .............. debug package
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

  svg: `
    --input, -i ........ <required> file or url with CanvasXpress visualizations:
                         file:///path/to/local/file.html
                         http://page/with/visualization.html
                         https://page/with/visualization.html
    --output, -o ....... [optional] directory path to save images
                         {default} './'
    `,
    
  json: `
    --input, -i ........ <required> file or url with CanvasXpress visualizations:
                         file:///path/to/local/file.html
                         http://page/with/visualization.html
                         https://page/with/visualization.html
    --output, -o ....... [optional] directory path to save images
                         {default} './'
    `

}

module.exports = (args) => {
  
	const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
  
}