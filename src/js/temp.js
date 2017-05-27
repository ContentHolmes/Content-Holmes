var md5 = require('md5');
var lfu = require('lfu-cache')(10, 60*60*24*5);

function set(url) {
	lfu.set(md5(url),{url: url});
}

function get(url) {
	return lfu.get(md5(url));
}