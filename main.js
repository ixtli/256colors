/** constructor */
function Picker ()
{
	this.pickerContainer = null;
	this.chipClickHandler = null;
	
	this.bgEscapePrefix = '\\033[48;5;';
	this.fgEscapePrefix = '\\003[38;5;';
	this.escapeSuffix = 'm';
};

Picker.prototype.init = function ()
{
	this.pickerContainer = $('div#picker');
	
	// Make proxies
	this.chipClickHandler = $.proxy(this._chipClick, this);
	
	this._createPicker();
	
	return true;
};

/** @private */
Picker.prototype._chipClick = function (evt)
{
	
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

$( function () { var p = new Picker(); p.init(); } );