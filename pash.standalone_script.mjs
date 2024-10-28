try{

await import( './marked.esm.js' )

//import { marked } from './marked.esm.js'

if ( typeof std === 'undefined' ) throw ( `StdRequired: was qjs invoked with the '--std' flag?`)

if ( typeof pash === 'undefined' ) {
  globalThis.pash = { 
    contextfile: [ '_pash.mjs' ],
    copy: [ '\.gif$', '\.ico$', '\.js$', '\.jpg$', '\.mjs$', '\.png$', '\.ttf$', '\.woff2$' ], 
    ignoredirs: [ '^[._]' ],
    ignorefiles: [ '^[._]' ], 
    output( value) { print( value ) },  // override in file_callback
    skip: false,  // while this is true files are not processed at all
    version: '0.1',
  } 
  globalThis.context = { 
    template: null
  }
  //globalThis.include = function( filename ) { await evalScript( pash.)}
}



const intermediateTemplet = function( string ) {

  let script = ''

  try {
    for ( let line of string.split( '\n' ) ) {
      if ( line.startsWith( '|' ) ) {
  	    script += line.substring( 1 ) + '\n'
      }
      else {
      //else if ( line != '' ) {
  	    script += 'pash.output( `' + line.replace( '`', '\`' ) + '` )' + '\n'
      }
    }
  }
  catch( ex ) {
  	std.err.puts( `${ex}\n` ); if ( ex.stack ) std.err.puts( ex.stack )
  }
  
  return script
  
}
pash.intermediateTemplet = intermediateTemplet


const templet = function ( filename ) {

  let script = ''

  try {
  
    let file = std.open( filename, 'r' )
    if ( !file ) throw( `FileNotFound: '${ filename }' was not found` )

    const string = std.loadFile( filename )

    script = intermediateTemplet( string.slice( 0, -1 ) )

  }
  catch( ex ) {
  	std.err.puts( `${ex}\n` ); if ( ex.stack ) std.err.puts( ex.stack )
  }
  
  return script
	
}
pash.templet = templet


const evalTemplet = function ( filename ) {

  try {

    let script = templet( filename )

    std.evalScript( script, { backtrace_barrier: false } )

  }
  catch( ex ) {
  	std.err.puts( `${ ex } (${ filename })\n` ); std.err.puts( ex.stack )
  }	
}
pash.evalTemplet = evalTemplet


const copyFile = function( inpath, outpath ) {

  try {

    let infile = std.open( inpath, 'r' )
    let outfile = std.open( outpath, 'w' )

    const size = 1024 * 1024

    let buffer = new ArrayBuffer( size )
    let bytes

    while ( 0 < ( bytes = infile.read( buffer, 0, size ) ) )
      outfile.write( buffer, 0, bytes )

    infile.close()
    outfile.close()
  }
  catch ( ex ) {
    print( ex ); print( ex.stack )
  }
}
pash.copyFile = copyFile


    



const dir_callback = function( path, level ) {
  let directoryname = path.split( '/' ).at( -1 )

  let contextscript = ''

  if ( contextscript = std.loadFile( path + '/' + pash.contextfile ) ) {
    std.evalScript( contextscript ); std.out.puts( `  (pash.contextfile '${ pash.contextfile }' found, evaluated)` )
  }

  std.out.puts( '\n' )
}




const file_callback = function( inpath, outpath ) {
  try {
  
    let content = ''

    pash.output = function( value ) { content += value + '\n' }

    evalTemplet( inpath )

    if ( inpath.endsWith( '.md' ) ) {
      outpath = outpath.slice( 0, -3 ) + '.html'
      pash.content = marked.parse( content.slice( 0, -1 ) )
    }  
    else { 
      pash.content = content.slice( 0, -1 )
    }

        
    if ( context.template ) {
      content = ''
      evalTemplet( pash.inpath + '/' + context.template )
      pash.content = content
    }
    
    let outfile = std.open( outpath, 'w' )
    outfile.puts( pash.content )
    outfile.close()

  }
  catch( ex ) {
  	std.err.puts( `${ ex } (${ inpath })\n` ); std.err.puts( ex.stack )
  }	
}



const recurseTree = function ( inpath, outpath, file_callback, dir_callback, level = 0 ) {
  let result = []
  
  let directoryname = inpath.split( '/' ).at( -1 )
  std.out.puts( '  '.repeat( level ) + directoryname + '/' )

  if ( pash.skip ) { std.out.puts( `  (pash.skip is true, skipped)\n` ); return } 
  for ( let pattern of pash.ignoredirs ) if ( new RegExp( pattern ).test( directoryname ) ) { std.out.puts( `  (pash.ignoredirs[ '${ pattern }' ] matched, ignored)\n` ); return }

  os.mkdir( outpath )
  dir_callback( inpath, level )
  
  let list = os.readdir( inpath )[0]

  itemloop: for ( let item of list ) {
    
    if ( item != '.' && item != '..' ) {
      let stat = os.stat( inpath + '/' + item )[0]
      
      // if a directory
      if ( stat.mode & os.S_IFMT & os.S_IFDIR ) {
        let savedPash = { ...pash }; let savedContext = { ...context }
                        
      	result.push( { n: item, c: recurseTree( inpath + '/' + item, outpath + '/' + item, file_callback, dir_callback, level + 1 ) } )

      	pash = savedPash; context = savedContext
      }
      else {
        std.out.puts( '  '.repeat( level + 1 ) + item )

        if ( pash.skip ) { 
          std.out.puts( `  (pash.skip is true, skipped)\n` )
          continue itemloop
        } 
        
        for ( let pattern of pash.ignorefiles ) 
          if ( new RegExp( pattern ).test( item ) ) { 
            std.out.puts( `  (pash.ignorefiles[ '${ pattern }' ] matched, ignored)\n` )
            continue itemloop 
          }

        for ( let pattern of pash.copy ) 
          if ( new RegExp( pattern ).test( item ) ) {
			copyFile( inpath + '/' + item, outpath + '/' + item )
            std.out.puts( `  (pash.copy[ '${ pattern }' ] matched, copied)\n` )
            continue itemloop
          }

        file_callback( inpath + '/' + item, outpath + '/' + item )
        std.out.puts( '\n' )
        
      	result.push( { n: item } )
      }
    }
  }
  
  return result
}





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

  if ( scriptArgs.length > 2 && scriptArgs[2] == '--intermediate' ) {
    std.out.puts( templet( source ) )
  }
  else {
    evalTemplet( source )
  }
}
else if ( scriptArgs[0].endsWith( 'pash.mjs' ) ) {

  let inpath, outpath

  if ( scriptArgs.length < 3 ) {
	std.err.puts( `
Usage: 

  qjs --std ${ scriptArgs[ 0 ] } [source directory] [output directory] (temporary directory)
` )
	std.exit( 1 )
  }
  else {
	inpath = scriptArgs[ 1 ]; outpath = scriptArgs[ 2 ]
	std.out.puts( `${ inpath } -> ${ outpath }\n` )

    pash.inpath = inpath
    pash.outpath = outpath
    
    let tree = recurseTree( inpath, outpath, file_callback, dir_callback ) 
  }

}
else {

  print( `Unknown name 'scriptArgs[ 0 ]', try templet.mjs or pash.mjs` )	
}



}
catch( ex ) {
  print( `${ex}\n` ); if ( ex.stack ) std.err.puts( ex.stack )
}
