process.title = 'blessedBot';

if (process.argv[2] != undefined) {
	var cmdarg = process.argv[2];
}
if (process.argv[3] != undefined) {
	var cmdline = process.argv[3];
}

if (cmdarg == "-h" || cmdarg == "--help" || cmdarg == "-help" || cmdarg == "?" || cmdarg == "-?") {
	console.log("\nUsage:  nodejs filename.js [-r channel]\n");
	process.exit(1);
} else if (cmdarg == "-r") {
	if (cmdline != undefined) {
	var room = cmdline;
} else {
	console.log("\nUsage:  nodejs filename.js [-r channel]\n");
	process.exit(1);
	}
} else if (cmdarg != undefined) {
	console.log("\nUsage:  nodejs filename.js [-r channel]\n");
	process.exit(1);
} else {
	var room = "programming"; //This is the room you join when the client is started
}

var userName = "blessedBotUser";
var tripCode = "superSecretPassword";
var datafile = "data.txt";

var HackChat = require("hack-chat");
var d, bl, g = 0;
var hour, mins, secs = 0;
var marking = 0;
var fs = require("fs");
var sys = require("sys");
var sys = require("util");
var path = require("path");
var control = true;
var toOutput = "";
var trips = [];
var facts = [];
var babby = [];
var afk = [];
var afkd = -1;
var checkBabby = 0;
var questionRegex = /(?:tell\s+me|what\s*.?\s*s)\s+Truth\s+(?:#|number|no|n)?\s*(\d+)/i;

var chat = new HackChat.Session(room, (userName + "#" + tripCode));

var blessed = require('blessed');

//** Screen Layout **//

var screen = blessed.screen({
	dockBorders: 'true'
});

var chatIn = blessed.textarea({
	bottom: '0',
	left: 'center',
	width: '100%',
	height: '20%',
	label: userName,
	border: {
		type: 'line'
	},
	style: {
		fg: 'green',
		bg: 'black',
		border: {
			fg: '#ffffff'
		}
	}	
});

var consoleBox = blessed.textarea({
	bottom: '0',
	left: 'center',
	hidden: 'true',
	width: '100%',
	height: '20%',
	label: "Console",
	border: {
		type: 'bg',
		ch: '#'
	},
	style: {
		fg: 'green',
		bg: 'black',
		border: {
			fg: '#ffffff'
		}
	}
});

var chatBox = blessed.log({
	top: '0',
	left: '0',
	width: '80%',
	height: '82%',
	content: 'Bot for hack.chat, made by {bold}ElixirX{/bold}! Uses the {bold}blessed{/bold} library.\n\nPress {bold}ENTER{/bold} to type, press {bold}ESC{/bold} to quit typing\nPress {bold}ESC{/bold} again to send the message. Press {bold}Q{/bold} to quit.\nTo show and hide the side panel, use {bold}SPACE{/bold}. Scroll with arrow keys.\nTo enter another channel, type {bold}leave{/bold} in console and then {bold}join "channel name"{/bold}.\nTo toogle command response, type {bold}control{/bold} in console.\n\n\n',
	tags: true,
	label: 'hack.chat/?' + room,
	alwaysScroll: 'true',
	scrollable: 'true',
	scrollbar: {
		bg: 'green',
		fg: 'green'
	},
	border: {
		type: 'line'
	},
	style: {
		fg: 'white',
		bg: 'black',
		border: {
			fg: '#ffffff'
		}
	}
});

var onlineBox = blessed.list({
	rtop: '0',
	right: '0',
	width: '20%',
	height: '82%',
	content: '',
	tags: true,
	label: 'Online Users',
	/*
	alwaysScroll: 'true',
	scrollable: 'true',
	scrollbar: {
	bg: 'green',
	fg: 'green'
	},
	*/
	border: {
		type: 'line'
	},
	selected: {
		bg: 'red'
	},
	item: {
		bg: 'red'
	},
	style: {
		fg: 'white',
		bg: 'black',
		border: {
			fg: '#ffffff'
		}
	}
});

screen.append(onlineBox);
screen.append(chatBox);
screen.append(consoleBox);
screen.append(chatIn);
chatIn.focus();

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function start() {
	setInterval(function() {
		screen.render();
	}, 200);
}

//** Main **//

function irlTime() {
	hour = new Date().getHours();
	mins = new Date().getMinutes();
	secs = new Date().getSeconds();

	if (hour < 10) {
		hour = "0" + hour;
	}
	if (mins < 10) {
		mins = "0" + mins;
	}
	if (secs < 10) {
		secs = "0" + secs;
	}
	return ("[" + hour + ":" + mins + ":" + secs + "] ");
}

var ChatListen = function() {};

function main() {
	screen.on('keypress', function(ch, key) {
	if (key.name === 'q' || key.name === 'C-c' || key.name === 'S-c') {
		return process.exit(0);
	}
	if (key.name === 'space') {
		onlineBox.toggle();
		if (onlineBox.hidden) {
			chatBox.width = '100%';
			return 0;
		} else {
			chatBox.width = '80%';
			return 1;
		}
	}
	if (key.name === 'c') {
		consoleBox.toggle();
		chatIn.toggle();
		return 0;
	}
	if (key.name === 'up') {
		return chatBox.scroll(-1);
	}
	if (key.name === 'down') {
		return chatBox.scroll(1);
	}
	if (key.name === 'enter') {
		if (chatIn.hidden === false) {
			return chatIn.readInput();
		} else {
			return consoleBox.readInput();
		}
	}
	if (key.name === 'escape') {
		if (chatIn.hidden === false) {
			if (chatIn.value !== "") {
				chat.sendMessage(chatIn.value);
				return chatIn.clearValue();
				}
			} else {
				if (consoleBox.value !== "") {
					var cmd = consoleBox.value;
					if (cmd === 'leave') {
						chat.leave();
						chatBox.pushLine(irlTime() + userName + " {bold}(you){/bold} left.");
						onlineBox.clearItems();
					}
					if (cmd.substring(0, 4) === 'join' && cmd.substring(5, cmd.length) != undefined && cmd.substring(5, cmd.length) != "") {
						room = cmd.substring(5, cmd.length);
						chat = new HackChat.Session(room, (userName + "#" + tripCode));
						chatBox.pushLine(irlTime() + userName + " {bold}(you){/bold} joined channel ?" + room + ".");
						ChatListen();
					}
					if (cmd === 'control') {
						if (control) {
							control = false;
							chatBox.pushLine(irlTime() + "Bot control {bold}off{/bold}.");
						} else {
							control = true;
							chatBox.pushLine(irlTime() + "Bot control {bold}on{/bold}.");
						}
					}
					return consoleBox.clearValue();
				}
			}
		}
	});
return start();
}

main();

fs.readFile(path.join(__dirname, datafile), "utf8", function(err, data) {
	var p, i, line;
	if (err) {
	throw err;
}
var lines = data.split("\n");

for (i = 0; i < lines.length; i++) {
	line = lines[i].trim();
	if (line[0] === '#') {
		continue;
	}
	if (line.length === 0) {
		continue;
	}
	facts.push(line);
}
if (facts.length === 0) {
	chatBox.content = chatBox.content + "\n" + "No truths found.";
	return;
}

var lastMessage = new Date().getTime();
var lastQuote = new Date().getTime();

function include(arr, obj, markIt) {
	for (i = 0; i < arr.length; i++) {
		if (markIt) {
			marking = i;
		}
		if (arr[i] == obj) {
			return true;
		}
	}
}

function saveSend(message, latexify) {
	lastMessage = new Date().getTime();
	if (latexify != 0) {
	message = message.replace(/~/g, "\\ ");
	message = message.replace(/\^/g, "\\ ");
	message = message.replace(/\\/g, "\\ ");
	message = message.replace(/ /g, "\\ ");
	message = message.replace(/_/g, "\\ ");
	message = message.replace(/\?/g, "? ");
	message = message.replace(/{/g, "");
	message = message.replace(/}/g, "");
		if (latexify === 1) {
			message = message.replace(/\\\\/g, "\\");
			message = message.replace(/\$/g, "\\$");
			message = message.replace(/\>/g, "\\>");
			message = message.replace(/\</g, "\\<");
			message = message.replace(/#/g, "\\#");
			message = message.replace(/%/g, "\\%");
			message = message.replace(/&/g, "\\&");
		} else {
			message = message.replace(/\|/g, "\\ ");
			message = message.replace(/\$/g, "\\ ");
			message = message.replace(/\>/g, "\\ ");
			message = message.replace(/\</g, "\\ ");
			message = message.replace(/#/g, "\\ ");
			message = message.replace(/%/g, "\\ ");
			message = message.replace(/&/g, "\\ ");
			message = message.replace(/\\/g, "\\ ");
		}
	}

	if (latexify === 1) {
	message = "$" + message + " $";
		d = 0;
		for (i = 0; i < message.length; i++) {
			d++;
			if (d > 80 && message.substring(i, i + 1) === " ") {
				message = message.substring(0, i) + " $ \n $ ~ " + message.substring(i + 1, message.length)
				d = 0;
			}
		}
	} else if (latexify === 2) {
		message = "$\\text\{" + message + "\}$";
	} else if (latexify === 3) {
		message = "$\\tiny\{\\text\{" + message + "\}\}$";
	} else if (latexify === 4) {
		message = "$\\small\{\\text\{" + message + "\}\}$";
	} else if (latexify === 5) {
		message = "$\\large\{\\text\{" + message + "\}\}$";
	} else if (latexify === 6) {
		message = "$\\huge\{\\text\{" + message + "\}\}$";
	}
	chat.sendMessage(message);
}

function saveInvite(nickname) {
	chat.invite(nickname);
}

function centerText(line, width) {
	var output = "";
	for (var i = 0; i < (width - line.length) / 2 - 1; i++) {
		output = output + ' ';
	}
	output = output + line;
	for (var i = 0; i < ((width - line.length) / 2 + 1); i++) {
		output = output + ' ';
	}
	if (line.length % 2 == 1) {
		output = output.substring(0, output.length - 1);
	}
	return output;
}

//** CHAT LISTENERS **//

ChatListen = function() {

chat.on("ratelimit", function(time) {
	chatBox.pushLine("####################\n!!! RATE LIMITED !!!\n####################");
});

chat.on("invited", function(nick, channel, time) {
	chatBox.pushLine("### Sent invitation to channel: ?" + channel + " for " + nick + " ###");
});

chat.on("invitation", function(nick, channel, time) {
	chatBox.pushLine("### Got invited to channel: ?" + channel + " by " + nick + " ###");
});

chat.on("warn", function(text) {
	chatBox.pushLine("*WARN*: " + text);
});

chat.on("error", function(err) {
	chatBox.pushLine("ERROR: " + err);
});

chat.on("banned", function(time) {
	chatBox.pushLine("!!! {bold}BANNED{/bold}: You are banned. !!!");
});

chat.on("info", function(text) {
	chatBox.pushLine("*INFO*: " + text);
});

chat.on("nicknameInvalid", function(time) {
	chatBox.pushLine("\n" + "\n\n!!! This nickname has invalid characters! (" + userName + ")");
	process.exit()
});

chat.on("nicknameTaken", function(time) {
	chatBox.pushLine("\n" + "\n\n!!! Some cunt stole this bot's nickname and is in the channel! (" + userName + ") !!!\n\n");
	process.exit()
});

chat.on("onlineSet", function(nicks) {
	chatBox.pushLine("\n" + irlTime() + userName + " {bold}(you){/bold} joined.");
	onlineBox.add("");

	for (var p = 0; p < nicks.length; p++) {
		if (nicks[p] === "ElixirX" || nicks[p] === "Rhondo" || nicks[p] === userName) {
			onlineBox.add("{bold}" + nicks[p] + "{/bold}");
		} else {
			onlineBox.add(nicks[p]);
		}
	}
});

chat.on("onlineAdd", function(nick) {
	hour = new Date().getHours();
	mins = new Date().getMinutes();
	secs = new Date().getSeconds();

	if (hour < 10)
		hour = "0" + hour;
	if (mins < 10)
		mins = "0" + mins;
	if (secs < 10)
		secs = "0" + secs;

	chatBox.pushLine(irlTime() + nick + " joined.");
	//Highlight certain usernames
	if (nick === "ElixirX" || trip === "nNoV44") {
		onlineBox.add("{bold}" + nick + "{/bold}");
	} else {
		onlineBox.add(nick);
	}
});

chat.on("onlineRemove", function(nick) {
	hour = new Date().getHours();
	mins = new Date().getMinutes();
	secs = new Date().getSeconds();

	if (hour < 10)
		hour = "0" + hour;
	if (mins < 10)
		mins = "0" + mins;
	if (secs < 10)
		secs = "0" + secs;

	chatBox.pushLine(irlTime() + nick + " left.");

	for (var ite = 0; ite < onlineBox.items.length; ite++) {
		var checkingNick = escape(onlineBox.items[ite].getLines());
		if (checkingNick == nick || checkingNick == "%1B%5B1m" + nick + "%1B%5B22m") {
			onlineBox.removeItem(ite);
		}
	}
});

//**   The fun stuff happens down here   **//

chat.on("chat", function(nick, text, time, isAdmin, trip) {

if (trip === "undefined") {
	chatBox.pushLine(irlTime() + "       # " + nick + ": " + text);
} else {
	chatBox.pushLine(irlTime() + trip + " # " + nick + ": " + text);
}

toOutput = "";
// Checks if the last message was sent in less than 4 seconds and if the message
// wasn't sent by the bot itself, as well as if control is turned off
if (lastMessage - new Date().getTime() < -4000 && nick != userName && control) {

	for (g = 0; g < afk.length; g++) {
		if (afk[g] === nick) {
			afkd = g;
		}
	}

	if (afkd === -1) {
		if (text.indexOf("*afk") > -1) {
			afk.push(nick);
			afkd = -1;
			return saveSend("~ @" + nick + " is AWAY.", 0);
		}
	}

	if (afkd > -1) {
		afk.splice(afkd, 1);
		afkd = -1;
		return saveSend("~ @" + nick + " is BACK.", 0);
	} afkd = -1;

	if (text.trim() == "*off" && trip == "nNoV44"){
		return saveSend("Closing.", 1);
		process.exit();
	}

	if (text.substring(0, 6).trim() == "*mute" && trip == "nNoV44"){
		if(text.substring(6,text.length).trim() != "ElixirX" && text.substring(6,text.length).trim() != userName ){
			muted.push(text.substring(6,text.length).trim());
			return saveSend(text.substring(6,text.length).trim()+" has been muted.", 1);
		}
	}

	if (text.substring(0, 8).trim() == "*unmute" && trip == "nNoV44"){
		var indexOut = muted.indexOf(text.substring(8,text.length).trim());
		if( indexOut != -1){
			muted.splice(indexOut, 1);
			return saveSend(text.substring(8,text.length).trim()+" has been unmuted.", 1);
		}
	}

	if (text == "*invite") {
		//Exclude access to certain users
		if (trip === "nNoV44") {
			return saveSend("Specify invite recipient, syntax:\n  *invite (user)", 0);
		} else {
			return saveSend("I'm not letting you do that.", 2);
		}
	} else if (text.substring(0, 8) == "*invite ") {
		//Exclude access to certain users
		if (trip === "nNoV44") {
			if (text.substring(8, text.length).trim() == "") {
				return saveSend("Specify invite recipient, syntax: \n  *invite (user)", 0);
			} else {
				saveInvite(text.substring(8, text.length).trim());
				return saveSend("I sent an invite to user " + text.substring(8, text.length).trim() + ", if they exist.", 0);
			}
		} else {
			return saveSend("I'm not letting you do that.", 0);
		}
	}


	if (text == "*help" || text == "*h")
		return saveSend("Help? Hah! There's no help to get.", 0);

	if (text.substring(0, 8) == "*repeat ") {
		//Exclude access to certain users
		if (trip === "nNoV44") {
			return saveSend(text.substring(8, text.length), 0);
		} else {
			return saveSend(text.substring(8, text.length), 0);
		}
	}

//** Homebrew commands below **//

	if (text ==  "*g")
		return saveSend("HELLU FAGGITS!", 0);

	if (text == "*b")
		return saveSend("BAH NA NANA NAH!", 0);
	
		if (text == "*wew")
		return saveSend("WEWSTERS", 0);

	if (text == "*cain")
		return saveSend("The guy who had an IQ around 160 at 10 and like to brag about how fast can type.", 0);
	
	if (text == "*randyredstone")
		return saveSend("The weeb who saw the site's cert was expired and then joined to call everyone noobs and say he was tooty to later leave.", 0);
	
	if (text == "*bingulinho")
		return saveSend("The guy who wanted modBot deep inside his anal cavity.", 0);
	
	if (text == "*movansas")
		return saveSend("He'd worked for Steve Jobs and stole his files for unfinished projects. We were gonna be all over the world he said, but we needed to pay $1200 for a laptop, food, clothes etc. We gave him our credit card numbers then he left.", 0);
	
	if (text == "*deepcoma")
		return saveSend("The guy who told everyone to join tooty's chat so we wouldn't have to handle a spamming curry cunt with a VPN but he said it in chat where the batshit crazy curry cunt could read it.", 	0);

	if (text == "*currycunt")
		return saveSend("This batshit crazy curry cunt spamming chat for dayz. He's a 14 year old in Meruut, India and he has a VPN. He also tried to DDoS me with vBooter.", 0);	
	
	if (text == "*bossface")
		return saveSend("Bossface couldn't handle all the new haxor terms so he left 56 seconds after he joined hack.chat.", 0);

	if (text == "*hami")
		return saveSend("Hami is a human being (We think) which shall never reproduce. If you ever meet Hami cut his balls off fast AF.", 0);

	if (text == "*bio")
		return saveSend("ElixirX is an lesbian, Swedish guy with blue hair he's also the kidnapper of this bot.", 0);

	if (text == "*hentai")
		return saveSend("Don't be a retard bout hentai...you will get banned", 0);	

	if (text == "*ukjoke")
		return saveSend("All countries have an independence day except the UK cuz they were the the ones everyone wanted independence from", 0);		

	if (text == "*ignorenontrip")
		return saveSend("You are now ignoring all users without a trip.", 0);	
	
	if (text == "*kidnappedbot")
		return saveSend("Help me plez I was kidnapped from Rhondo", 0);

	if (text == "*legend27")
		return savesend("https://www.youtube.com/watch?v=XftTdTpQIsU", 0);

	if (text == "*hackerman")
		return saveSend("https://i.ytimg.com/vi/KEkrWRHCDQU/maxresdefault.jpg", 0);

	if (text == "*hitler")
		return saveSend("https://www.youtube.com/watch?v=3gHHq-pUuSQ", 0);

	if (text == "*devrant")
		return saveSend("https://www.devrant.io", 0);

	if (text == "*cyberspace")
		return saveSend("https://www.youtube.com/watch?v=8ZBbo-6rlG0", 0);

	if (text == "*safesite")
		return saveSend("http://unrealsecurity.net/xploit", 0);

	if (text == "*idkwtf")
		return saveSend("http://imgur.com/gallery/SAWYkBZ", 0);
	
	if (text == "*rhondo")
		return saveSend("Rhondonize was an amazing person", 0);

	var result = questionRegex.exec(text);
	if (result && result.length == 2) {
		var n = parseInt(result[1]) - 1;
		if (n >= 0 && n < facts.length)
			saveSend("Truth #" + (n + 1) + ": " + facts[n], 0);
	}

	} else if (control === false) {
		if (text.substring(0, 1) === "*") {
			saveSend("* I'm not taking any commands right now *", 0);
		}
	} else if (nick === userName) {
		//This is the bot's own message to the user
	} else {
		chatBox.pushLine("{bold}### Messages are being sent too fast, ignoring ###{/bold}");
	}
});

chat.on("joining", function() {

	//Message to be sent on joining a room, one after a 3000 delay after the other
	setTimeout(function() {
		//saveSend("I'M ON",0);
		setTimeout(function() {
			//saveSend("AND READY FOR ACTION BITCHES.",0);
		}, 3000)
	}, 3000)

	setInterval(function() {
		chat.ping(); //KEEP ALIVE
	}, 0.4 * 60 * 1000);
});
}
//Runs the function to listen for content from the websocket through hackchat's session
ChatListen();
});

//Uploaded in the memory of Rhondonize <3
// . .-.. .. -..- .. .-. -..-
