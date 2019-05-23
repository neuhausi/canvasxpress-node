const menus = {
		
  main: `
    canvasxpress [command] <options>

    png ................ create a png file from an existing file or url
    svg ................ create a svg file from an existing file or url
    json ............... create a json file from an existing file or url
    csv ................ create a png file from a csv file in a file or url
    test ............... test package
    version ............ show package version    
    help ............... show help menu for a command
    `,
    
  csv: `
    --input, -i ........ <required> file or url with a csv file:
                         file:///path/to/local/file.csv
                         http://page/with/file.csv
                         https://page/with/file.csv
    --output, -o ....... [optional] directory path to save images
                         {default} './'
    --width, -x ........ [optional] integer for image width
    --height, -y ....... [optional] integer for image height
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    `,

  png: `
    --input, -i ........ <required> file or url with CanvasXpress visualizations:
                         file:///path/to/local/file.html
                         http://page/with/visualization.html
                         https://page/with/visualization.html
    --output, -o ....... [optional] directory path to save images
                         {default} './'
    --width, -x ........ [optional] integer for image width
    --height, -y ....... [optional] integer for image height
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    `,

  svg: `
    --input, -i ........ <required> file or url with CanvasXpress visualizations:
                         file:///path/to/local/file.html
                         http://page/with/visualization.html
                         https://page/with/visualization.html
    --output, -o ....... [optional] directory path to save images
                         {default} './'
    --width, -x ........ [optional] integer for image width
    --height, -y ....... [optional] integer for image height
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    `,
    
  json: `
    --input, -i ........ <required> file or url with CanvasXpress visualizations:
                         file:///path/to/local/file.html
                         http://page/with/visualization.html
                         https://page/with/visualization.html
    --output, -o ....... [optional] directory path to save images
                         {default} './'
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    `

}

module.exports = (args) => {
  
	const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
  
}