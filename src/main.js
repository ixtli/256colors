/** constructor */
function Picker ()
{
	this.requiredClasses = [
		'js', 'rgba', 'boxshadow', 'contenteditable'
	];
	
	this.fgPickerContainer = null;
	this.bgPickerContainer = null;
	this.shortcutsContainer = null;
	this.inputElement = null;
	this.rawElement = null;
	
	this.chipClickHandler = null;
	this.shortcutClickHandler = null;
	this.ps1ChangedHandler = null;
	this.inputBlurHandler = null;
	this.inputFocusHandler = null;
	
	this.escapeCharacter = '\\033';
	
	this.bgEscapePrefix = '[48;5;';
	this.fgEscapePrefix = '[38;5;';
	this.escapeSuffix = 'm';
	
	this.currentSelection = null;
	
	this.shortcuts = {
		'username': '\\u',
		'hostname': '\\h',
		'full cwd': '\\w'
	};
};

Picker.prototype.init = function ()
{
	// Feature check!
	var reqs = this.requiredClasses;
	var len = reqs.length;
	var html = $('html');
	var fail = [];
	for (var i = 0; i < len; i++)
	{
		if (!html.hasClass(reqs[i]))
		{
			console.warn('Feature not present: ' + reqs[i]);
			fail.push(reqs[i]);
		}
	}
	
	// If failure, don't continue and notify
	if (fail.length)
	{
		this._failedFeatureDetection(fail);
		return false;
	}
	
	// Collect DOM elements necessary to construct the application
	this.bgPickerContainer = $('div#bg.picker');
	this.fgPickerContainer = $('div#fg.picker');
	this.inputElement = $('div#builder > div#input');
	this.shortcutsContainer = $('div#shortcuts');
	this.rawElement = $('div#ps1 > div#raw');
	
	// We have the feature!
	this.inputElement.prop('contenteditable', true);
	
	// Make proxies
	this.chipClickHandler = $.proxy(this._chipClick, this);
	this.shortcutClickHandler = $.proxy(this._shortcutClick, this);
	this.ps1ChangedHandler = $.proxy(this._ps1Changed, this);
	this.inputBlurHandler = $.proxy(this._inputBlur, this);
	this.inputFocusHandler = $.proxy(this._inputFocus, this);
	
	// Affix callbacks
	this.inputElement.on('keyup', this.ps1ChangedHandler);
	this.inputElement.on('blur', this.inputBlurHandler);
	this.inputElement.on('focus', this.inputFocusHandler);
	
	// Generate the UI
	this._createPicker(this.bgPickerContainer, 'background');
	this._createPicker(this.fgPickerContainer, 'foreground');
	this._createShortcuts();
	
	return true;
};

/** @private */
Picker.prototype._inputBlur = function (evt)
{
	
};

/** @private */
Picker.prototype._inputFocus = function (evt)
{
	var self = $(evt.currentTarget);
	var current = self.html();
	if (!current)
	{
		this._clearStyle();
	}
};

/** @private */
Picker.prototype._restoreSelection = function ()
{
	this.inputElement.focus();
	
	if (!this.currentSelection) return;
	
	this.inputElement.setSelectionRange(0, 5);
	this.currentSelection = null;
};

/** @private */
Picker.prototype._render = function ()
{
	var elts = this.inputElement.children();
	var len = elts.length;
	
	var current = null;
	var escapeString = "";
	var bgColor = "";
	for (var i = 0; i < len; i++)
	{
		current = $(elts[i]);
		escapeString = escapeString + current.attr('escape');
	}
	
	// Put it, raw, for copying in the PS1 element
	this.rawElement.html(escapeString);
};

/** @private */
Picker.prototype._ps1Changed = function (evt)
{
	var selection = document.getSelection();
	var parent = $(selection.baseNode.parentElement);
	
	var rawElement = this.inputElement[0];
	
	// If the user is editing raw text, this is bad so we need to remove it
	// and replace it with a span-wrapped text that can be easily read out
	// when we want to create the PS1
	// N.B.: some pretty esoteric crap happens here because microsoft hates
	// everyone trying to make software for general purpose computers, so be
	// very careful when editing.
	if (selection.baseNode.parentElement === rawElement)
	{
		// Save the typed text, clear the element, then readd the text
		var text = this.inputElement.text();
		this.inputElement.empty().text(text);
		
		// Make a selection that encompases the entire div
		var range = document.createRange();
		range.selectNodeContents(rawElement);
		var selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		// use the standard function to clear the style
		this._clearStyle();
		
		// snap cursor to the end of contenteditable
		// solution: http://stackoverflow.com/a/3866442
		// collapse the range to the end point.
		// false means collapse to end rather than the start
		range.collapse(false);
		selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	}
	
	this._render();
};

