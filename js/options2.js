Array.prototype.extend = function (other_array) {
    /* you should include a test to check whether other_array really is an array */
    other_array.forEach(function(v) {this.push(v)}, this);    
}

// This, at the moment, is used to check if SHIFT is held while selecting multiple replacements.
var cached_keypresses = { };
function cacheKeypresses(e) {
	cached_keypresses.shift = event.shiftKey;
	cached_keypresses.ctrl = event.ctrlKey;
}
document.onkeydown = document.onkeyup = cacheKeypresses;

var bLoaded = false;
var lastSelectedCheckbox;
var replacementsLength = 0;

// Page support for very long replacement lists
var currentPage = 0;
var lastPage = 0;
var replacementsPerPage = 15;

var settings = [];

function load_WR2(page) {
	currentPage = page || 0;
	// Remove the currently displayed items
	$('#ol_dict > li').remove();
	replacementsLength = 0;
	// Update #ol_dict to the correct start number
	$('#ol_dict').prop('start', replacementsPerPage * currentPage + 1 );
	// This prevents addNewListElement to mark the new replacements as 'pending changes'
	bLoaded = false;
	for(var i = (currentPage * replacementsPerPage); i < currentPage * replacementsPerPage + replacementsPerPage; ++i)
	{
		if( !settings[i] ) continue;

		// More specific settings are loaded upon selection.
		var children = addNewListElement().children();
		children[0].value = settings[i].repA;
		children[1].value = settings[i].repB;
		if( !settings[i].active ) $(children[0]).parent().addClass('disabled');

		$(children[0]).parent().removeClass('Simple').removeClass('RegEx').removeClass('Swap').addClass(settings[i].type);
	}
	// addNewListElements automatically checks the newly added element, but yeah.
	$('li > input[type="checkbox"').prop('checked', false);
	// Update the page widget 
	if( replacementsLength == 0 ) {
		lastPage = Math.floor( settings.length  / replacementsPerPage );
	}
	else {
		lastPage = Math.floor( (settings.length - 1) / replacementsPerPage );
	}

	$('#a_pageselector').text('Page ' + (1 + currentPage) + ' of ' + (1 + lastPage) );
	_updateArrows();
	bLoaded = true;

}

function addNewListElement() {
	removeUnsavedReplacements();
	++replacementsLength;
	// If a new page needs to be created
	if(replacementsLength > replacementsPerPage ) {
		// If the last page is full, create an empty page
		if( settings.length % replacementsPerPage == 0 ) {
			load_WR2(++lastPage);
		}
		// Otherwise append the new element at the bottom of the last page
		else {
			load_WR2(lastPage);
		}
		// Call this function again
		return addNewListElement();
	}

	var newLi = $('<li class="li_rep"><input type="text" spellcheck="false"> <input type="text" spellcheck="false"> <input type="checkbox"></li>');
	$('#ol_dict').append(newLi);

	if(bLoaded) setAllCheckboxes(false, false);

	var checkbox = newLi.children().last()[0];
	checkbox.checked = true;

	if( replacementsLength % 2 == 1 ) {
		$(checkbox).parent().addClass('odd');
	}

	if( bLoaded ) {
		$(checkbox).addClass('pendingChanges');
		// Load empty settings to reset the left pane
		loadReplacementSettings(0);
	}
	lastSelectedCheckbox = checkbox;
	return $( $(checkbox).parent() );
}

