installation
===
open index.html in any modern browser (chrome, saf, ff, IE10+)

terminal setup
===
this program generates terminal control sequences meant to be consumed by vt100 256 color-compatible terminals! before you conclude that they're not working for you, make sure screen or tmux aren't getting in the way and that your desktop terminal application actually suports 8bit terms.

if this is all true, make sure you've got 

	export TERM=xterm-color
	export CLICOLOR=1

in your bashrc or bash_profile.

if you are using screen, be sure to have a screenrc file that looks something like this:

	attrcolor b ".I"
	termcapinfo xterm 'Co#256:AB=\E[48;5;%dm:AF=\E[38;5;%dm'
	termcapinfo xterm-color "Co#256:AB=\E[48;5;%dm:AF=\E[38;5;%dm"
	defbce "on"

problems?
===
If you find a PS1 that doesn't work (you can test it by going bash -e "{ouput}" in the shell) open the javascript interpreter in your browser and type `debug.dumpTest()` copy the output and file it with your bug report =)

if you want to test the rendering codepath, type `debug.testBattery()` and make sure you get a lot of good looking output.

browsers
===
if you're not using a reasonable browser, this program is not going to work! it requires "new" browser features like contenteditable and a reasonable interface into ther user's current text selection.