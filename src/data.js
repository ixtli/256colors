// top level object
window.data = {};

// the index of the array is the vt100 256color code value in hex
window.data.codeArray = [
"000000", "800000", "008000", "808000", "000080", "800080", "008080", "c0c0c0",
"808080", "ff0000", "00ff00", "ffff00", "0000ff", "ff00ff", "00ffff", "ffffff",
"000000", "00005f", "000087", "0000af", "0000d7", "0000ff", "005f00", "005f5f",
"005f87", "005faf", "005fd7", "005fff", "008700", "00875f", "008787", "0087af",
"0087d7", "0087ff", "00af00", "00af5f", "00af87", "00afaf", "00afd7", "00afff",
"00d700", "00d75f", "00d787", "00d7af", "00d7d7", "00d7ff", "00ff00", "00ff5f",
"00ff87", "00ffaf", "00ffd7", "00ffff", "5f0000", "5f005f", "5f0087", "5f00af",
"5f00d7", "5f00ff", "5f5f00", "5f5f5f", "5f5f87", "5f5faf", "5f5fd7", "5f5fff",
"5f8700", "5f875f", "5f8787", "5f87af", "5f87d7", "5f87ff", "5faf00", "5faf5f",
"5faf87", "5fafaf", "5fafd7", "5fafff", "5fd700", "5fd75f", "5fd787", "5fd7af",
"5fd7d7", "5fd7ff", "5fff00", "5fff5f", "5fff87", "5fffaf", "5fffd7", "5fffff",
"870000", "87005f", "870087", "8700af", "8700d7", "8700ff", "875f00", "875f5f",
"875f87", "875faf", "875fd7", "875fff", "878700", "87875f", "878787", "8787af",
"8787d7", "8787ff", "87af00", "87af5f", "87af87", "87afaf", "87afd7", "87afff",
"87d700", "87d75f", "87d787", "87d7af", "87d7d7", "87d7ff", "87ff00", "87ff5f",
"87ff87", "87ffaf", "87ffd7", "87ffff", "af0000", "af005f", "af0087", "af00af",
"af00d7", "af00ff", "af5f00", "af5f5f", "af5f87", "af5faf", "af5fd7", "af5fff",
"af8700", "af875f", "af8787", "af87af", "af87d7", "af87ff", "afaf00", "afaf5f",
"afaf87", "afafaf", "afafd7", "afafff", "afd700", "afd75f", "afd787", "afd7af",
"afd7d7", "afd7ff", "afff00", "afff5f", "afff87", "afffaf", "afffd7", "afffff",
"d70000", "d7005f", "d70087", "d700af", "d700d7", "d700ff", "d75f00", "d75f5f",
"d75f87", "d75faf", "d75fd7", "d75fff", "d78700", "d7875f", "d78787", "d787af",
"d787d7", "d787ff", "dfaf00", "dfaf5f", "dfaf87", "dfafaf", "dfafdf", "dfafff",
"dfdf00", "dfdf5f", "dfdf87", "dfdfaf", "dfdfdf", "dfdfff", "dfff00", "dfff5f",
"dfff87", "dfffaf", "dfffdf", "dfffff", "ff0000", "ff005f", "ff0087", "ff00af",
"ff00df", "ff00ff", "ff5f00", "ff5f5f", "ff5f87", "ff5faf", "ff5fdf", "ff5fff",
"ff8700", "ff875f", "ff8787", "ff87af", "ff87df", "ff87ff", "ffaf00", "ffaf5f",
"ffaf87", "ffafaf", "ffafdf", "ffafff", "ffdf00", "ffdf5f", "ffdf87", "ffdfaf",
"ffdfdf", "ffdfff", "ffff00", "ffff5f", "ffff87", "ffffaf", "ffffdf", "ffffff",
"080808", "121212", "1c1c1c", "262626", "303030", "3a3a3a", "444444", "4e4e4e",
"585858", "626262", "6c6c6c", "767676", "808080", "8a8a8a", "949494", "9e9e9e",
"a8a8a8", "b2b2b2", "bcbcbc", "c6c6c6", "d0d0d0", "dadada", "e4e4e4", "eeeeee"
];

