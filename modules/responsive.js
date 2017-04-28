/*
 * name: responsive
 * version: 0.0.1
 * update: build
 * date: 2016-12-09
 */
define('responsive', function(require, exports, module) {
	'use strict';
	var $ = window.jQuery || require('jquery');
	/*
	 * 延迟渲染
	 */
	var _push = function(dom, fn) {
		var topush = function(_dom, _fn) {
			if (!$(dom).length) return;
			$(_dom).each(function(i, e) {
				var template, html;
				if ($(e).children('textarea').length) {
					template = $(e).children('textarea');
					html = template.val();
				} else if ($(e).children('script[type="text/template"]').length) {
					template = $(e).children('script[type="text/template"]');
					html = template.html();
				}

				if ($(e).hasClass('pushed') || !template) return;

				if (template.data('url')) {
					$.ajax({
						url: template.data('url'),
						success: function(data) {
							$(e).html(data).addClass('pushed');
							typeof(_fn) === 'function' && _fn(e);
						}
					});
				} else {
					$(e).html(html).addClass('pushed');
					typeof(_fn) === 'function' && _fn(e);
				}
			});
		};
		if (fn == void 0) {
			if (dom && typeof(dom) !== 'function') {
				topush(dom, fn);
			} else {
				fn = dom;
				dom = '.topush';
				topush(dom, fn);
			}
		} else {
			topush(dom, fn);
		}
	};
	/*
	 * 按需渲染
	 */
	var _scanpush = function() {
		$(function() {
			var typeCatch = _getType();
			if (typeCatch == 'Pc') {
				_push('.PcPush', function(that) {
					$(that).trigger('PcPush');
				});
			} else {
				_push('.UnpcPush', function(that) {
					$(that).trigger('UnpcPush');
				});
			}
			if (typeCatch == 'Mobile') {
				_push('.MobilePush', function(that) {
					$(that).trigger('MobilePush');
				});
			} else {
				_push('.UnmobilePush', function(that) {
					$(that).trigger('UnmobilePush');
				});
			}
		});
	};

	/*
	 * 设备识别
	 */
	var _getType = function(callback) {
		var _Type = 'Pc';
		if (window.getComputedStyle) {
			var bodyMark = window.getComputedStyle(document.body, ":after").getPropertyValue("content");
			_Type = /Mobile/.test(bodyMark) ? 'Mobile' : (/Pad/.test(bodyMark) ? 'Pad' : 'Pc');
		}
		if (!callback) return _Type;
		callback(_Type);
	};

	/*
	 * 设备方向
	 */
	var _getOrient = function(callback) {
		var _Orient;
		if (window.orientation === 0 || window.orientation === 180) {
			_Orient = 'Shu';
		} else if (window.orientation == 90 || window.orientation == -90) {
			_Orient = 'Heng';
		}
		if (_Orient === void(0)) {
			_Orient = $(window).width() > $(window).height() ? 'Heng' : 'Shu';
		}
		if (typeof(callback) === 'function') {
			callback(_Orient);
			$(window).bind("orientationchange", function(event) {
				callback(_getOrient());
			});
		}
		return _Orient;
	};

	/*
	 * 响应图片
	 */
	var _resImg = function(bigSrc) {
		bigSrc = bigSrc || 'data-src';
		_getType(function(type) {
			if (!/Mobile/.test(type)) {
				require.async('img-ready',function(ready){
					$('img[' + bigSrc + ']').each(function(i, e) {
						$(e).attr('src', $(e).attr(bigSrc));
						ready($(e).attr('src'), function() {},
							function(width, height) {
								$(e).removeAttr(bigSrc);
							}
						);
					});
				});
			}
		});
	};
	/*
	 * 输出
	 */
	module.exports = {
		getType: _getType,
		resImg: _resImg,
		getOrient: _getOrient,
		topush: _push,
		scanpush: _scanpush
	};
});