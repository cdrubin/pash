

if ( typeof moo !== 'undefined' ) {
  print( moo )
}
else {
  print( 'moo not defined' )
}


if ( globalThis.moo ) {
  print( globalThis.moo )
}
else {
  print( 'globalThis.moo not defined' )
}

if ( globalThis.it ) {
  print( globalThis.it )
}
else {
  print( 'globalThis.it not defined' )
}
