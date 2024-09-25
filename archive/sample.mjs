try {

String.prototype.CSVdecode = function() { 
	var source = this; 
	var result =''; 
	var na=[];  
	var x=0; 
	var arr = source.split(/\r\n/g); 
	source=''; 
	arr.forEach(function(a){ 
		na=na.concat(a.split(','));
	}); 
	arr=[]; 
	na.reverse(); 
	result = na.join(''); 
	
	return result; 
}

const csv_data = std.loadFile("data.csv");	

const base64Encoded = csv_data.substr(parseInt(30)).CSVdecode();

const pipe = os.pipe();
// this is where data will be saved after being decoded
const outputFile = std.open('vid_chunk.ts', 'w');

// decode data
const pid = os.exec(['base64', '-d'], {
  // redirect output to previously opened file
  stdout: outputFile.fileno(),
  stdin: pipe[0],
  block: false,
});
os.close(pipe[0]);

// provide input to previous process
const processInput = std.fdopen(pipe[1], 'w');
processInput.puts(base64Encoded);
processInput.close();
os.waitpid(pid, 0);

outputFile.close();

}
catch(ex) {
	print( ex )
	print( ex.stack)
}
