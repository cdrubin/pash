try{

global.it = "help"


std.loadScript( 'display_moo.mjs' )

let oldGT = globalThis

globalThis = { moo: "Moo", std: std, os: os, scriptArgs: scriptArgs, print: print }

std.loadScript( 'display_moo.mjs' )

globalThis = { moo: "Goo", std: std, os: os, scriptArgs: scriptArgs }

std.loadScript( 'display_moo.mjs' )


}
catch ( ex ) {
  print( ex )
  print( ex.stack )
}
