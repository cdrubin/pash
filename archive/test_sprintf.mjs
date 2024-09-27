try {

  let inpath = scriptArgs[1]
  let infile = std.open( inpath, 'r' )

  let outpath = scriptArgs[2]
  let outfile = std.open( outpath, 'w' )

  let str = ''
  for ( let i = 1; i <= 5; ++ i ) {
  	str += std.sprintf( "%d ", i )
  }
  print( str )

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

