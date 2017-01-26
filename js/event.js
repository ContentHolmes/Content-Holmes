var currentVersion = '2.0.10';

chrome.storage.local.get(['settings', 'global'], function(items) {
	var global = items.global || { };

	// Update icon
	if( global.enabled ) {
		chrome.browserAction.setIcon( { path: 'images/icon_19.png' } );
	}
	else {
		chrome.browserAction.setIcon( { path: 'images/icon_19_disabled.png' } );
	}

	if( global.version != currentVersion ) {
		// Update version
		global.version = currentVersion;
		// Update some variables to their default value
		global.enabled = true;

		global.showChangelog = true;
	}

	chrome.storage.local.set({ global: global });
});