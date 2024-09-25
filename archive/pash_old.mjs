/* global pash variable dictates behaviour */
globalThis.pash = { version: '0.1', copy: [ '.gif', '.ico', '.jpg', '.png', '.ttf', '.woff2' ], recursive: true, ignore: false }
globalThis.context = { template: null }

pash.goo = '=goo'
pash.shoe = function() {
  return '=shoe'
}

pash.templet = function( filename ) {

  let script = ''

  try {
  
    let file = std.open( filename, 'r' )
    if ( !file ) {
      throw( `'${filename}' not found` )
      //std.open( filename )
      //std.err.puts( `${filename} not found\n` )
      //std.err.puts( )
  	  //return
    }

    let lines = std.loadFile( filename ).split( "\n" )
  
    for ( let line of lines ) {
      if ( line.startsWith( '|' ) ) {
  	    script += line.substring( 1 ) + "\n"
      }
      else if ( line != '' ) {
  	    script += 'print( `' + line.replace( '`', '\`' ) + '` )' + "\n"
      }
    }

  }
  catch( ex ) {
  	std.err.puts( `${ex}\n` )
  	if ( ex.stack ) std.err.puts( ex.stack )
  }
  
  return script	
}


pash.evalTemplet = function ( filename ) {

  print( '[a]' )
  let script = pash.templet( filename )

  try {
    print( '[b]' )
    std.evalScript( script, { async: true } )
  }
  catch ( ex ) {
  	std.err.puts( `${ex}\n` )
  	std.err.puts( ex.stack )  	
  }
}


try {

// take in and out directories as parameters

/*

[ 
  { n: 'one.txt' }, 
  { n: 'seven.txt' }, 
  { n: 'two.txt' }, 
  { n: 'subdir', c: [ 
    { n: 'goo.txt' },
    { n: 'another', c: [
      { n: 'eight.txt' },
      { n: 'nine.txt' }	
    ] },
    { n: 'shoe', c: [
      { m: 'three.txt' },
      { n: 'zoo.txt' }
    ] } 
  ] } 
]


*/





const recursiveFileList = function ( path, level = 0 ) {
  let result = []
  let list = os.readdir( path )[0]

  //console.log( `path: ${path}` )

  for ( let item of list ) {
    if ( item != '.' && item != '..' ) {
      let stat = os.stat( path + '/' + item )[0]
      
      // if a directory
      if ( stat.mode & os.S_IFMT & os.S_IFDIR ) {
        //console.log( `${ '  '.repeat( level ) }${ item }/` )
      	result.push( { n: item, c: recursiveFileList( path + '/' + item, level + 1 ) } )
      }
      else {
        //console.log( `${ '  '.repeat( level ) }${ item }` )
      	result.push( { n: item } )
      }
    }
  }
  
  return result
}


const main = function() {

  let files = recursiveFileList( source_dir )
  console.log( JSON.stringify( files ) )
  
}


if ( scriptArgs[0].endsWith( 'pash.mjs' ) ) {

  let source_dir, output_dir

  if ( scriptArgs.length < 3 ) {
	console.log( `
Usage: 

  qjs --std ${ scriptArgs[ 0 ] } [source directory] [output directory] (temporary directory)
` )
	std.exit( 1 )
  }
  else {
	source_dir = scriptArgs[ 1 ]; output_dir = scriptArgs[ 2 ]
	std.puts( `${ source_dir } -> ${ output_dir }\n` )
  }

}
else {

  if ( typeof pash === 'object' ) {
  	pash.main = main; pash.recursiveFileList = recursiveFileList
  } 
}


}
catch( ex ) {
  console.log( ex ); console.log( ex.stack )
}







// recursively copy tree from source to output 



/*
let output = ''

const evaluateFile = function( filename ) {
  
}

const evaluateLine = function( string ) {
  
}
*/

//let it = 'variable contents'
//eval( `console.log( \`${it}\` )` )

/*
const templet = function( filename ) {

  let lines = std.loadFile( filename ).split( "\n" )

  let script = ""

  for ( let line of lines ) {
    //console.log( line )
    if ( line.startsWith( '|' ) ) {
  	  script += line.substring( 1 ) + "\n"
    }
    else {
  	  script += 'console.log( `' + line.replace( '`', '\`' ) + '` )' + "\n"
    }
  }

  //console.log( script )
  //console.log( '---')
  return script
	
}
*/

/*
const evalTemplet = function ( filename ) {

  let script = templet( filename )

  try {
    std.evalScript( script, { async: true } )
  }
  catch( ex ) {
    console.log( ex )
    console.log( ex.stack )
  }
  
}

evalTemplet( 'example.txt' )
*/

/*
let lines = std.loadFile( 'example.txt' ).split( "\n" )
//console.log( lines )

let script = ""

for ( let line of lines ) {
  //console.log( line )
  if ( line.startsWith( '|' ) ) {
  	script += line.substring( 1 ) + "\n"
  }
  else {
  	script += 'console.log( `' + line.replace( '`', '\`' ) + '` )' + "\n"
  }
}

console.log( script )
console.log( '---')

try {
  std.evalScript( script, { async: true } )
}
catch( ex ) {
  console.log( ex )
  console.log( ex.stack )
}
*/
/*
console.log( "\n")

let func = function( param ) {
  console.log( `func was called with: ${ JSON.stringify( param ) }` )
}

let env = globalThis

globalThis = {}
//globalThis = env

globalThis.gunc = env.func

gunc( 'zoo' )

//console.log( JSON.stringify( globalThis ) )
*/
