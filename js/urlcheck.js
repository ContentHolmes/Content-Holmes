words = ["porn", "sex"];

function urlcheck(url) {
	var params = getUrlVars(url);
	if(params.q != null) {
		return paramscheck(params.q);
	} else if(params.search_query!=null){
		return paramscheck(params.search_query);
	} else {
		return 0;
	}
}

function paramscheck(params) {
	count = 0.0;
	bad = 0.0;
	for(i=0;i< words.length;i++) {
		if(params.includes(words[i])) {
			bad++;
		}
	}
	if(params.includes("+")) {
		count = params.split("+").length;
	} else {
		count = params.split("%").length;
	}
	return bad/count;
}

function getUrlVars(href)
{
    var vars = [], hash;
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

console.log(urlcheck("https://www.youtube.com/results?search_query=AAnother+search"));
console.log(urlcheck("https://www.google.co.in/search?q=porn&rlz=1C1CHZL_enIN700IN700&oq=porn&aqs=chrome.0.69i59j69i60l3j69i59l2.2057j0j4&sourceid=chrome&ie=UTF-8#q=porn+and+sex"));
console.log(urlcheck("https://www.google.co.in/search?q=shit+bro+sex&rlz=1C1CHZL_enIN700IN700&oq=shit+bro+sex&aqs=chrome..69i57.4549j0j9&sourceid=chrome&ie=UTF-8"));
console.log(urlcheck("http://www.bing.com/search?q=Hey+how+are+you+my+friend%3F&qs=n&form=QBLH&sp=-1&pq=hey+how+are+you+my+friend&sc=0-25&sk=&cvid=7E1D4074F69C45D781A157BAA3C3FC23"));
console.log(urlcheck("https://www.youtube.com/results?search_query=What+is+up"));
console.log(urlcheck("https://github.com/rajatjain1997/Content-Rectifier-II"));
console.log(urlcheck("https://www.google.com/search?site=&tbm=isch&source=hp&biw=1366&bih=662&q=Hey+hi&oq=Hey+hi&gs_l=img.3..0l10.1060.2748.0.3014.7.7.0.0.0.0.174.319.0j2.2.0....0...1ac.1.64.img..5.2.319.0.BqANwFQUI_Y"));
console.log(urlcheck("https://www.google.com/search?site=&tbm=isch&source=hp&biw=1366&bih=662&q=Hey+hi&oq=Hey+hi&gs_l=img.3..0l10.1060.2748.0.3014.7.7.0.0.0.0.174.319.0j2.2.0....0...1ac.1.64.img..5.2.319.0.BqANwFQUI_Y#tbm=isch&q=Hey+hi+porn"));