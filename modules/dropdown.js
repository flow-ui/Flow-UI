/*
 * name: dropdown.js
 * version: v0.2.0
 * update: text => item; add width;
 * date: 2017-03-06
 */
define('dropdown', function(require, exports, module) {
	"use strict";
	seajs.importStyle('.dropdown{position:relative;}\
		.dropdown-default{background:#fff;color:#434343;border-radius:4px;overflow:hidden;box-shadow: 0 1px 6px rgba(0,0,0,.2);border:1px solid #eee;padding:.5em 0;}\
		.dropdown-item{text-align:center;min-width:4em; padding:0 1.5em;line-height:2.6em;cursor:pointer;white-space:nowrap;}\
		.dropdown-item.disabled{color:#ccc; cursor:not-allowed;}\
		.dropdown-default .dropdown-item:hover{background:#dedede;}\
		.dropdown-default .dropdown-item.disabled:hover{background:inherit;}\
		.dropdown-default .dropdown-group{padding:4px 0; border-bottom:1px solid #eee;}', module.uri);

	var $ = require('jquery'),
		Tip = require('tip'),
		def = {
			el: null,
			trigger: 'hover',
			place: 'bottom-center',
			items: [], //item, disabled
			width: null,
			theme: 'dropdown-default',
			onclick: function() {}
		},
		render = function(data, hook) {
			var result = '<ul class="dropdown-menu ' + (hook || '') + '">';
			var i = 0,
				len = data.length;
			for (; i < len; i++) {
				if($.isPlainObject(data[i])){
					result += ('<li class="dropdown-item' + (data[i].disabled ? ' disabled' : '') + '">' + data[i].item + '</li>');
				}else if($.isArray(data[i])){
					result += ('<li class="dropdown-group">' + render(data[i]) + '</li>');
				}
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
		if(!isNaN(parseInt(opt.width))){
			menuHtml.css('min-width',opt.width);
		}
		var model = Tip(menuHtml, $.extend(opt, {
			onshow: function() {
				menuHtml.on('click', '.dropdown-item', function() {
					var item = opt.items[$(this).index()];
					if (!$(this).hasClass('disabled')) {
						model.hide();
						typeof(opt.onclick) === 'function' && opt.onclick(item);
					}
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