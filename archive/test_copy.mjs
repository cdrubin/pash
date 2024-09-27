try {

  let inpath = scriptArgs[1]
  let infile = std.open( inpath, 'r' )

  let outpath = scriptArgs[2]
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



/*
char buffer[SIZE];
size_t bytes;

while (0 < (bytes = fread(buffer, 1, sizeof(buffer), infile)))
    fwrite(buffer, 1, bytes, outfile);
*/

