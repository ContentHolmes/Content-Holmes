function getImageName(str) {
	const regex = /\/\/.{1,3}\.([^\/]*)\.\w{1,4}\//g;
	var name = regex.exec(str);
	console.log(name[1]);
	return name[1];
}