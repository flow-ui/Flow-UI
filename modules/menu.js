/*
 * name: menu.js
 * version: v0.0.1
 * update: build
 * date: 2017-03-10
 */
define('menu', function(require, exports, module) {
	"use strict";
	seajs.importStyle('', module.uri);
	var DropDown = require('dropdown');
	var $ = require('jquery'),
		def = {
			el: null,
			data: null,
			key: null,
			mode: 'horizontal', //vertical, horizontal
			theme: 'primary', //light, dark, primary
			subicon: '&#xe609;',
			actived: null,
			opened: [],
			toggle: true,
			onselect: null
		},
		render = function(opt) {
			var menu = '<ul class="menu-ui">';
			$.each(opt.data, function(i, m) {
				var isActive = opt.actived !== null && opt.actived === m[opt.key],
					isOpen = false,
					hasSub = $.isArray(m.sub),
					extClass = '';
				if (opt.toggle && $.isArray(opt.opened)) {
					$.each(opt.opened, function(i, openKey) {
						if (openKey === m[opt.key]) {
							isOpen = true;
							return false;
						}
					});
				}
				extClass = (isActive ? ' menu-item-active' : '') + (isOpen ? ' menu-opened' : '');
				if (opt.mode === 'vertical') {
					//纵向
					if (hasSub) {
						if (!opt.toggle) {
							extClass += ' menu-opened';
						}
						menu += ('<li class="menu-submenu' + extClass + '" data-menu-key="' + m[opt.key] + '"><div class="menu-item-title">' + m.item + (opt.toggle ? (' <i class="menu-sub-ion ion">' + opt.subicon + '</i>') : '') + '</div><ul class="menu-sub-group">');
						$.each(m.sub, function(i, sub) {
							menu += ('<li class="menu-item" data-menu-key="' + sub[opt.key] + '">' + sub.item + '</li>');
						});
						menu += '</ul></li>';
					} else {
						menu += ('<li class="menu-item' + extClass + '" data-menu-key="' + m[opt.key] + '">' + m.item + '</li>');
					}
				} else {
					//横向
					menu += ('<li class="menu-item' + extClass + (hasSub ? ' menu-submenu' : '') + '" data-menu-key="' + m[opt.key] + '">' + m.item + (hasSub ? ' <i class="menu-sub-ion ion">' + opt.subicon + '</i>' : '') + '</li>');
				}

			});
			menu = $(menu += '</ul>');
			if (opt.mode === 'vertical') {
				menu.addClass('menu-vertical');
			} else {
				menu.addClass('menu-horizontal');
			}
			switch (opt.theme) {
				case 'light':
					menu.addClass('menu-light');
					break;
				case 'dark':
					menu.addClass('menu-dark');
					break;
				default:
					menu.addClass('menu-primary');
			}
			return menu;
		},
		activeItem = function($el, $item) {
			$el.find('.menu-item-active').removeClass('menu-item-active');
			return $item.addClass('menu-item-active');
		},
		Menu = function(config) {
			var opt = $.extend({}, def, config || {});
			if (!$(opt.el).length) {
				return null;
			}
			if (!$.isArray(opt.data) || !opt.data.length) {
				return console.warn('menu: data配置异常 ', opt.data);
			}
			if (!opt.key) {
				console.warn('menu: key未配置，部分功能无法使用');
			}
			$(opt.el).each(function(i, e) {
				var $this = $(e);
				$this.html(render(opt)).on('click', '.menu-item', function(e) {
					if (opt.mode === 'vertical') {
						e.stopPropagation();
					}
					if ($(this).hasClass('menu-item-active')) {
						return e.preventDefault();
					}
					activeItem($this, $(this));

					if (!$(this).hasClass('menu-submenu') && typeof opt.onselect === 'function') {
						opt.onselect($(this).data('menu-key'));
					}
				});
				if (opt.mode === 'vertical' && opt.toggle) {
					$this.on('click', '.menu-submenu', function() {
						$(this).toggleClass('menu-opened');
					});
				} else {
					$this.find('.menu-item').each(function(i, horizontalSub) {
						if ($(horizontalSub).hasClass('menu-submenu')) {
							DropDown({
								el: horizontalSub,
								trigger: 'click',
								items: opt.data[i].sub,
								width: $(horizontalSub).outerWidth(),
								onclick: function(item) {
									if (typeof opt.onselect === 'function') {
										opt.onselect(item[opt.key]);
									}
								}
							});
							if ($.isArray(opt.opened) && opt.opened[0] === opt.data[i][opt.key]) {
								$(horizontalSub).trigger('click');
							}
						}
					});
				}
			});
			return {
				open: function(key) {
					$(opt.el).find('.menu-item').each(function(i, item) {
						if ($(item).hasClass('menu-submenu') && $(item).data('menu-key') === key) {
							return $(item).trigger('click');
						}
					});
				},
				active: function(key) {
					$(opt.el).find('.menu-item').each(function(i, item) {
						if ($(item).data('menu-key') === key) {
							return activeItem($(opt.el), $(item));
						}
					});
				}
			};
		};

	$.fn.menu = function(config) {
		Menu($.extend(config || {}, {
			el: this
		}));
	};
	module.exports = Menu;

});