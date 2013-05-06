window.debug = {};

window.debug.testBattery = function ()
{
	var tests = [
		{"comp":"the&nbsp;<div>quick&nbsp;</div><div>brown&nbsp;</div><div>fox</div>","out":"the&nbsp;\\nquick&nbsp;\\033[0m\\nbrown&nbsp;\\033[0m\\nfox\\033[0m"},
		{"comp":"The quick <span style=\"background-color: rgb(0, 0, 255);\">brown <font color=\"#ff0000\">fox </font></span><span style=\"background-color: rgb(255, 255, 0);\"><font color=\"#ff0000\">jumped over</font> the</span> lazy dog.","out":"The quick \\033[48;5;21mbrown \\033[38;5;196mfox \\033[0m\\033[48;5;21m\\033[0m\\033[48;5;226m\\033[38;5;196mjumped over\\033[0m\\033[48;5;226m the\\033[0m lazy dog."},
		{"comp":"The quick <span style=\"background-color: rgb(0, 0, 255);\">brown <font color=\"#ff0000\">fox </font></span><span style=\"background-color: rgb(255, 255, 0);\"><font color=\"#ff0000\">jumped&nbsp;</font></span><div><span style=\"background-color: rgb(255, 255, 0);\"><font color=\"#ff0000\"><br></font></span></div><div><span style=\"background-color: rgb(255, 255, 0);\"><font color=\"#ff0000\">over</font> the</span> lazy dog.&nbsp;</div><div><br></div><div>foo</div>","out":"The quick \\033[48;5;21mbrown \\033[38;5;196mfox \\033[0m\\033[48;5;21m\\033[0m\\033[48;5;226m\\033[38;5;196mjumped&nbsp;\\033[0m\\033[48;5;226m\\033[0m\\n\\033[48;5;226m\\033[38;5;196m\\n\\033[0m\\n\\033[48;5;226m\\033[38;5;196m\\033[0m\\n\\033[48;5;226m\\033[0m\\n\\033[0m\\n\\033[48;5;226m\\033[38;5;196mover\\033[0m\\n\\033[48;5;226m the\\033[0m\\n lazy dog.&nbsp;\\033[0m\\n\\n\\033[0m\\n\\033[0m\\nfoo\\033[0m"}
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