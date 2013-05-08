/** constructor */
function Picker ()
{
	// features added to the html element by modernizr for easy compatibility
	// and browser feature checking at init
	this.requiredClasses = [
		'js', 'rgba', 'boxshadow', 'contenteditable'
	];
	
	// DOM elements that we ave references to for easy access later
	this.fgPickerContainer = null;
	this.bgPickerContainer = null;
	this.PS1FormatCheck = null;
	this.inputElement = null;
	this.rawElement = null;
	
	// proxy functions
	this.chipClickHandler = null;
	this.shortcutClickHandler = null;
	this.shortcutMouseEnterHandler = null;
	this.ps1ChangedHandler = null;
	this.inputBlurHandler = null;
	this.inputFocusHandler = null;
	this.outputClickHandler = null;
	this.toggleClickHandler = null;
	this.ps1formatChangeHandler = null;
	
	// Global vt100 control codes
	this.escapeSuffix = 'm';
	this.escapePrefix = '\\033[';
	
	// Composite vt100 control codes
	this.bgControlPrefix = this.escapePrefix + '48;5;';
	this.fgControlPrefix = this.escapePrefix + '38;5;';
	this.boldControlCode = this.escapePrefix + '1' + this.escapeSuffix;
	this.ulControlCode = this.escapePrefix + '4' + this.escapeSuffix;
	this.clearCode = this.escapePrefix + '0' + this.escapeSuffix;
	this.lineBreakCharacter = '\\n';
	
	// BASH specific control codes
	this.PS1Output = true;
	this.PS1ControlSequencePrefix = '\\[';
	this.PS1ControlSequenceSuffix = '\\]';
	
	// Interestingly, this is always listed as "italic", but it appears to
	// do different things on different implementations!
	// Terminal.app : bright without being bold
	// iTerm2.app : inverts fg and bg
	this.funControlPrefix = this.escapePrefix + '3' + this.escapeSuffix;
	
	// Misc stuff
	this.githubAddr = "https://github.com/ixtli/256colors";
};

/*
* construct the Picker objects
* @return {boolean} whether or not construction was succesful
*/
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
			fail.push(reqs[i]);
		}
	}
	
	// If failure, don't continue and notify
	if (fail.length)
	{
		this._failedFeatureDetection(fail);
		return false;
	}
	
	// Check data consistency
	if (window.data.codeArray.length != 256)
	{
		console.error('data load invalid');
		return false;
	}
	
	// Collect DOM elements necessary to construct the application
	this.bgPickerContainer = $('div#bg.picker');
	this.fgPickerContainer = $('div#fg.picker');
	this.inputElement = $('div#builder > div#input');
	this.rawElement = $('div#ps1 > div#raw');
	this.PS1FormatCheck = $('div#ps1 > input');
	
	// We have the feature!
	this.inputElement.prop('contenteditable', true);
	this.inputElement.prop('spellcheck', false);
	this.PS1FormatCheck.prop('checked', this.PS1Output);
	
	// Make proxies
	this.chipClickHandler = $.proxy(this._chipClick, this);
	this.shortcutClickHandler = $.proxy(this._shortcutClick, this);
	this.ps1ChangedHandler = $.proxy(this._ps1Changed, this);
	this.inputBlurHandler = $.proxy(this._inputBlur, this);
	this.inputFocusHandler = $.proxy(this._inputFocus, this);
	this.outputClickHandler = $.proxy(this._outputClick, this);
	this.shortcutMouseEnterHandler = $.proxy(this._shortcutMouseEnter, this);
	this.toggleClickHandler = $.proxy(this._toggleClick, this);
	this.ps1formatChangeHandler = $.proxy(this._ps1FormatCheckChange, this);
	
	// Affix callbacks
	this.inputElement.on('change', this.ps1ChangedHandler);
	this.inputElement.on('keyup', this.ps1ChangedHandler);
	this.inputElement.on('blur', this.inputBlurHandler);
	this.inputElement.on('focus', this.inputFocusHandler);
	this.inputElement.on('mouseup', this.ps1ChangedHandler);
	this.rawElement.parent().on('click', this.outputClickHandler);
	this.inputElement.prev().on('click', this.toggleClickHandler);
	this.PS1FormatCheck.on('change', this.ps1formatChangeHandler);
	
	// Generate the UI
	this._generateColorTables();
	this._createPicker(this.bgPickerContainer, 'background');
	this._createPicker(this.fgPickerContainer, 'foreground');
	this._createShortcuts();
	
	// Update the UI
	this._updateStyles();
	
	return true;
};

