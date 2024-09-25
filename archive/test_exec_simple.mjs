try {

let result = os.exec( [ "/bin/sh", "-c", "base64 -d file" ] )

console.log(result);

}
catch( ex ) {

	print( ex)
	print( ex.stack)
}
