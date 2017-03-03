/*
 * name: dropdown.js
 * version: v0.0.1
 * update: build
 * date: 2017-03-02
 */
define('dropdown', function(require, exports, module) {
	"use strict";
	seajs.importStyle('.dropdown{position:relative;}\
		.dropdown-default{background:#fff;color:#434343;border-radius:4px;overflow:hidden;box-shadow: 0 1px 6px rgba(0,0,0,.2);}\
		.dropdown-item{padding:0 1em;line-height:2.6em;cursor:pointer;white-space:nowrap;}\
		.dropdown-default .dropdown-item:hover{background:#dedede;}', module.uri);

	var $ = require('jquery'),
		Tip = require('tip'),
		def = {
			el: null,
			trigger: 'hover',
			place: 'bottom-center',
			items: [],
			theme: 'dropdown-default',
			onclick: function() {}
		},
		render = function(data, hook) {
			var result = '<ul class="dropdown-menu ' + (hook || '') + '">';
			var i = 0,
				len = data.length;
			for (; i < len; i++) {
				result += ('<li class="dropdown-item">' + data[i].text + '</li>');
			}
			result += '</ul>';
			return result;
		};
	var Dropdown = function(config) {
		var opt = $.extend({}, def, config),
			menuHtml;
		if (!$(opt.el).length) {
			return console.warn('dorpdown: el 参数有误:', opt.el);
		}
		if (!opt.items.length) {
			return console.warn('dorpdown: items 参数有误:', opt.items);
		}
		menuHtml = $(render(opt.items, opt.theme));

		var model = Tip(menuHtml, $.extend(opt, {
			onshow: function() {
				menuHtml.on('click', '.dropdown-item', function() {
					var item = opt.items[$(this).index()];
					model.hide();
					typeof(opt.onclick) === 'function' && opt.onclick(item);
				});
			}
		}));
	};

	$.fn.dropdown = function(config) {
		return Dropdown($.extend(config, {
			el: this
		}));
	};

	module.exports = Dropdown;
});