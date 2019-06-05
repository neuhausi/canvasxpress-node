const menus = {
		
  main: `
    canvasxpress [command] <options>

    png ................ create a png file from an existing CanvasXpress file or url
    svg ................ create a svg file from an existing CanvasXpress file or url
    json ............... create a json file from an existing CanvasXpress file or url
    csv ................ create a CanvasXpress png file from a local csv file or url
    reproduce .......... create CanvasXpress png files from a local file or url
    canvas ............. run scripts files to test CanvasXpres
    test ............... test package. Creates images and json file in test directory
    version ............ show this package version    
    help ............... show this help. Add command to show correponding help
    `,
  
  canvas: `
    --input, -i ........ <required> path/to/js/file
    --skip, -s ......... [optional] skip download
    --graph, -g ........ [optional] graph name
    --number, -n ....... [optional] number for the graph
    --timeout, -t ...... [optional] timeout in millisecods to close browser
                         {default} 500
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    
    Examples:

      canvasxpress canvas -i canvas/scripts/compareImages.js -s

      canvasxpress canvas -i canvas/scripts/compareImages.js -s -g violin -n 11
  `,
    
  csv: `
    --input, -i ........ <required> file or url with a csv file:
                         file:///path/to/local/file.csv
                         http://page/with/file.csv
                         https://page/with/file.csv
    --output, -o ....... [optional] directory path to save image
                         {default} './'
    --width, -x ........ [optional] integer for image width
                         {default} 800
    --height, -y ....... [optional] integer for image height
                         {default} 800
    --config, -c ....... [optional] json string with configuration for CanvasXpress
    --timeout, -t ...... [optional] timeout in millisecods to close browser
                         {default} 500
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    
    Examples:

      canvasxpress csv -i ../src/ToothGrowth.csv -t 3000

      canvasxpress csv -i https://raw.githubusercontent.com/neuhausi/Rdatasets/master/csv/datasets/ToothGrowth.csv
        -t 3000
    
      canvasxpress csv -i file:///node/src/ToothGrownth.csv -c '{"graphType":"Boxplot","transposeData":true,
        "asVariableFactors":["dose"],"stringSampleFactors":["dose"],"groupingFactors":["dose"]}'
        -t 3000
    `,

  reproduce: `
    --input, -i ........ <required> file or url with a html file:
                         file:///path/to/local/file.html
                         http://page/with/file.html
                         https://page/with/file.html
    --output, -o ....... [optional] directory path to save image
                         {default} './'
    --timeout, -t ...... [optional] timeout in millisecods to close browser
                         {default} 500
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    
    Examples:

      canvasxpress reproduce -i https://canvasxpress.org/html/layout-7.html
    
      canvasxpress reproduce -i file:///node/src/canvasXpress.html

      canvasxpress reproduce -i ../src/canvasXpress.html
    `,

  png: `
    --input, -i ........ <required> file or url with a html file:
                         file:///path/to/local/file.html
                         http://page/with/file.html
                         https://page/with/file.html
    --output, -o ....... [optional] directory path to save image
                         {default} './'
    --timeout, -t ...... [optional] timeout in millisecods to close browser
                         {default} 500
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    
    Examples:

      canvasxpress png -i https://canvasxpress.org/html/bar-3.html
    
      canvasxpress png -i file:///node/src/canvasXpress.html

      canvasxpress png -i ../src/canvasXpress.html
    `,

  svg: `
    --input, -i ........ <required> file or url with a html file:
                         file:///path/to/local/file.html
                         http://page/with/file.html
                         https://page/with/file.html
    --output, -o ....... [optional] directory path to save image
                         {default} './'
    --timeout, -t ...... [optional] timeout in millisecods to close browser
                         {default} 500
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    
    Examples:

      canvasxpress svg -i https://canvasxpress.org/html/bar-3.html
    
      canvasxpress svg -i file:///node/src/canvasXpress.html

      canvasxpress svg -i ../src/canvasXpress.html
    `,
    
  json: `
    --input, -i ........ <required> file or url with a html file:
                         file:///path/to/local/file.html
                         http://page/with/file.html
                         https://page/with/file.html
    --output, -o ....... [optional] directory path to save image
                         {default} './'
    --timeout, -t ...... [optional] timeout in millisecods to close browser
                         {default} 500
    --debug, -d ........ [optional] boolean to do not run headless and pause for debugging
    
    Examples:

      canvasxpress json -i https://canvasxpress.org/html/bar-3.html
    
      canvasxpress json -i file:///node/src/canvasXpress.html

      canvasxpress json -i ../src/canvasXpress.html
    `

}

module.exports = (args) => {
  
	const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
  
}