/** @private */
Picker.prototype._shortcutClick = function (evt)
{
	var code = $(evt.currentTarget).attr('code');
	document.execCommand('insertText', false, code);
	
	var range = document.createRange();
	var selection = window.getSelection();
	selection.extend(selection.baseNode.parentNode, code.length);
};

/**
	* @private
	* @param {int} red value between 0 and 255
	* @param {int} green value between 0 and 255
	* @param {int} blue value between 0 and 255
	* @param {int} alpha value between 0 and 255, optional
	* @return {string} hex value in string format
	*/
Picker.prototype._hexColor = function (r, g, b, a)
{
	var red = parseInt(r).toString(16);
	var green = parseInt(g).toString(16);
	var blue = parseInt(b).toString(16);
	
	red = red.length > 1 ? red : '0' + red;
	green = green.length > 1 ? green : '0' + green;
	blue = blue.length > 1 ? blue : '0' + blue;
	
	var ret = red + green + blue;
	
	if (a !== undefined)
	{
		var alpha = parseInt(a).toString(16);
		alpha = alpha.length > 1 ? alpha : '0' + alpha;
		ret = ret + alpha
	}
	
	return ret;
}

/** @private */
Picker.prototype._chipClick = function (evt)
{
	// Do all of this to keep the text element from losing selection
	evt.preventDefault();
	evt.stopPropagation();
	evt.returnValue = false;
	
	var self = $(evt.currentTarget);
	document.execCommand('backColor', false, self.css('background-color'));
	
	// extra styles to the selection
	var result = $(document.getSelection().focusNode.parentNode);
	result.attr('code', self.attr('code'));
	
	this._updateStyles();
	
	return false;
};

/** @private */
Picker.prototype._clearStyle = function ()
{
	document.execCommand('foreColor', false, "#000000");
};

/** @private */
Picker.prototype._createShortcuts = function ()
{
	var container = this.shortcutsContainer;
	var elt = null;
	var scs = this.shortcuts;
	for (cut in scs)
	{
		elt = $('<button>')
			.addClass('shortcut')
			.text(cut)
			.attr('code', scs[cut])
			.on('click', this.shortcutClickHandler);
		container.append(elt);
	}
};

/**
	* @private
	* @param {int} 3bit red color
	* @param {int} 3bit green color
	* @param {int} 3bit blue color
	*/
Picker.prototype._colorChip = function (red, green, blue)
{
	var elt = $('<button>').addClass('chip');
	
	// vt100 code, stolen from Todd Larason's perl script
	// See: http://www.frexx.de/xterm-256-notes/
	var code = 16 + (red * 36) + (green * 6) + blue;
	
	elt.attr({'code' : code, 'red' : red, 'green' : green, 'blue' : blue});
	
	// Create the 32-bit rgb values from the list. This is also from the above
	var color = this._hexColor(
		red ? red * 40 + 55 : 0,
		green ? green * 40 + 55 : 0,
		blue ? blue * 40 + 55 : 0
	);
	
	elt.css('background-color', '#' + color);
	
	return elt;
}

/**
	* @private
	* @param {jQuery} container
	* @param {string} display name of picker
	*/
Picker.prototype._createPicker = function (container, name)
{
	var group = $('<div>').attr('id', 'preview').addClass('group');
	group.append($('<h5>').html(name));
	
	container.append(group);
	
	for (var green = 0; green < 6; green++)
	{
		group = $('<div>').addClass('group');
		
		for (var red = 0; red < 6; red++)
		{
			for (var blue = 0; blue < 6; blue++)
			{
				group.append(this._colorChip(red, green, blue)
					.on('click', this.chipClickHandler));
			}
		}
		
		container.append(group);
	}
	
};

/** @private */
Picker.prototype._updateStyles = function ()
{
	
};

/** 
 * 
 * @private
 * @param {Array.<string>} features that are absent
 */
Picker.prototype._failedFeatureDetection = function (failed)
{
	
};

// Bootstrap when DOM is ready
$( function () { var p = new Picker(); p.init(); } );