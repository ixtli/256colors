window.debug = {};

window.debug.testBattery = function ()
{
	var tests = [
		{"comp":"the&nbsp;<div>quick&nbsp;</div><div>brown&nbsp;</div><div>fox</div>","out":"the&nbsp;\\nquick&nbsp;\\033[0m\\nbrown&nbsp;\\033[0m\\nfox\\033[0m"},
	];
	
	for (test in tests)
	{
		debug.loadTest(tests[test]);
	}
};

window.debug.dumpTest = function ()
{
	var comp = $('#input').html();
	var out = $('#raw').html();
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
	
	$('#raw').empty();
	$('#input').empty().html(data.comp).trigger('change');
	
	var success = $('#raw').html() == data.out;
	
	if (success)
	{
		console.log('Test passed.');
	} else {
		console.error('Test failed.');
	}
	
	return success;
};