$(document).ready(function() {
    chrome.storage.local.get('info', function(item) {
        // //console.log(item.info);
        if (!item.info) {
            // chrome.runtime.sendMessage({
            //     redirect: chrome.extension.getURL("/html/first.html")
            // });
            //console.log('empty');
            $(".loading3").css('display', 'none');
            $(".final_text").css('display', 'block');
            $("#NoLogin").css('display', 'block');
        } else {
            var childName = item.info.childName;
            $(".loading3").css('display', 'none');
            $(".final_text").css('display', 'block');
            $("#Login").css('display', 'block');
            $("#lt").text(childName);
        }
    });
    $("#nlb").click(function() {
        console.log('redirect');
        chrome.tabs.create({
            url: chrome.extension.getURL("/html/first.html")
        });
    });
});
