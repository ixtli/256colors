/** constructor */
function Picker ()
{
	this.requiredClasses = [
		'js', 'rgba', 'boxshadow', 'contenteditable'
	];
	
	this.fgPickerContainer = null;
	this.bgPickerContainer = null;
	this.inputElement = null;
	this.rawElement = null;
	
	this.chipClickHandler = null;
	this.shortcutClickHandler = null;
	this.ps1ChangedHandler = null;
	this.inputBlurHandler = null;
	this.inputFocusHandler = null;
	this.outputClickHandler = null;
	
	// Global control codes
	this.escapeSuffix = 'm';
	this.escapePrefix = '\\033[';
	
	// Composite control codes
	this.bgControlPrefix = this.escapePrefix + '48;5;';
	this.fgControlPrefix = this.escapePrefix + '38;5;';
	this.clearCode = this.escapePrefix + '0' + this.escapeSuffix;
	
	this.currentSelection = null;
	
	this.shortcuts = {
		'ps1 shortcuts' :
		{
			'username': '\\u',
			'hostname': '\\h',
			'full cwd': '\\w'
		}
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
	this.rawElement = $('div#ps1 > div#raw');
	
	// We have the feature!
	this.inputElement.prop('contenteditable', true);
	this.inputElement.prop('spellcheck', false);
	
	// Make proxies
	this.chipClickHandler = $.proxy(this._chipClick, this);
	this.shortcutClickHandler = $.proxy(this._shortcutClick, this);
	this.ps1ChangedHandler = $.proxy(this._ps1Changed, this);
	this.inputBlurHandler = $.proxy(this._inputBlur, this);
	this.inputFocusHandler = $.proxy(this._inputFocus, this);
	this.outputClickHandler = $.proxy(this._outputClick, this);
	
	// Affix callbacks
	this.inputElement.on('change', this.ps1ChangedHandler);
	this.inputElement.on('keyup', this.ps1ChangedHandler);
	this.inputElement.on('blur', this.inputBlurHandler);
	this.inputElement.on('focus', this.inputFocusHandler);
	this.inputElement.on('mouseup', this.ps1ChangedHandler);
	this.rawElement.parent().on('click', this.outputClickHandler);
	
	// Generate the UI
	this._createPicker(this.bgPickerContainer, 'background');
	this._createPicker(this.fgPickerContainer, 'foreground');
	this._createShortcuts();
	
	// Update the UI
	this._updateStyles();
	
	return true;
};

/** @private */
Picker.prototype._outputClick = function (evt)
{
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(this.rawElement[0]);
	selection.removeAllRanges();
	selection.addRange(range);
};

/** @private */
Picker.prototype._inputBlur = function (evt)
{
	this._updateStyles();
};

/** @private */
Picker.prototype._inputFocus = function (evt)
{
	this._updateStyles();
};

/**
	* @private
	* @param {int} red value [0 - 255]
	* @param {int} green value [0 - 255]
	* @param {int} blue value [0 - 255]
	* return {int} VT100 256 color term code
	*/
Picker.prototype._rgbToVT100 = function (red, green, blue)
{
	
	// vt100 code, generation. stolen from Todd Larason's perl script
	// See: http://www.frexx.de/xterm-256-notes/
	
	if (red > 0) red = (red - 55) / 40;
	if (green > 0) green = (green - 55) / 40;
	if (blue > 0) blue = (blue - 55) / 40;
	
	return num = 16 + (red * 36) + (green * 6) + blue;
};

/**
	* @private
	* @param {jQuery} the element to be translated
	* @return {string} the escape sequence
	*/
Picker.prototype._translateSpan = function (elt)
{
	var color = elt.css('background-color').split(',');
	
	var num = this._rgbToVT100(
		parseInt(color[0].split('(')[1]),
		parseInt(color[1]),
		parseInt(color[2].split(')')[0])
	);
	
	return this.bgControlPrefix + num + this.escapeSuffix;
};

/**
	* @private
	* @param {jQuery} the element to be translated
	* @return {string} the escape sequence
	*/
Picker.prototype._translateFont = function (elt)
{
	var color = elt.attr('color').split('#')[1];
	
	var num = this._rgbToVT100(
		parseInt(color.slice(0, 2), 16),
		parseInt(color.slice(2, 4), 16),
		parseInt(color.slice(4, 6), 16)
	);
	
	return this.fgControlPrefix + num + this.escapeSuffix;
};

Picker.prototype._translationFunctions = {
	'span' : Picker.prototype._translateSpan,
	'font' : Picker.prototype._translateFont,
	'br' : function () { return '\\n'; },
	'div' : function () { return '\\n'; }
};

/**
	* @param {Array.<jQuery>} contents to be itterated upon
	* @param {string} existing escape characters
	* @private
	*/
Picker.prototype._render = function (array, currentEscapes)
{
	// The thing to be returned
	var ret = "";
	
	var len = array.length;
	var type = null;
	var current = null;
	var nodeName = null;
	var contents = null;
	var process = null;
	var nodeData = null;
	for (var i = 0; i < len; i++)
	{
		current = array[i];
		
		// If the node is text, easy out
		if (current.nodeType == 3)
		{
			ret += $(current).text();
			continue;
		}
		
		// Get the type of node for use later
		nodeName = current.nodeName.toLowerCase();
		
		// Get the escape code this node defines
		current = $(current);
		if (this._translationFunctions[nodeName])
		{
			process = this._translationFunctions[nodeName].call(this, current);
		} else {
			console.warn("Don't know how to decode node type '" + nodeName + "'!");
			process = "";
		}
		
		// Append our escape chars
		ret += process;
		
		// if the node has children, recurse on them!
		contents = current.contents();
		if (contents.length)
		{
			ret += this._render(contents, currentEscapes + process);
		}
		
		ret += this.clearCode + currentEscapes;
	}
	
	return ret;
};

/** @private */
Picker.prototype._ps1Changed = function (evt)
{
	this.rawElement.html(this._render(this.inputElement.contents(), ""));
	this._updateStyles();
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
	var type = self.parent().parent().attr('id');
	
	if (type == "fg")
	{
		document.execCommand('foreColor', false, self.css('background-color'));
	} else {
		document.execCommand('backColor', false, self.css('background-color'));
	}
	
	this._ps1Changed();
	
	return false;
};

/** @private */
Picker.prototype._clearStyle = function ()
{
	
};

/** @private */
Picker.prototype._createShortcuts = function ()
{
	var before = $('div.picker').last();
	var elt = null;
	var container = null;
	var scs = null;
	for (var key in this.shortcuts)
	{
		container = $('<div>').addClass('shortcuts');
		container.append($('<h4>').html(key));
		
		scs = this.shortcuts[key];
		
		for (cut in scs)
		{
			elt = $('<button>')
				.addClass('shortcut')
				.text(cut)
				.attr('code', scs[cut])
				.on('click', this.shortcutClickHandler);
			container.append(elt);
		}
		
		before.after(container);
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
	var selection = document.getSelection();
	var fgDisplay = $('div#fg > div#preview');
	var bgDisplay = $('div#bg > div#preview');
	
	// Base case: no selection
	if (!selection.anchorNode)
	{
		fgDisplay.removeAttr('style');
		fgDisplay.addClass('no-select');
		bgDisplay.removeAttr('style');
		bgDisplay.addClass('no-select');
		return;
	}
	
	fgDisplay.removeClass('no-select');
	bgDisplay.removeClass('no-select');
	
	var current = $(selection.anchorNode);
	var bgColor = null;
	var fgColor = null;
	while (current.attr('id') != "input")
	{
		if (!bgColor && current.is('span'))
		{
			bgColor = current.css('background-color');
		} else if (!fgColor && current.is('font')) {
			fgColor = current.attr('color');
		}
		
		current = current.parent();
		
	};
	
	// Default, if nothing is specified for either
	if (!bgColor)
	{
		bgColor = this.inputElement.css('background-color');
	}
	
	if (!fgColor)
	{
		fgColor = this.inputElement.css('color');
	}
	
	fgDisplay.css('background-color', fgColor);
	bgDisplay.css('background-color', bgColor);
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