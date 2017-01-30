var currentVersion = '2.0.10';

chrome.storage.local.get(['settings', 'global'], function(items) {
	var global = items.global || { };

	// Update icon
	// if( global.enabled ) {
	// 	chrome.browserAction.setIcon( { path: 'images/icon_19.png' } );
	// }
	// else {
	// 	chrome.browserAction.setIcon( { path: 'images/icon_19_disabled.png' } );
	// }

	if( global.version != currentVersion ) {
		// Update version
		global.version = currentVersion;
		// Update some variables to their default value
		global.enabled = true;
		// set it as object {"date":"","URL":""}
		global.showChangelog = true;
	}

	global.newVar="fdafda";
	global.historyOfBlockedURLS=[];
	global.bannedURLs=[];
	global.trustedURLs=[];
	chrome.storage.local.set({ global: global });
});

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
  console.log("something must happen right now");
  if(request.message == "sentiment"){
    console.log("sentiment will be fired");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {message: "FireSentiment"}, function(response) {
	    console.log(response.message);
	  });
	});
	console.log("this function ran");
    sendResponse({message:"good luck bro"});
  } else /*if(request.message == "redirect")*/ {
  		console.log("I am here");
    	chrome.tabs.update(sender.tab.id, {url: request.redirect});
    	sendResponse({message:"good luck bro2"});
  }
  
});
<<<<<<< HEAD
=======

// chrome.tabs.query({"active":true},function(tab){
// 	console.log(tab[0].url.toString());
// });
// chrome.tabs.getCurrent(function(tab){
//         console.log(tab.url);
//     }
// );
>>>>>>> b907f1a250396086088b6a618b7de1c095f334e2
