var currentVersion = '1.0';
var extensions = {};

chrome.storage.local.get(['global'], function(items) {
        var global = items.global || {};
        if(global.extensions) {
            extensions = global.extensions;
        }
    });

function updateExts() {
    chrome.storage.local.get(['global'], function(items) {
        var global = items.global || {};
        global.extensions=extensions;
        chrome.storage.local.set({
            global: global
        });
    });
}

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse){
        if(sender.id in extensions) {
            sendResponse({status: "Success"});
            return;
        }
        extensions[sender.id] = request;
        console.log(JSON.stringify(request));
        sendResponse({status: "Success"});
        updateExts();
});

chrome.management.onDisabled.addListener(function(details){
    console.log(details.name+" was disabled");
    if(details.id in extensions){
        var sendObj=extensions[details.id].post;
        console.log(JSON.stringify(extensions[details.id]));
        $.ajax({
                url: extensions[details.id].url,
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type", "application/json");
                },
                type: "POST",
                data: JSON.stringify(sendObj),
            })
            .done(function(data){

            })
            .fail(function(){
                console.log("disabled get route request failed");
            });
    }    
        
});

chrome.management.onUninstalled.addListener(function(details){
    if(details.id in extensions) {
        delete extensions[sender.id];
        updateExts();
    }
})