function removeSelected() {
	var last = undefined;
	var indices = [];

	$('li > input[type="checkbox"]').each(function(i) {
		if(!this.checked) return;
		last = $(this).parent().prev().children('input[type="checkbox"]')[0] || $(this).parent().next().children('input[type="checkbox"]')[0];
		$(this).parent().remove();
		indices.push(i);
	});

	replacementsLength -= indices.length;
	// Walk the settings in reverse order and remove what has to be removed
	for(var j = indices.length - 1; j >= 0; --j) {
		settings.splice((currentPage * replacementsPerPage) + indices[j], 1);
	}

	$('li').each(function(i) {
		if(i % 2 == 1) $(this).removeClass('odd');
		else $(this).addClass('odd');
	});

	$('#c_selectall').prop('checked', false);
	load_WR2(currentPage);
	// If, after loading the remaining items, the page is still empty, then go back to the last page.
	if( replacementsLength == 0 && currentPage > 0 ) load_WR2(--currentPage);

	chrome.storage.local.set( { settings : settings } );
}

function setAllCheckboxes(value, trigger) {
	$('li > input[type="checkbox"]').each(function(i){
		if($(this).prop('checked') != value) {
			$(this).prop('checked', value);
			if(trigger) $(this).trigger('change');
		}
	});
}

function loadReplacementSettings(index) {
	var rep = settings[index];
	if( !rep ) rep = { type: 'Simple', case: 'Maintain', repA: '', repB: '' };

	bLoaded = false;
	if( rep.type == 'Simple' ) {
		$('#a_simple').click();
	}
	else if( rep.type == 'RegEx' ) {
		$('#a_regex').click();
	}
	else if( rep.type == 'Swap' ) {
		$('#a_swap').click();
	}

	if( rep.case == 'Maintain' ) {
		$('#a_maintain').click();
	}
	else if( rep.case == 'Override' ) {
		$('#a_override').click();
	}
	bLoaded = true;

}

function updateReplacementSettings(viewindex, settingindex) {
	var checkbox = $('li > input[type="checkbox"]')[viewindex];
	var siblings = $(checkbox).siblings();

	var reptype = 'Simple'; // fallback
	if( $('#a_regex').hasClass('active') ) { // Just in case I add more replacement types in the future; EDIT: I did
		reptype = 'RegEx';
	} 
	else if( $('#a_swap').hasClass('active') ) {
		reptype = 'Swap';
	}

	var letcase = 'Maintain'; // again, fallback
	if( $('#a_override').hasClass('active') ) {
		letcase = 'Override';
	}

	var bactive = !$(checkbox).parent().hasClass('disabled');
	settings[settingindex] = 
	{ 
		 repA: siblings[0].value,
		 repB: siblings[1].value,
		 type: reptype,
		 case: letcase,
		 active: bactive
	};

	$(checkbox).removeClass('pendingChanges');
	$(checkbox).parent().removeClass('Simple').removeClass('RegEx').removeClass('Swap').addClass(settings[settingindex].type);
}

function removeUnsavedReplacements() {
	$('li > input[type="checkbox"]').each(function(i){
		var _pc = $(this).parent().children();
		// If the first text field is empty, remove this element and don't save its settings.
		if( _pc[0].value.length == 0 ) {
			// Remove unsaved replacements
			if(!settings[(currentPage * replacementsPerPage) + i]) {
				$(this).parent().remove();
				--replacementsLength;
			}
			// Restore saved replacements for which the first field was cleared
			else {
				_pc[0].value = settings[(currentPage * replacementsPerPage) + i].repA;
			}
		}
	});
}

function saveGlobalSettings() {
	// First, remove any useless replacements.
	removeUnsavedReplacements();

	// Save all settings and more
	var selector = $('li > input[type="checkbox"]');
	for(var i = 0; i < selector.length; ++i) 
	{
		if(selector[i].checked) updateReplacementSettings( i, (currentPage * replacementsPerPage) + i );
	}
	chrome.storage.local.set( { settings : settings } );
}

function showPopup(el) {
	if( el.css('display') != 'none' ) return;
	$('#alert_screen').css('display', 'inline-block');
	el.css({ display: 'inline-block', width: '0%', height: '0%' }).animate({ width: '70%', height: '10%' }, 250, function() { $(this).animate({height: '100%'}, 300); });
}