// the hex value as a padded string is the key for the vt100 color code
window.data.reverseLookup = {
	"121212":233, "262626":235, "303030":236, "444444":238, "585858":240,
	"626262":241, "767676":243, "800000":01, "800080":05, "808000":03,
	"808080":08, "870000":88, "870087":90, "878700":100, "878787":102,
	"949494":246, "87875f":101, "8787af":103, "8787d7":104, "8787ff":105,
	"87af00":106, "87af5f":107, "87af87":108, "87afaf":109, "87afd7":110,
	"87afff":111, "87d700":112, "87d75f":113, "87d787":114, "87d7af":115,
	"87d7d7":116, "87d7ff":117, "87ff00":118, "87ff5f":119, "87ff87":120,
	"87ffaf":121, "87ffd7":122, "87ffff":123, "af0000":124, "af005f":125,
	"af0087":126, "af00af":127, "af00d7":128, "af00ff":129, "af5f00":130,
	"af5f5f":131, "af5f87":132, "af5faf":133, "af5fd7":134, "af5fff":135,
	"af8700":136, "af875f":137, "af8787":138, "af87af":139, "af87d7":140,
	"af87ff":141, "afaf00":142, "afaf5f":143, "afaf87":144, "afafaf":145,
	"afafd7":146, "afafff":147, "afd700":148, "afd75f":149, "afd787":150,
	"afd7af":151, "afd7d7":152, "afd7ff":153, "afff00":154, "afff5f":155,
	"afff87":156, "afffaf":157, "afffd7":158, "afffff":159, "d70000":160,
	"d7005f":161, "d70087":162, "d700af":163, "d700d7":164, "d700ff":165,
	"d75f00":166, "d75f5f":167, "d75f87":168, "d75faf":169, "d75fd7":170,
	"d75fff":171, "d78700":172, "d7875f":173, "d78787":174, "d787af":175,
	"d787d7":176, "d787ff":177, "dfaf00":178, "dfaf5f":179, "dfaf87":180,
	"dfafaf":181, "dfafdf":182, "dfafff":183, "dfdf00":184, "dfdf5f":185,
	"dfdf87":186, "dfdfaf":187, "dfdfdf":188, "dfdfff":189, "dfff00":190,
	"dfff5f":191, "dfff87":192, "dfffaf":193, "dfffdf":194, "dfffff":195,
	"ff0000":09, "ff005f":197, "ff0087":198, "ff00af":199, "ff00df":200,
	"ff00ff":13, "ff5f00":202, "ff5f5f":203, "ff5f87":204, "ff5faf":205,
	"ff5fdf":206, "ff5fff":207, "ff8700":208, "ff875f":209, "ff8787":210,
	"ff87af":211, "ff87df":212, "ff87ff":213, "ffaf00":214, "ffaf5f":215,
	"ffaf87":216, "ffafaf":217, "ffafdf":218, "ffafff":219, "ffdf00":220,
	"ffdf5f":221, "ffdf87":222, "ffdfaf":223, "ffdfdf":224, "ffdfff":225,
	"ffff00":11, "ffff5f":227, "ffff87":228, "ffffaf":229, "ffffdf":230,
	"ffffff":15, "080808":232, "1c1c1c":234, "3a3a3a":237, "4e4e4e":239,
	"6c6c6c":242, "8a8a8a":245, "9e9e9e":247, "a8a8a8":248, "b2b2b2":249,
	"bcbcbc":250, "c6c6c6":251, "d0d0d0":252, "dadada":253, "e4e4e4":254,
	"eeeeee":255, "000000":16, "008000":02, "000080":04, "008080":06,
	"c0c0c0":07, "00ff00":46, "0000ff":21, "00ffff":51, "00005f":17,
	"000087":18, "0000af":19, "0000d7":20, "005f00":22, "005f5f":23,
	"005f87":24, "005faf":25, "005fd7":26, "005fff":27, "008700":28,
	"00875f":29, "008787":30, "0087af":31, "0087d7":32, "0087ff":33,
	"00af00":34, "00af5f":35, "00af87":36, "00afaf":37, "00afd7":38,
	"00afff":39, "00d700":40, "00d75f":41, "00d787":42, "00d7af":43,
	"00d7d7":44, "00d7ff":45, "00ff5f":47, "00ff87":48, "00ffaf":49,
	"00ffd7":50, "5fff00":82, "5fff5f":83, "5fff87":84, "5fffaf":85,
	"5fffd7":86, "5fffff":87, "5fd700":76, "5fd75f":77, "5fd787":78,
	"5fd7af":79, "5fd7d7":80, "5fd7ff":81, "5faf00":70, "5faf5f":71,
	"5faf87":72, "5fafaf":73, "5fafd7":74, "5fafff":75, "5f8700":64,
	"5f875f":65, "5f8787":66, "5f87af":67, "5f87d7":68, "5f87ff":69,
	"5f5f00":58, "5f5f5f":59, "5f5f87":60, "5f5faf":61, "5f5fd7":62,
	"5f5fff":63, "5f0000":52, "5f005f":53, "5f0087":54, "5f00af":55,
	"5f00d7":56, "5f00ff":57, "8700ff":93, "8700d7":92, "8700af":91,
	"87005f":89, "875fff":99, "875fd7":98, "875faf":97, "875f87":96,
	"875f5f":95, "875f00":94
};

window.data.shortcuts = {
	
	'style fxns' :
	{
		'clear' : ['removeFormat', 'clear style from selected text'],
		'bold' : ['bold', 'set the selected text to bold'],
		'underline' : ['underline', 'set selected text to underline']
	},
	
	'ps1 shortcuts' :
	{
		'long date'			: ['\\d', 'the date in "Weekday Month Date" format'],
		'custom date'		: ['\\D{format}', 'the format is passed to strftime(3)'],
		'full hostname'	: ['\\H', 'the hostname'],
		'job count'			: ['\\j', 'the number of jobs currently managed by the shell'],
		'base dev. name': ['\\l', 'the basename of the shell\'s terminal device name'],
		'newline'				: ['\\n', 'newline'],
		'carriage return': ['\\r', 'carriage return'],
		'shell name'		: ['\\s', 'the  name  of  the shell, the basename of $0 ' +
			'(the portion following the final slash)'],
		'24hr full time': ['\\t', 'the current time in 24-hour HH:MM:SS format'],
		'12hr full time': ['\\T', 'the current time in 12-hour HH:MM:SS format'],
		'12hr time'			: ['\\@', 'the current time in 12-hour am/pm format'],
		'24hr time'			: ['\\A', 'the current time in 24-hour HH:MM format'],
		'username'			: ['\\u', 'the username of the current user'],
		'version'				: ['\\v', 'the version of bash (e.g., 2.00)'],
		'long version'	: ['\\V', 'the release version of bash, v + patch num'],
		'relative cwd'	: ['\\w', 'the current working directory, with $HOME ' +
			'abbreviated with a tilde'],
		'basename cwd'	: ['\\W', 'the basename of the current working directory, '+
			'with $HOME abbreviated with a tilde'],
		'command hist #': ['\\!', 'the history number of this command'],
		'command number': ['\\#', 'the command number of this command'],
		'cond. prompt'	: ['\\$', 'if the effective UID is 0, a #, otherwise a $'],
		'backslash'			: ['\\\\', 'a backslash']
	}
};
