/*
 * name: menu.js
 * version: v0.2.3
 * update: 基于已有DOM初始化的bug
 * date: 2017-05-08
 */
define('menu', function(require, exports, module) {
	"use strict";
	seajs.importStyle('', module.uri);
	var DropDown = require('dropdown');
	var $ = window.$ || require('jquery'),
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
			onSelect: null,
			onClick: null
		},
		objectQueue = [],
		render = function(opt) {
			objectQueue = [];
			if (!$.isArray(opt.data) || !opt.data.length) {
				return null;
			}
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
							menu += ('<li class="menu-item" data-menu-key="' + sub[opt.key] + '" data-index="'+ objectQueue.length +'">' + sub.item + '</li>');
							objectQueue.push(sub);
						});
						menu += '</ul></li>';
					} else {
						menu += ('<li class="menu-item' + extClass + '" data-menu-key="' + m[opt.key] + '" data-index="'+ objectQueue.length +'">' + m.item + '</li>');
						objectQueue.push(m);
					}
				} else {
					//横向
					menu += ('<li class="menu-item' + extClass + (hasSub ? ' menu-submenu' : '') + '" data-menu-key="' + m[opt.key] + '" data-index="'+ objectQueue.length +'">' + m.item + (hasSub ? ' <i class="menu-sub-ion ion">' + opt.subicon + '</i>' : '') + '</li>');
					objectQueue.push(m);
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
		activeItem = function($el, $item, opt) {
			var object = objectQueue[$item.data('index')];
			$el.find('.menu-item-active').removeClass('menu-item-active');
			$item.addClass('menu-item-active').parents('.menu-submenu').addClass('menu-opened');
			if (!$item.hasClass('menu-submenu') && typeof opt.onSelect === 'function') {
				opt.onSelect(object, $item);
			}
		},
		Menu = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(opt.el).eq(0),
				html;
			$.extend(opt, $this.data('menu') || {});
			if (!$this.length || $this.data('menu-init')) {
				return null;
			}
			
			html = render(opt);
			if(html){
				$this.html(html);
				if (!opt.key) {
					console.warn('menu: key未配置，部分功能无法使用');
				}
			}else{
				$this.find('.menu-item').each(function(i, e){
					$(e).attr('data-index', i);
				});
				if(opt.actived){
					$this.find('[data-menu-key="'+ opt.actived +'"]').addClass('menu-item-active').parents('.menu-submenu').addClass('menu-opened');
				}
				if($.isArray(opt.opened) && opt.opened.length){
					$.each(opt.opened, function(i, opened){
						$this.find('[data-menu-key="'+ opened +'"]').addClass('menu-opened');
					});
				}
			}
			$this.on('click', '.menu-item[data-index]', function(e) {
				e.preventDefault();
				var isCur = $(this).hasClass('menu-item-active');
				var object = objectQueue[$(this).data('index')];
				if (opt.mode === 'vertical') {
					e.stopPropagation();
				}
				if(typeof opt.onClick === 'function'){
					return opt.onClick(object, $(this), isCur);
				}
				if (isCur) {
					return null;
				}
				activeItem($this, $(this), opt);
				
			}).data('menu-init', true);

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
							onclick: function(item, isCur) {
								if(typeof opt.onClick === 'function'){
									return opt.onClick(item, null, isCur);
								}
								if (isCur) {
									return null;
								}
								if (typeof opt.onSelect === 'function') {
									opt.onSelect(item, null);
								}
							}
						});
						if ($.isArray(opt.opened) && opt.opened[0] === opt.data[i][opt.key]) {
							$(horizontalSub).trigger('click');
						}
					}
				});
			}

			return {
				open: function(key) {
					var $menu = $(opt.el).find('.menu-item[data-menu-key="'+key+'"]');
					if ($menu.length && $menu.hasClass('menu-submenu')) {
						return $menu.trigger('click');
					}
				},
				active: function(key) {
					return activeItem($(opt.el), $(opt.el).find('.menu-item[data-menu-key="'+key+'"]'), opt);
				}
			};
		};

	$.fn.menu = function(config) {
		Menu($.extend({
			el: this
		}, config));
	};
	module.exports = Menu;
});