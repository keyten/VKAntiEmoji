// ==UserScript==
// @name          VKAntiEmoji
// @namespace     http://github.com/keyten/VKAntiEmoji
// @description   Disables emoji in vk messages / wall / etc.
// @author        Dmitriy Miroshnichenko aka Keyten
// @license       MIT
// @version       1.0
// @include       *vk.com*
// @exclude       %exclude%
// @grant         none
// ==/UserScript==

(function (window, undefined) {
	if (typeof unsafeWindow != undefined) {
		window = unsafeWindow;
	} else {
		window = window;
	}

	if (window.self != window.top) {
		return;
	}

	// the list: https://vk.com/emoji_vk
	var emoji = [
			':-)', ':-D', ';-)', 'xD', ';-P', ':-p', '8-)', 'B-)',
			':-(', ';-]', '3(', ':\'(', ':_(', ':((', ':o', ':|',
			'3-)', 'O:)', ';o', '8o', '8|', ':X', '<3', ':-*', '>(',
			'>((', ':-]', '}:)', 'XD'
		],

		hiddenSymbol = 8292,
		hiddenSymbol2 = 4448,
		dotSymbol = 787,
		topDotSymbol = 729,

		modes = {
			'hidden': function(text){
				return emoji.forEach(function(letter){
					text = text.split(letter).join(letter[0] + String.fromCharCode(hiddenSymbol) + letter.substring(1));
				}), text;
			},
			// doesn't works in webkit (chrome, opera, maybe safari)
			'hidden2': function(text){
				return emoji.forEach(function(letter){
					text = text.split(letter).join(letter[0] + String.fromCharCode(hiddenSymbol2) + letter.substring(1));
				}), text;
			},
			'dot': function(text){
				return emoji.forEach(function(letter){
					text = text.split(letter).join(letter[0] + String.fromCharCode(dotSymbol) + letter.substring(1));
				}), text;
			},
			'topDot': function(text){
				return emoji.forEach(function(letter){
					text = text.split(letter).join(String.fromCharCode(topDotSymbol) + letter);
				}), text;
			}
		},
		mode = window.localStorage.getItem('emojiDisableMode') || 'hidden',

		css = window.localStorage.getItem('emojiDisableCSS') || true;

	function emojiProcess(){

		// xhr processing
		var _send = window.XMLHttpRequest.prototype.send;
		window.XMLHttpRequest.prototype.send = function(message){
			if(!message || message.indexOf('msg=') == -1)
				return _send.apply(this, arguments);
			var text = decodeURIComponent(message.split('msg=')[1].split('&')[0]),
				firstPart = message.split('msg=')[0],
				lastPart = message.split('msg=')[1].split('&').slice(1).join('&');
			var args = [].slice.call(arguments);
			args[0] = (firstPart + 'msg=' + encodeURIComponent(modes[mode](text)) + '&' + lastPart);
			return _send.apply(this, args);
		};

		// client preprocessing
		if(window.Emoji){
			window.Emoji.getEmojiHTML = function(a){ return window.Emoji.cssEmoji[a][1]; };
			window.Emoji.addEmoji = function(){};
		}
	}

	function cssProcess(){
		var s = window.document.createElement('style');
		s.textContent = '#im_rcemoji_cont { display: none; }';
		window.document.body.appendChild(s);
	}

	if (/https?:\/\/vk.com/.test(window.location.href)) {
		emojiProcess();
		if(css)
			cssProcess();
	}


})(window);
