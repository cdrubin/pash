try{

if ( typeof pash === 'undefined' )
  globalThis.pash = { version: '0.1' }

function templet( filename ) {

  let script = ''

  try {
  
    let file = std.open( filename, 'r' )
    if ( !file ) throw( `FileNotFound: '${ filename }' was not found` )

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
  	std.err.puts( `${ex}\n` ); if ( ex.stack ) std.err.puts( ex.stack )
  }
  
  return script
	
}
pash.templet = templet


const evalTemplet = async function ( filename ) {

  let script = templet( filename )

  try {
    await std.evalScript( script, { backtrace_barrier: false, async: true } )
  }
  catch( ex ) {
  	std.err.puts( `${ ex } (${ filename }${ ex.stack.match( ':[0-9]' )[0] })\n` )
  }	
}
pash.evalTemplet = evalTemplet


if ( scriptArgs[0].endsWith( 'templet.mjs' ) ) {
  let source

  if ( scriptArgs.length < 2 ) {
    std.err.puts( `
Usage: 

  qjs --std ${ scriptArgs[ 0 ] } [source] (--intermediate)
` )
    std.exit( 1 )
  }
  else {
    source = scriptArgs[ 1 ]
  }

  if ( scriptArgs.length > 2 && scriptArgs[2] == '--intermediate' )
    print( templet( source ) )
  else
    evalTemplet( source )
}
else if ( scriptArgs[0].endsWith( 'pash.mjs' ) ) {

  let source_dir, output_dir

  if ( scriptArgs.length < 3 ) {
	std.err.puts( `
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

  std.err.puts( `Unknown name 'scriptArgs[ 0 ]', try templet.mjs or pash.mjs` )	
}



}
catch( ex ) {
  std.err.puts( `${ex}\n` ); if ( ex.stack ) std.err.puts( ex.stack )
}
