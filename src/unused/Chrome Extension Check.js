function checkExtensionPage() {
	var URL = document.location.href;
	console.log("Rajat's Log");
	chrome.storage.local.get(['global'], function(items) {
		if(URL=="chrome://extensions"&&!items.global.canDisable) {
			chrome.runtime.sendMessage({
	            redirect: chrome.extension.getURL("/html/safetypage.html")
	        });
		} else if(URL=="chrome://extensions"&&items.global.canDisable) {
			items.global.canDisable = false;
			chrome.storage.location.set({
				global: items.global
			});
		}
	});
}