/** @private */
Picker.prototype._ps1FormatCheckChange = function (evt)
{
	this.PS1Output = this.PS1FormatCheck.prop('checked');
	this._ps1Changed();
}

/** @private */
Picker.prototype._toggleClick = function (evt)
{
	$(evt.currentTarget).parent().children().toggleClass('dark');
};

/** @private */
Picker.prototype._shortcutMouseEnter = function (evt)
{
	var self = $(evt.currentTarget);
	var explain = self.parent().parent().children('h5').html(self.attr('hint'));
	
	if (!explain.filter(':visible').length)
	{
		explain.show().fadeIn(100);
	}
};

Picker.prototype._shortcutMouseLeave = function (evt)
{
	$(this).children('h5').fadeOut(100);
};

/** @private */
Picker.prototype._generateColorTables = function ()
{
	
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
	
	// system colors are a special case as well (0-16)
	if (!(red | green | blue))
	{
		return 0;
	}
	
	// gray is a special case (232-255)
	if (red == green && red == blue)
	{
		return red ? (red - 8) / 10 + 232 : 232;
	}
	
	// otherwise, we're 256 color rgb space (16-231)
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
Picker.prototype._translateBGColor = function (elt)
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
Picker.prototype._translateFGColor = function (elt)
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
	'b' : function () { return [this.boldControlCode, true]; },
	'u' : function () { return [this.ulControlCode, true]; },
	'br' : function () { return [this.lineBreakCharacter, false]; },
	'div' : function () { return [this.lineBreakCharacter, false]; }
};

/**
	* Depth-first recursion of DOM subtree to render it as a bash-compatible
	*		vt100 control sequence.
	* @param {Array.<jQuery>} contents to be itterated upon
	* @param {Array.<string>} stack of 'living' control characters at present
	* @private
	*/
Picker.prototype._render = function (array, controlStack)
{
	if (!controlStack)
	{
		controlStack = [];
	}
	
	var ret = "";
	var len = array.length;
	var current = null;
	var contents = null;
	var nodeName = null;
	var nodeStyle = null;
	var controlString = null;
	for (var i = 0; i < len; i++)
	{
		current = array[i];
		
		// If the node is text, easy out
		if (current.nodeType == 3)
		{
			ret += $(current).text();
			continue;
		}
		
		// Another easy out: an empty node!
		current = $(current);
		contents = current.contents();
		if (!contents.length)
		{
			continue;
		}
		
		// We are now endevoring to create a control string
		controlString = "";
		
		// Get the escape code this node defines, for instance <u> means underline
		// while a <div> OR a <br> means a newline
		nodeName = current[0].nodeName.toLowerCase();
		if (this._translationFunctions[nodeName])
		{
			nodeStyle = this._translationFunctions[nodeName].call(this, current);
			if (nodeStyle[1])
			{
				// the node style is a control character
				controlString += nodeStyle[0];
			} else {
				ret += nodeStyle[0];
			}
		}
		
		// Now proceed to collect the node styles in other ways, stored in attrs
		// or style="" tags;
		// Any node could have a color settings, apparently
		if (current.attr('color'))
		{
			controlString += this._translateFGColor(current);
		}
		
		// Account for background color
		if (current.attr('style'))
		{
			controlString += this._translateBGColor(current);
		}
		
		// It's possible to get here without having gotten any control characters
		// for instance, if there's a bunch of newlines
		if (controlString != "")
		{
			// Append our escape chars to the stack
			if (this.PS1Output) ret += this.PS1ControlSequencePrefix;
			ret += controlString;
			if (this.PS1Output) ret += this.PS1ControlSequenceSuffix;
			
			// Push our escape chars
			controlStack.push(controlString);
		}
		
		// This is the depth first recursion part ;D
		ret += this._render(contents, controlStack);
		
		// As per above, early out if there's nothing to undo
		if (controlString == "") continue;
		
		// Remove our escape chars, because they've ended
		controlStack.pop();
	
		// Clear the style we made
		if (this.PS1Output) ret += this.PS1ControlSequencePrefix
		ret += this.clearCode + controlStack.join('');
		if (this.PS1Output) ret += this.PS1ControlSequenceSuffix;
	}
	
	return ret;
};

