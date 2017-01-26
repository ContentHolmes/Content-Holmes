function main(items) {
	var global = items.global || { };

	$('#toggle_enable').click(function() {
		this.innerText = this.innerText == 'DISABLED' ? 'ENABLED' : 'DISABLED';
		if( this.innerText == 'ENABLED' ) {
			$(this).css('color', '#00AA00');
			chrome.browserAction.setIcon( { path: 'images/icon_19.png' } );
		}
		else {
			$(this).css('color', '#CC0000');
			chrome.browserAction.setIcon( { path: 'images/icon_19_disabled.png' } );
		}
	}).click().click(); // Initialize to DISABLED.
	// But enable if it gotta be enabled (the timeout is because setIcon sometimes doesn't catch up fast enough and also fuck abusing async methods when unnecessary)
	if(global.enabled) setTimeout( function() { $('#toggle_enable').click() }, 10 );
	// And then bind the event that actually saves the enabled state to storage
	$('#toggle_enable').click(function() {
		global.enabled = this.innerText == 'ENABLED';
		chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
			if( global.enabled ) {
				// Run the content script on enable since we can still do what has not been done yet
				chrome.tabs.sendMessage(tabs[0].id, "run_cs");
			}
			else {
				// Refresh on disable since we can't undo what was done
				chrome.tabs.sendMessage(tabs[0].id, "refresh");
			}

			chrome.storage.local.set( { global: global } );
		});

	});

	$('#open_options').click(function() {
		if (chrome.runtime.openOptionsPage) {
	    	// New way to open options pages, if supported (Chrome 42+).
	    	chrome.runtime.openOptionsPage();
		} else {
			// Reasonable fallback.
			window.open(chrome.runtime.getURL('options.html'));
		}
	});
}


$(document).ready(function() {
	chrome.storage.local.get('global', main);
});
