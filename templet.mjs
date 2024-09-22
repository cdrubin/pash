try{

const templet = function( filename ) {

  let lines = std.loadFile( filename ).split( "\n" )

  let script = ""

  for ( let line of lines ) {
    //print( line )
    if ( line.startsWith( '|' ) ) {
  	  script += line.substring( 1 ) + "\n"
    }
    else if ( line != '' ) {
  	  script += 'print( `' + line.replace( '`', '\`' ) + '` )' + "\n"
    }
  }

  if ( scriptArgs.length > 2 && scriptArgs[2] == '--debug' ) {
    print( `${ script }---` )
  }
  
  return script
	
}

const evalTemplet = function ( filename ) {

  let script = templet( filename )

  std.evalScript( script, { async: true } )
  
}


let source

if ( scriptArgs.length < 2 ) {
  console.log( `
Usage: 

  qjs --std ${ scriptArgs[ 0 ] } [source] (--debug)
` )
  std.exit( 1 )
}
else {
  source = scriptArgs[ 1 ]
}


evalTemplet( source )

}
catch( ex ) {
  print( ex ); print( ex.stack )
}
