/** constructor */
function Picker ()
{
	this.pickerContainer = null;
	this.shortcutsContainer = null;
	this.inputElement = null;
	
	this.chipClickHandler = null;
	this.shortcutClickHandler = null;
	
	this.escapeCharacter = '\\033';
	
	this.bgEscapePrefix = '[48;5;';
	this.fgEscapePrefix = '[38;5;';
	this.escapeSuffix = 'm';
	
	this.shortcuts = {
		'clear': '[0'
	};
};

Picker.prototype.init = function ()
{
	// Collect DOM elements necessary to construct the application
	this.pickerContainer = $('div#picker');
	this.inputElement = $('div#ps1 > div#input');
	this.shortcutsContainer = $('div#shortcuts');
	
	// Make proxies
	this.chipClickHandler = $.proxy(this._chipClick, this);
	this.shortcutClickHandler = $.proxy(this._shortcutClick, this);
	
	// Generate the UI
	this._createPicker();
	this._createShortcuts();
	
	return true;
};

/** @private */
Picker.prototype._appendToPS1 = function (code)
{
	var toAppend = this.escapeCharacter + code + this.escapeSuffix;
	this.inputElement.html(this.inputElement.html() + toAppend);
};

/** @private */
Picker.prototype._shortcutClick = function (evt)
{
	this._appendToPS1($(evt.currentTarget).attr('code'));
};

/** @private */
Picker.prototype._chipClick = function (evt)
{
	this._appendToPS1(this.bgEscapePrefix + $(evt.currentTarget).attr('code'));
};

/** @private */
Picker.prototype._createShortcuts = function ()
{
	var container = this.shortcutsContainer;
	var elt = null;
	var scs = this.shortcuts;
	for (cut in scs)
	{
		elt = $('<div>')
			.addClass('shortcut')
			.text(cut)
			.attr('code', scs[cut])
			.on('click', this.shortcutClickHandler);
		container.append(elt);
	}
};

/** @private */
Picker.prototype._createPicker = function ()
{
	var container = this.pickerContainer;
	var group = null;
	for (var green = 0; green < 6; green++)
	{
		group = $('<div>').addClass('group');
		
		for (var red = 0; red < 6; red++)
		{
			for (var blue = 0; blue < 6; blue++)
			{
				group.append($('<div>')
					.addClass('chip')
					.css('background-color', 'rgb(' 
						+ Math.floor(red ? 256 - 256/red : 0) + ','
						+ Math.floor(green ? 256 - 256/green : 0) + ','
						+ Math.floor(blue ? 256 - 256/blue : 0) + ')' )
					.attr('code', 16 + (red * 36) + (green * 6) + blue)
					.on('click', this.chipClickHandler)
				);
			}
		}
		
		container.append(group);
	}
	
};

// Bootstrap when DOM is ready
$( function () { var p = new Picker(); p.init(); } );