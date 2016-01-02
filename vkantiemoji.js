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
	if (typeof unsafeWindow !== 'undefined') {
		window = unsafeWindow;
	} else {
		window = window;
	}

	if (window.self != window.top) {
		return;
	}

	if (!/https?:\/\/vk.com/.test(window.location.href)) {
		return;
	}

	// the list: https://vk.com/emoji_vk
	var emojiList = [
			':-)', ':-D', ';-)', 'xD', ';-P', ':-p', '8-)', 'B-)',
			':-(', ';-]', '3(', ':\'(', ':_(', ':((', ':o', ':|',
			'3-)', 'O:)', ';o', '8o', '8|', ':X', '<3', ':-*', '>(',
			'>((', ':-]', '}:)', 'XD'
		],

		hiddenSymbol = 8292,
		hide = function(text){
			console.log(text);
			emojiList.forEach(function(letter){
				text = text.split(letter).join(letter[0] + String.fromCharCode(hiddenSymbol) + letter.substring(1));
			});
			return text;
		};

	// messages interception
	var post = window.ajax.post;
	window.ajax.post = function(url, params){
		if(url === 'al_im.php' && params.act === 'a_send'){
			params.msg = hide(params.msg);
		}
		return post.apply(this, arguments);
	};

	// emoji
	window.Emoji.getEmojiHTML = function(a){ return window.Emoji.cssEmoji[a][1]; };
	window.Emoji.addEmoji = function(){};
	window.Emoji.tabSwitch(document.getElementsByClassName('emoji_tab_-1')[0], -1, 0);

	// css
	var style = window.document.createElement('style');
	style.textContent = '.emoji_tab_0 { display: none; } ';
	style.textContent += '#im_rcemoji_cont { display: none; }';
	window.document.body.appendChild(style);

})(window);
