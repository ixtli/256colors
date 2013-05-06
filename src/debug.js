window.debug = {};

window.debug.dumpTest = function ()
{
	var comp = $('#input').html();
	var out = $('#raw').text();
	return JSON.stringify({comp : comp, out : out});
};

window.debug.loadTest = function (d)
{
	var data = d;
	
	if (typeof d === typeof "foo")
	{
		data = JSON.parse(d);
	} else if (typeof d !== typeof {}) {
		console.error('Invalid data type.');
		return;
	} else if (!data['comp'] || !data['out']) {
		console.error('Invalid data format.');
		return;
	}
	
	$('#input').empty().html(data.comp).trigger('change');
	
	var success = $('#raw').text() == data.out;
	
	if (success)
	{
		console.log('Test passed.');
	} else {
		console.error('Test failed.');
	}
	
	return success;
};