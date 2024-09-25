try {
  print( '[1]' )

  let ofile = std.open( 'output.txt', 'w' )
  
  os.exec( [ './qjs', '--std', '-I', 'pash.mjs', 'templet.mjs', 'examples/numbers.txt' ], { stdout: ofile.fileno() } )
  ofile.close()
  
  print( '[2]' )
}
catch ( ex ) {
  print( ex )
  print( ex.stack )
}