function addPendingChangesToSelected() {
	if( !bLoaded ) return;	
	console.log('p');

	$('li > input[type="checkbox"]').each(function(i, v) {
		if( !v.checked ) return;
		i = i + (replacementsPerPage * currentPage);
		// For new replacements
		if( !settings[i] ) $(v).addClass('pendingChanges');
		// Meh, I'll optimize it when I feel like it
		else if( settings[i].type == 'Simple' && !$('#a_simple').hasClass('active') 
			  || settings[i].type == 'RegEx' && !$('#a_regex').hasClass('active') 
			  || settings[i].type == 'Swap' && !$('#a_swap').hasClass('active') 
		      || settings[i].case == 'Maintain' && !$('#a_maintain').hasClass('active') 
		      || settings[i].case == 'Override' && !$('#a_override').hasClass('active') ) 
		{
			$(v).addClass('pendingChanges');
		}

	});
}

function WR1_To_WR2(localData) {
	var values = localData.values || [];
	var converted = [];

	for( var i = 0; i < values.length; ++i ) {
		var repA = values[i].toReplace || '';
		var type = 'Simple';

		if( !values[i].replaceWithinWords ) { 
			repA = '/\\b' + repA + '\\b/i';
			type = 'RegEx';
		}

		converted.push({
			repA: repA,
			repB: values[i].replaceWith || '',
			type: type,
			case: 'Maintain',
			active: true
		});
	}

	return converted;
}


function exportList(proxy, proxyVer) {
	chrome.storage.local.get( 'global', function(items) {
		var global = items.global || { };

		var outer = { version: proxyVer || global.version || '2.0.0', replacements: proxy || settings };
		$('#textblob').prop('value', JSON.stringify(outer, null, '  ') );
	});
}

function importList() {
	var jsnSettings = { };
	var newSettings = [];

	try {
		jsnSettings = JSON.parse( $('#textblob').prop('value') );
	} catch(err) {
		console.log(err);
		// The uninitialized jsnSettings will work as error handler.
	}

	// WR 1-style syntax
	if( jsnSettings.inputN && jsnSettings.values ) {
		newSettings = WR1_To_WR2(jsnSettings.values);
	}
	// WR 2-style syntax
	else if( jsnSettings.version && jsnSettings.version.indexOf('2.') !== -1 ) {
		var values = jsnSettings.replacements;

		for( var i = 0; i < values.length; ++i ) {
			newSettings.push({
				repA: values[i].repA,
				repB: values[i].repB,
				type: values[i].type,
				case: values[i].case,
				active: values[i].active
			});
		}
	}
	else {
		$('#textblob').prop('value', 'Unrecognized format!' );
		return;
	}

	// Save first, display later
	settings.extend(newSettings);

	load_WR2(Math.floor( (settings.length - 1) / replacementsPerPage) );
	chrome.storage.local.set( { settings : settings } );
}

function getNumberOfSelectedItems() {
	return $('li > input[type="checkbox"]').filter(function() { return this.checked; } ).length;
}

// Since apparently alert(); doesn't work with the new options interface
function showTwoButtonsAlert(message, btn1Text, btn2Text, callback) 
{
	var alert = $('<div class="alert_outer"> <div class="alert_inner">' + message + '</div> <input type="button" value="' + btn1Text + '" class="alert_btn">' + (btn2Text ? ' <input type="button" value="' + btn2Text + '" class="alert_btn"> ' : '') + '</div>');

	alert.find('input[type="button"]').click( function() {
		alert.remove();
		if(callback) callback( this.value );
		$('#alert_screen').css('display', 'none');
	});

	$('#alert_screen').css('display', 'inline-block');
	$('body').append(alert);
}


