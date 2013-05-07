window.debug = {};

window.debug.knownTests = [
	{"comp":"XXX<span style=\"background-color: rgb(0, 0, 255);\">XXX</span><font color=\"#ffff00\" style=\"background-color: rgb(0, 0, 255);\">XX<u>XX</u></font><span style=\"background-color: rgb(0, 0, 255);\"><u>XXXXXXXXXXXX</u></span><font color=\"#ffff00\" style=\"background-color: rgb(0, 0, 255);\"><u>XX</u>X</font><span style=\"background-color: rgb(0, 0, 255);\">XXX</span>XXX","out":"XXX\\[\\033[48;5;21m\\]XXX\\]\\033[0m\\]\\[\\033[38;5;226m\\033[48;5;21m\\]XX\\033[4m\\[\\033[4m\\]XX\\]\\033[0m\\033[38;5;226m\\033[48;5;21m\\]\\]\\033[0m\\]\\[\\033[48;5;21m\\]\\033[4m\\[\\033[4m\\]XXXXXXXXXXXX\\]\\033[0m\\033[48;5;21m\\]\\]\\033[0m\\]\\[\\033[38;5;226m\\033[48;5;21m\\]\\033[4m\\[\\033[4m\\]XX\\]\\033[0m\\033[38;5;226m\\033[48;5;21m\\]X\\]\\033[0m\\]\\[\\033[48;5;21m\\]XXX\\]\\033[0m\\]XXX"},
	{"comp":"the&nbsp;<div>quick&nbsp;</div><div>brown</div><div>fox</div><div><br></div><div>foo</div>","out":"the&nbsp;\\nquick&nbsp;\\nbrown\\nfox\\n\\nfoo"},
	{"comp":"The quick <span style=\"background-color: rgb(0, 0, 255);\">brown <font color=\"#ff0000\">fox </font></span><span style=\"background-color: rgb(255, 255, 0);\"><font color=\"#ff0000\">jumped over</font> the</span> lazy dog.","out":"The quick \\[\\033[48;5;21m\\]brown \\[\\033[38;5;196m\\]fox \\]\\033[0m\\033[48;5;21m\\]\\]\\033[0m\\]\\[\\033[48;5;226m\\]\\[\\033[38;5;196m\\]jumped over\\]\\033[0m\\033[48;5;226m\\] the\\]\\033[0m\\] lazy dog."},
	{"comp":"The quick <span style=\"background-color: rgb(0, 0, 255);\">brown <font color=\"#ff0000\">fox </font></span><span style=\"background-color: rgb(255, 255, 0);\"><font color=\"#ff0000\">jumpe<b>d&nbsp;</b></font></span><div><span style=\"background-color: rgb(255, 255, 0);\"><font color=\"#ff0000\"><b><br></b></font></span></div><div><span style=\"background-color: rgb(255, 255, 0);\"><font color=\"#ff0000\"><b>o</b>ver</font> the</span> lazy dog.&nbsp;</div><div><br></div><div>foo</div>","out":"The quick \\[\\033[48;5;21m\\]brown \\[\\033[38;5;196m\\]fox \\]\\033[0m\\033[48;5;21m\\]\\]\\033[0m\\]\\[\\033[48;5;226m\\]\\[\\033[38;5;196m\\]jumpe\\033[1m\\[\\033[1m\\]d&nbsp;\\]\\033[0m\\033[48;5;226m\\033[38;5;196m\\]\\]\\033[0m\\033[48;5;226m\\]\\]\\033[0m\\]\\n\\[\\033[48;5;226m\\]\\[\\033[38;5;196m\\]\\033[1m\\[\\033[1m\\]\\]\\033[0m\\033[48;5;226m\\033[38;5;196m\\]\\]\\033[0m\\033[48;5;226m\\]\\]\\033[0m\\]\\n\\[\\033[48;5;226m\\]\\[\\033[38;5;196m\\]\\033[1m\\[\\033[1m\\]o\\]\\033[0m\\033[48;5;226m\\033[38;5;196m\\]ver\\]\\033[0m\\033[48;5;226m\\] the\\]\\033[0m\\] lazy dog.&nbsp;\\n\\nfoo"},
	{"comp":"The q<u>ui</u><u style=\"background-color: rgb(255, 0, 0);\">ck</u><span style=\"background-color: rgb(255, 0, 0);\">&nbsp;bro</span><span style=\"background-color: rgb(0, 0, 255);\">wn&nbsp;</span><b><span style=\"background-color: rgb(0, 0, 255);\">fox ju</span><span style=\"background-color: rgb(255, 0, 0);\">m</span><u style=\"background-color: rgb(255, 0, 0);\">pe</u></b><span style=\"background-color: rgb(255, 0, 0);\">d o</span><b><u style=\"background-color: rgb(255, 0, 0);\">v</u></b>e<b><u style=\"background-color: rgb(255, 0, 0);\">r</u><span style=\"background-color: rgb(255, 0, 0);\">&nbsp;the lazy&nbsp;</span>do</b>g.","out":"The q\\033[4m\\[\\033[4m\\]ui\\]\\033[0m\\]\\033[4m\\[\\033[4m\\033[48;5;196m\\]ck\\]\\033[0m\\]\\[\\033[48;5;196m\\]&nbsp;bro\\]\\033[0m\\]\\[\\033[48;5;21m\\]wn&nbsp;\\]\\033[0m\\]\\033[1m\\[\\033[1m\\]\\[\\033[48;5;21m\\]fox ju\\]\\033[0m\\033[1m\\]\\[\\033[48;5;196m\\]m\\]\\033[0m\\033[1m\\]\\033[4m\\[\\033[4m\\033[48;5;196m\\]pe\\]\\033[0m\\033[1m\\]\\]\\033[0m\\]\\[\\033[48;5;196m\\]d o\\]\\033[0m\\]\\033[1m\\[\\033[1m\\]\\033[4m\\[\\033[4m\\033[48;5;196m\\]v\\]\\033[0m\\033[1m\\]\\]\\033[0m\\]e\\033[1m\\[\\033[1m\\]\\033[4m\\[\\033[4m\\033[48;5;196m\\]r\\]\\033[0m\\033[1m\\]\\[\\033[48;5;196m\\]&nbsp;the lazy&nbsp;\\]\\033[0m\\033[1m\\]do\\]\\033[0m\\]g."}
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