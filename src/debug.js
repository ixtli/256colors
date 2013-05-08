window.debug = {};

window.debug.knownTests = [
	{"comp":"<b><span style=\"background-color: rgb(38, 38, 38);\">[<font color=\"#ffff87\">\\u</font></span><span style=\"background-color: rgb(218, 218, 218);\"><font color=\"#262626\">@</font></span><span style=\"background-color: rgb(38, 38, 38);\"><font color=\"#afffaf\">\\H</font>]</span></b> <font color=\"#0087ff\">\\W</font><font color=\"#00d7ff\"><b>\\$(__git_ps1)</b></font>&nbsp;<span style=\"background-color: rgb(255, 255, 175);\"><font color=\"#1c1c1c\">\\$</font></span>&nbsp;","out":"\\[\\033[1m\\]\\[\\033[48;5;235m\\][\\[\\033[38;5;228m\\]\\u\\[\\033[0m\\033[1m\\033[48;5;235m\\]\\[\\033[0m\\033[1m\\]\\[\\033[48;5;253m\\]\\[\\033[38;5;235m\\]@\\[\\033[0m\\033[1m\\033[48;5;253m\\]\\[\\033[0m\\033[1m\\]\\[\\033[48;5;235m\\]\\[\\033[38;5;157m\\]\\H\\[\\033[0m\\033[1m\\033[48;5;235m\\]]\\[\\033[0m\\033[1m\\]\\[\\033[0m\\] \\[\\033[38;5;33m\\]\\W\\[\\033[0m\\]\\[\\033[38;5;45m\\]\\[\\033[1m\\]\\$(__git_ps1)\\[\\033[0m\\033[38;5;45m\\]\\[\\033[0m\\]&nbsp;\\[\\033[48;5;229m\\]\\[\\033[38;5;234m\\]\\$\\[\\033[0m\\033[48;5;229m\\]\\[\\033[0m\\]&nbsp;"}
];

/** @param {boolean} if true, preserve the current value of string builder */
window.debug.testBattery = function (keep)
{
	var existing = $('#input').html();
	
	for (test in window.debug.knownTests)
	{
		debug.loadTest(window.debug.knownTests[test]);
	}
	
	if (!keep) $('#input').html(existing).trigger('change');
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