function _updateArrows() {
	$('#c_selectall').prop('checked', false);
	$('#n_pageselector').prop('max', lastPage + 1);
	$('#a_prevpage,#a_firstpage,#a_nextpage,#a_lastpage').addClass('active');
	if(currentPage == 0) {
		$('#a_prevpage,#a_firstpage').removeClass('active');
	}
	if(currentPage == lastPage) {
		$('#a_nextpage,#a_lastpage').removeClass('active');
	}
}

function bindEvents() {
	$('#a_simple').click(function(){
		$(this).addClass('active');
		$('#a_regex').removeClass('active');
		$('#a_swap').removeClass('active');
		addPendingChangesToSelected();
	});

	$('#a_regex').click(function(){
		$(this).addClass('active');
		$('#a_simple').removeClass('active');
		$('#a_swap').removeClass('active');
		addPendingChangesToSelected();
	});

	$('#a_swap').click(function(){
		$(this).addClass('active');
		$('#a_simple').removeClass('active');
		$('#a_regex').removeClass('active');
		addPendingChangesToSelected();
	});

	$('#a_maintain').click(function(){
		$(this).addClass('active');
		$('#a_override').removeClass('active');
		addPendingChangesToSelected();
	});

	$('#a_override').click(function(){
		$(this).addClass('active');
		$('#a_maintain').removeClass('active');
		addPendingChangesToSelected();
	});

	$('#a_enableselected').click(function(){
		$('li > input[type="checkbox"]').each(function(i, v) {
			if(!v.checked) return;
			$(v).parent().removeClass('disabled');
			settings[(currentPage * replacementsPerPage) + i].active = true;
		});

		chrome.storage.local.set( { settings : settings } );
	});

	$('#a_disableselected').click(function(){
		$('li > input[type="checkbox"]').each(function(i, v) {
			if(!v.checked) return;
			$(v).parent().addClass('disabled');
			settings[(currentPage * replacementsPerPage) + i].active = false;
		});

		chrome.storage.local.set( { settings : settings } );
	});

	$('#a_help').click(function() {
		showPopup( $('#fsp_help') );
	});

	$('#a_about').click(function() {
		showPopup( $('#fsp_about') );
	});

	$('#a_changelog').click(function() {
		showPopup( $('#fsp_changelog') );
	});

	$('#a_donate').click(function() {
		var win = window.open('donate.html', '_blank');
		if(win){
		    //Browser has allowed it to be opened
		    win.focus();
		}
	});

	_updateArrows();
	$('#a_nextpage').click(function() {
		if( !$(this).hasClass('active') ) return;
		load_WR2(++currentPage);
		_updateArrows();
	});

	$('#a_prevpage').click(function() {
		if( !$(this).hasClass('active') ) return;
		load_WR2(--currentPage);
		_updateArrows();
	});

	$('#a_firstpage').click(function() {
		if( !$(this).hasClass('active') ) return;
		load_WR2(0);
		_updateArrows();
	});

	$('#a_lastpage').click(function() {
		if( !$(this).hasClass('active') ) return;
		load_WR2(lastPage);
		_updateArrows();
	});

	$('#a_pageselector').click(function() {
		$('#pageSelector').toggle();
	});

	$('#btn_pageselector').click(function() {
		$('#pageSelector').hide();
		var n = $('#n_pageselector');
		if( n.prop('value') > lastPage + 1 ) n.prop('value', lastPage + 1);
		load_WR2(n.prop('value') - 1);
	});

	$('.fsp_close > a').click(function(){
		$(this).parent().parent().css('display', 'none');
		$('#alert_screen').css('display', 'none');
	});

	$('#btn_applytoselected').click( function() {
		if( getNumberOfSelectedItems() >= 5 ) {
			showTwoButtonsAlert('You\'re about to apply these settings to many replacements at once.<br><br>Are you sure?', 'Yes', 'Cancel', function(ans) {
				if( ans == 'Yes' ) saveGlobalSettings();
			});
		}
		else saveGlobalSettings();
	});

	$('#a_addnew').click(addNewListElement);
	$('#a_removeselected').click( function() {
		var nelems = getNumberOfSelectedItems();
		if( nelems == 0 ) return;

		showTwoButtonsAlert('Really delete ' + nelems + ' replacement' + (nelems == 1 ? '' : 's') + '?', 'Yes', 'Cancel', function(ans) {
			if( ans == 'Yes' ) removeSelected(); 
		});
	});

	$('#a_removeeverything').click(function() {
		showTwoButtonsAlert('Really wipe your WHOLE list clean?', 'Yes', 'Cancel', function(ans) {
			if( ans != 'Yes' ) return;
			setTimeout( function() { 
				showTwoButtonsAlert('This can NOT be undone.<br>(Just to be sure, your list will be exported before being deleted)', 'Yes', 'Cancel', function(ans2) { 
					if( ans2 != 'Yes' ) return;
					// ExportList makes use of an async method, so we need a copy of settings
					var backup = settings.slice();
					exportList(backup);

					chrome.storage.local.set({ settings: (settings = []) });
					load_WR2(0);
				});
			}, 100 );
		});
	});

	$('#c_selectall').click( function() { setAllCheckboxes(this.checked, false); } );

	$('#btn_import').click(importList);
	$('#btn_export').click(function(){exportList()});

	$('#ol_dict').on('change', 'li > input[type="text"]', function() { 
		$(this).siblings('input[type="checkbox"]').addClass('pendingChanges');
	});

	$('#ol_dict').on('change', 'li > input[type="checkbox"]', function() {
		$('#c_selectall').prop('checked', false);
		// If ctrl is pressed, allow multiple selection and don't load new options.
		if(cached_keypresses.ctrl) {
			// But don't let the only selected checkbox to be deselected!
			var l = 0;
			$('li > input[type="checkbox"]').each(function() {
				if(this.checked) l++;
			});
			if( l == 0 ) this.checked = true;

			lastSelectedCheckbox = this;
			return; 
		}
		// If shift is pressed, use a gmail-like selection method
		else if(cached_keypresses.shift) {
			var _s = $('li > input[type="checkbox"]');
			var startIndex = $.inArray(lastSelectedCheckbox, _s);
			var endIndex = $.inArray(this, _s);
			if( startIndex == -1 ) return;

			setAllCheckboxes(false, false);
			for(var i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); ++i) {
				_s[i].checked = true;
			}
			return;
		}

		var _this = this, _checked = this.checked;
		$('li > input[type="checkbox"]').each(function(i, v) {
			if(v.checked) {
				v.checked = false;
			}
			
		});

		var pos = $('li.li_rep').index($(_this).parent());
		_this.checked = true;
		if( _checked && bLoaded ) {
			console.log(1);
			loadReplacementSettings(pos + (currentPage * replacementsPerPage));
		}

		lastSelectedCheckbox = this;
	});
}

function main() {
	bindEvents();

	chrome.storage.local.get( ['settings', 'localData', 'global'], function(items) {
		settings = items.settings || [];

		// Migration from WR1.2 to WR2
		if( items.localData && items.localData.inputN ) {
			showTwoButtonsAlert('Old Word Replacer (1.2) Data detected. Attempt to restore it? Restored data will be converted and shown in the export box, but not added immediately.', 'Yes', 'Not now', function(ans) {
				if( ans != 'Yes' ) return;
				var oldSettings = WR1_To_WR2(items.localData);
				exportList(oldSettings);
				setTimeout( function() {
					showTwoButtonsAlert('Permanently delete the old data?', 'Yes', 'No', function(ans2) {
						if(ans2 == 'Yes') chrome.storage.local.set( { localData: {} } );
					}, 100);
				});
			});
		}

		load_WR2(0);

		if( items.global.showChangelog ) {
			$('#a_changelog').click();
			items.global.showChangelog = false;
			chrome.storage.local.set( { global: items.global } );
		}
	});
}

main();