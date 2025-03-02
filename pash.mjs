try {

const marked = await import( './marked.esm.js' )
const markedHighlight = await import( './marked-highlight.esm.js' )
const markedKatexExtension = await import( './marked-katex-extension.esm.js' )
const { Base64 } = await import( './chromium-base64.js' )

globalThis.pash = {
  // transformation settings
  contextfilename: '_context.mjs',
  copyextensions: [ '\.gif$', '\.ico$', '\.js$', '\.jpg$', '\.mjs$', '\.png$', '\.ttf$', '\.woff2$' ],
  ignoredirs: [ '^[._]' ],
  ignorefiles: [ '^[._\[]' ], 
  output( string ) { print( string ) },  // override in file_callback
  skip: false,  // while this is true files are not processed at all
  templet: true,  // while this is true files are evaluated as templets

  // generation constants
  ansi: { bold: '\x1b[1m', dim: '\x1b[2m', eol: '\x1b[1000C', italics: '\x1b[3m', reset: '\x1b[0m', reverse: '\x1b[7m', underline:'\x1b[4m' },
  intermediatedir: '/tmp/pash/intermediate',
  markdowndir: '/tmp/pash/markdown',
  stacktrace: 'brief',  // false, 'brief', 'full'
  version: '0.1',

  // available values
  filename: 'the name of the current file being processed',
  path: 'the path of the current file being processed',
  root: 'a relative path to the base of the output directory'  
} 
globalThis.context = { 
  layout: null
}


function intermediateTemplet( string ) {

  let script = ''

  try {
    for ( let line of string.split( '\n' ) ) {
      if ( line.startsWith( '|' ) ) {
  	    script += line.substring( 1 ) + '\n'
      }
      else {
  	    script += 'pash.output( `' + line.replace( '`', '\`' ) + '` )' + '\n'
      }
    }
	script = script.slice( 0, -1 )
    
  }
  catch( ex ) {
  	std.err.puts( `× ${ex}\n` ); if ( ex.stack ) std.err.puts( ex.stack )
  }
  
  return script
  
}
pash.intermediateTemplet = intermediateTemplet


function intermediateTempletFile( filename ) {

  let script = ''
  let tmpfilename = pash.intermediatedir + '/' + Math.random().toString().slice( 2 ) + '.mjs'

  //std.err.puts( `tmpfilename: ${tmpfilename}` )
  
  try {
  
    let file = std.open( filename, 'r' )
    if ( !file ) throw( `FileNotFound: '${ filename }'` )

    let string = std.loadFile( filename )
       
    if ( string.endsWith( '\n' ) )
	  string = string.slice( 0, -1 )

    script = pash.intermediateTemplet( string )

	// write intermediate file to tmpdir
	//let tmpfilename = pash.tmpdir + '/' + Math.random + '.mjs'
    let tmpfile = std.open( tmpfilename, 'w' )
    tmpfile.puts( script )
	tmpfile.close()
    //std.err.puts( script )

  }
  catch( ex ) {
  	std.err.puts( `× ${ex}\n` ); if ( ex.stack ) std.err.puts( ex.stack )
  }

  //return script
  return tmpfilename
	
}
pash.intermediateTempletFile = intermediateTempletFile


function evalTemplet( filename ) {

  let loaded_content = ''
  let script_filename = ''
  try {

    script_filename = pash.intermediateTempletFile( filename )
    std.loadScript( script_filename )

    //loaded_content = std.loadFile( script_filename )
    //std.evalScript( loaded_content )

    //std.out.puts( script )
    //std.evalScript( script, { backtrace_barrier: false } )

  }
  catch( e ) {

    std.err.puts( formatError( e, { filename: filename } ) )
  
/*    let stack = ex.stack.split( '\n' ) 
    let top_stack_line = stack[0]
    //let loaded_content_lines = loaded_content.split( '\n' )
    let line_number = top_stack_line.slice( top_stack_line.lastIndexOf( ':' ) + 1 ).replace( ')', '' ) //ex.stack.slice( 0, 10 )
    let original_line = getLine( filename, line_number ) //std.loadFile()
    let intermediate_line = getLine( script_filename, line_number )
    //loaded_content_lines[ line_number - 1 ]
    if ( os.isatty( std.err ) ) {
      std.err.puts( `${pash.ansi.bold}` )
    }
  	std.err.puts( `× ${ ex } (${ filename }:${ line_number })\n` )
	if ( os.isatty( std.err ) )
      std.err.puts( `  ${ line_number }: ${pash.ansi.dim}${pash.ansi.reverse}${ original_line }${pash.ansi.reset}${pash.ansi.bold}\n` )
    else
  	  std.err.puts( `  ${ line_number }: ${ original_line }\n` )
    if ( pash.stacktrace ) std.err.puts( ex.stack )
    std.err.puts( '\n' )
    if ( os.isatty( std.err ) ) {
      std.err.puts( `${pash.ansi.reset}` )
    }
    
    //std.err.puts( `  ${ top_stack_line.slice( 14 ) } \n\n` )
  	//std.err.puts( `  ${ script_filename }:${line_number}: ${intermediate_line}\n` )
  	*/
  }	
}
pash.evalTemplet = evalTemplet


function includeVerbatim( filename ) {

  let included_content = ''

  let previous_output_function = pash.output

  included_content = std.loadFile( inpath + '/' + filename )

  if ( included_content.endsWith( '\n' ) ) included_content = included_content.slice( 0, -1 )
  
  return included_content
}
pash.includeVerbatim = includeVerbatim


function includeTemplet( filename ) {

  //std.err.puts( '1' )
  let included_content = ''

  let previous_output_function = pash.output
  //std.err.puts( ')))' )
  //std.err.puts( pash.output )

  // override output function temporarily
  pash.output = function( value ) { included_content += value + '\n' }
  //std.err.puts( '(((' )
  //std.err.puts( pash.output )

  //std.err.puts( '2' )

  //let loaded_content = std.loadFile( inpath + '/' + filename )
  //std.evalScript( loaded_content )

  pash.evalTemplet( pash.inpath + '/' + filename )
  //std.err.puts( '3' )
  
  pash.output = previous_output_function

  if ( included_content.endsWith( '\n' ) ) included_content = included_content.slice( 0, -1 )
  
  return included_content
}
pash.includeTemplet = includeTemplet


function formatError( error, details ) {

  //let name = ex.name
  //let message = error.message
  let stack = error.stack.split( '\n' )

  let result = ''

  //std.err.puts( error.stack )

  //std.err.puts( `error.name: ${error.name}\n` )
  //std.err.puts( `error.message: ${error.message}\n` )
  //std.err.puts( `error.fileName: ${error.fileName}\n` )
  //std.err.puts( `error.lineNumber: ${error.lineNumber}\n` )

  //std.err.puts( JSON.encode( error ) )//`%%%% ${ error.message }` )

//  let filename = error.cause.slice( error.cause.indexOf( '(' ), -1 )

  let top_line = stack[0]

  let line_number = top_line.slice( top_line.lastIndexOf( ':' ) + 1 ).replace( ')', '' )
  
  let original_line = getLine( details.filename, line_number ) //std.loadFile()

  let brief_lines = []

  for ( let line of stack ) {
    if ( !line.includes( 'native' ) && !line.includes( '/zip' ) ) {
      brief_lines.push( line.slice( 2 ) )
      //brief_lines.push( line.slice( line.indexOf( '(' ) + 1, -1 ) )
    }
  }

  if ( os.isatty( std.err ) ) {
    //result += `${pash.ansi.bold}`
    result += `× ${pash.ansi.bold}${pash.ansi.underline}${ error.name }${pash.ansi.reset} (${pash.ansi.bold}${ details.filename }${pash.ansi.reset}:${ line_number })\n`
  }
  else {
    result += `× ${ error.name } (${ details.filename }:${ line_number })\n`
  }
  
  //result += `× ${ error.name } (${ details.filename }:${ line_number })\n`

  if ( os.isatty( std.err ) )
    result += `  ${ line_number }: ${pash.ansi.dim}${pash.ansi.reverse}${ original_line }${pash.ansi.reset}\n`
  else
  	result += `  ${ line_number }: ${ original_line }\n`

  if ( pash.stacktrace ) {  	
    if ( pash.stacktrace == 'brief' ) 
      result += brief_lines.join( '\n' )
    else
      result += error.stack
  }

  if ( os.isatty( std.err ) ) {
    result += `${pash.ansi.reset}`
  }

  result += '\n'
  
  return result

}


function isDirectory( path ) {
  //print( `isDirectory: ${ path }` )
  let stat = os.stat( path )[0]
  //print( JSON.stringify( stat ) )
  if ( stat )
    return stat.mode & os.S_IFMT & os.S_IFDIR
  else
  	return false   
}
pash.isDirectory = isDirectory


function getLine( path, number = 0 ) {
  //std.err.puts( `path: ${path}` )
  let file = null
  try {
    let file = std.open( path, 'r' )
    let line_number = 0
    let line = ''
    //std.err.puts( `number: ${number}, line_number: ${line_number}` )
    while ( line_number < number ) {
      line = file.getline()
      //std.err.puts( `${line_number}: ${line}` )
      line_number += 1
    }
    
    return line
  }
  catch ( ex ) {
    print( ex ); print( ex.stack )
  }
  finally {
  	if ( file ) file.close()
  }
}
pash.getLine = getLine


function recursiveMkdir( path, mode = 0o777 ) {
  try {

	//print( `recur: ${path}` )
    let parts = path.split( '/' )
    //print( `parts length: ${ parts.length}` )
	for ( let i = 2; i < parts.length + 1; ++i ) {
	  let subpath = parts.slice( 0, i ).join( '/' )
	  //print( `subpath: ${subpath}`)
	  if ( !isDirectory( subpath ) ) {
	  	os.mkdir( subpath, mode )
	  }
	}
  	
  }
  catch ( ex ) {
    print( ex ); print( ex.stack )
  }
}
pash.recursiveMkdir = recursiveMkdir


function copyFile( inpath, outpath ) {

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

  if ( contextscript = std.loadFile( path + '/' + pash.contextfilename ) ) {
    std.evalScript( contextscript ); std.out.puts( `  (pash.contextfilename '${ pash.contextfilename }' found, evaluated)` )
  }

  std.out.puts( '\n' )
}



const reference_style_images_to_files = function( inpath, outpath, content ) {
  try {

	let modified_lines = []

	// assume outpath ends in '.html'
	let images_outpath_root = outpath.slice( 0, outpath.lastIndexOf( '/' ) ) + outpath.slice( outpath.lastIndexOf( '/' ) ).replaceAll( ' ', '_' ).slice( 0, -5 ) + '_image'

 	let images = []

    const regex = /^\[image(\d+)\]: <data:image\/(.*);base64,(.*)>/

    let lines = content.split( '\n' )
    for ( let line of lines ) {
      if ( line.startsWith( '[image' ) ) {
      
      	let captures = line.match( regex )
		if ( captures ) {
      	
      	  let number = captures[ 1 ]; let extension = captures[ 2 ]; let base64 = captures[ 3 ]
      	  let image_path = images_outpath_root + '_' + number + '.' + extension
      	  let image_name = image_path.slice( image_path.lastIndexOf( '/' ) + 1 )
      	  images[ number ] = image_name

		  // base64 to bytes
		  let array = new Base64().base64ToBytes( base64 )
      	  const byteArray = new Uint8Array( array )
	      let image_file = std.open( image_path, 'w' )
	      image_file.write( byteArray.buffer, 0, byteArray.length )
	    }
	    else {
      	  modified_lines.push( line )
	    }
	    
      }
      else {
      	modified_lines.push( line )
      }
    }

	let modified_content = ''

    for ( let line of modified_lines ) {
      modified_content += line.replace( /!\[(.*)\]\[image(\d+)\]/g, function( match, alt, number ) {
		return `![${ alt }](${ images[ number ] })`
      } ) + '\n'
    }

	return modified_content.slice( 0, -1 )
	
  }	
  catch( ex ) {
  	std.err.puts( `× ${ ex } (${ inpath })\n` ); std.err.puts( ex.stack )  	
  }
}


const file_callback = function( inpath, outpath ) {
  try {
  
    let content = ''

	// string output for eval functions
    pash.output = function( value ) { content += value + '\n' }

    if ( pash.templet )
    	pash.evalTemplet( inpath )
    else
    	content = std.loadFile( inpath )

    if ( inpath.endsWith( '.md' ) ) {
      outpath = outpath.slice( 0, -3 ) + '.html'
      
      content = reference_style_images_to_files( inpath, outpath, content )

	  let tmpfilename = pash.markdowndir + '/' + Math.random().toString().slice( 2 ) + '.md'
      let tmpfile = std.open( tmpfilename, 'w' )
      tmpfile.puts( content )
	  tmpfile.close()


      const marked = new Marked(
  markedHighlight({
	emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);
	  
      pash.content = marked.parse( content )


      
    }  
    else { 
      pash.content = content.slice( 0, -1 )
    }

        
    if ( context.layout ) {
      content = ''
      pash.evalTemplet( pash.inpath + '/' + context.layout )
      pash.content = content
    }
    
    let outfile = std.open( outpath, 'w' )
    outfile.puts( pash.content )
    outfile.close()

  }
  catch( ex ) {
  	std.err.puts( `× ${ ex } (${ inpath })\n` ); std.err.puts( ex.stack )
  }	
}



const recurseTree = function ( inpath, outpath, file_callback, dir_callback, level = 1 ) {
  let result = []

  pash.root = '../'.repeat( level - 1 )
  
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

        if ( pash.skip ) { 
          std.out.puts( '  '.repeat( level + 1 ) + item + `  (pash.skip is true, skipped)\n` )
          continue itemloop
        } 
        
        for ( let pattern of pash.ignorefiles ) 
          if ( new RegExp( pattern ).test( item ) ) { 
            std.out.puts( '  '.repeat( level + 1 ) + item + `  (pash.ignorefiles[ '${ pattern }' ] matched, ignored)\n` )
            continue itemloop 
          }

        for ( let pattern of pash.copyextensions ) 
          if ( new RegExp( pattern ).test( item ) ) {
			pash.copyFile( inpath + '/' + item, outpath + '/' + item )
            std.out.puts( '  '.repeat( level + 1 ) + item + `  (pash.copyextensions[ '${ pattern }' ] matched, copied)\n` )
            continue itemloop
          }

        let fileSavedPash = { ...pash }; let fileSavedContext = { ...context }

		std.out.puts( '  '.repeat( level + 1 ) + item )
		if ( pash.templet == false ) 
		  std.out.puts( '  (pash.templet is false, verbatim content)' )
		std.out.puts( '\n' ); std.out.flush()

		pash.filename = item//'pash filename' // = 'goodie' //#### pass the current filename so it can be placed in title if desired
        pash.path = inpath
        
        file_callback( inpath + '/' + item, outpath + '/' + item )

        pash = fileSavedPash; context = fileSavedContext
                
      	result.push( { n: item } )
      }
    }
  }
  
  return result
}


  //let line = getLine( 'README.md', 1 )
  //std.err.puts( line )
  //std.exit(10)

  //std.err.puts( `${pash.ansi.italics}low${pash.ansi.bold}video${pash.ansi.reset}` )
  //std.exit( 12 )

  let inpath, outpath

  if ( scriptArgs.length < 2 ) {
	std.err.puts( `
Usage: 

  ./pash [source directory] [output directory]
  
` )
	std.exit( 1 )
  }
  else {
	inpath = scriptArgs[ 0 ]; outpath = scriptArgs[ 1 ]
	if ( inpath.endsWith( '/' ) ) inpath = inpath.slice( 0, -1 )
	if ( outpath.endsWith( '/' ) ) outpath = outpath.slice( 0, -1 )

	//os.mkdir( pash.tmpdir )
	//print( 0 )
	recursiveMkdir( pash.intermediatedir )
   // print( 1 )
	recursiveMkdir( pash.markdowndir )
	//print( 2 )
	//exit

	std.out.puts( `${ inpath } -> ${ outpath }\n` )

    pash.inpath = inpath
    pash.outpath = outpath
    
    let tree = recurseTree( inpath, outpath, file_callback, dir_callback )
  }


}
catch( ex ) {
  print( `× ${ex}\n` ); if ( ex.stack ) std.err.puts( ex.stack )
}