/** @private */
Picker.prototype._ps1Changed = function (evt)
{
	this.rawElement.html(this._render(this.inputElement.contents()));
	this._updateStyles();
};

/** @private */
Picker.prototype._shortcutClick = function (evt)
{
	var code = $(evt.currentTarget).attr('code');
	
	switch (code)
	{
		case 'underline':
		case 'bold':
		case 'removeFormat':
		document.execCommand(code, false, null);
		break;
		
		default:
		document.execCommand('insertText', false, code);
		break;
	}
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
Picker.prototype._createShortcuts = function ()
{
	var before = $('div.picker').last();
	var elt = null;
	var container = null;
	var scs = null;
	var wrap = null;
	for (var key in window.data.shortcuts)
	{
		container = $('<div>')
			.addClass('shortcuts')
			.on('mouseleave', this._shortcutMouseLeave)
			.append($('<h4>').html(key))
			.append($('<h5>'));
		
		scs = window.data.shortcuts[key];
		wrap = $('<div>').addClass('button-wrap');
		for (cut in scs)
		{
			elt = $('<button>')
				.addClass('shortcut')
				.text(cut)
				.attr('code', scs[cut][0])
				.attr('hint', scs[cut][1])
				.on('click', this.shortcutClickHandler)
				.on('mouseenter', this.shortcutMouseEnterHandler)
			wrap.append(elt);
		}
		
		before.after(container.append(wrap));
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
	
	var color = "rgb(" +
		(red ? red * 40 + 55 : 0) + "," + 
		(green ? green * 40 + 55 : 0) + "," + 
		(blue ? blue * 40 + 55 : 0) + ")";
	
	elt.css('background-color', color);
	
	return elt;
}

/**
	* @private
	* @param {int} 3bit saturation
	*/
Picker.prototype._grayChip = function (sat)
{
	var elt = $('<button>').addClass('chip');
	var level = sat * 10 + 8;
	elt.css('background-color', 'rgb(' + level + ',' + level + ',' + level + ')');
	
	return elt;
}

/**
	* @private
	* @param {int} 3bit saturation
	*/
Picker.prototype._sysChip = function (sat)
{
	var elt = $('<button>').addClass('chip');
	var level = sat * 10 + 8;
	elt.css('background-color', 'rgb(' + level + ',' + level + ',' + level + ')');
	
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
	
	// Create the 6x6x6 cube of 8bit colors
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
	
	// Create the standard vt100 color table
	group = $('<div>').addClass('group gray');
	for (var gray = 0; gray < 24; gray++)
	{
		group.append(this._grayChip(gray).on('click', this.chipClickHandler));
	}
	container.append(group);
	
};

/** @private */
Picker.prototype._updateStyles = function ()
{
	var selection = document.getSelection();
	var fgDisplay = $('div#fg > div#preview');
	var bgDisplay = $('div#bg > div#preview');
	
	// Base case: no selection or selection in another element
	if (!selection.anchorNode || !this.inputElement.is(':focus'))
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
	$('body')
		.empty()
		.append($('<h1>').html('You need a new browser.'))
		.append($('<a>').attr('href', 'http://browsehappy.com/')
			.html('You can get one here!'))
		.append($('<p>').html('specifically, your browser lacked the following'
			+ ' features: ' + failed.join(' ')));
};

// Bootstrap when DOM is ready
$( function () { var p = new Picker(); p.init(); } );