

/*
let output = ''

const evaluateFile = function( filename ) {
  
}

const evaluateLine = function( string ) {
  
}
*/

let it = 'variable contents'
eval( `console.log( \`${it}\` )` )


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
