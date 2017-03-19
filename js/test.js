function getUrlVars(href) {
    var vars = [],
        hash;
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    var hashes = href.slice(href.indexOf('#') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

console.log(getUrlVars('https://www.google.co.in/search?q=Hey+you%2C+how+are+you%3F&rlz=1C1CHZL_enIN700IN700&oq=Hey+you%2C+how+are+you%3F&aqs=chrome..69i57.4291j0j1&sourceid=chrome&ie=UTF-8'));
console.log(getUrlVars('https://www.youtube.com/results?search_query=batman+the+brave+and+the+bold+saves+jl'));
console.log(getUrlVars('https://www.google.co.in/search?q=Ahem+Ahem&rlz=1C1CHZL_enIN700IN700&oq=Ahem+Ahem&aqs=chrome..69i57.2490j0j1&sourceid=chrome&ie=UTF-8#dobs=ahem'));
console.log(getUrlVars('https://www.google.co.in/#q=Yp+brp&*'));