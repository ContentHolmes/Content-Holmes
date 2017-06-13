$(document).ready(function() {
    // console.log('ready');
    chrome.storage.local.get(['settings', 'global'], function(items) {
        var interests = items.global.interests;
        if (interests.length >= 3) {
            var int1 = interests[interests.length - 1].trim().replace(" ", "+");
            var int2 = interests[interests.length - 2].trim().replace(" ", "+");
            var int3 = interests[interests.length - 3].trim().replace(" ", "+");
            setTimeout(function() {
                // console.log('ya');
                chrome.runtime.sendMessage({
                    type: "redirect",
                    redirect: chrome.extension.getURL("/html/newInterestPage.html")
                });
            }, 2000);
        } else {
            setTimeout(function() {
                // console.log('ya');
                window.location = "https://www.google.co.in";
            }, 2000);
        }
    });
});
