var fs = require('fs');

try {
	fs.mkdirSync(__dirname + "/build/dev");
	fs.mkdirSync(__dirname + "/build/prod");
	console.log("Directories constructed...");
} catch (err) {
	console.log("Directories already exist...");
}