var abc = require('./test.js');

$(document).ready(function() {
    console.log('ready');
    console.log(abc.sayHelloInEnglish);
    setTimeout(function() {
        console.log('ya');
        window.location = "https://www.google.co.in";
    }, 5000);
});
