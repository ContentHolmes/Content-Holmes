function getName(str) {
	const regex = /\/\/w{0,3}\.?(.*)\.\w{1,4}\/.*/gi;
	str = str +"/";
	var name = regex.exec(str);
	console.log(name[1]);
	return name[1];
}

getName("http://www.google.com");