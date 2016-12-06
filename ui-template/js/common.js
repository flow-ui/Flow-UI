/**
 * name: common
 * version: v3.0.2
 * update: ie8 opc0显示bug
 * date: 2016-08-02
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var base = require('base');

	if(base.browser.ie<8){
		alert('您的浏览器版本过低，请升级或使用chrome、Firefox等高级浏览器！');
	}
	//屏蔽ie78 console未定义错误
	if (typeof console === 'undefined') {
	    console = { log: function() {}, warn: function() {} };
	}
	//返回顶部
	$('body').on('click','.gotop',function(){$('html,body').stop(1).animate({scrollTop:'0'},300);return false;});
	//textarea扩展max-length
	$('textarea[max-length]').on('change blur keyup',function(){
		var _val=$(this).val(),_max=$(this).attr('max-length');
		if(_val.length>_max){
			$(this).val(_val.substr(0,_max));
		}
	});

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
	var ready = require('img-ready');
	var _resImg = function(bigSrc) {
		bigSrc = bigSrc ? bigSrc : 'data-src';
		_getType(function(type) {
			if (!/Mobile/.test(type)) {
				$('img[' + bigSrc + ']').each(function(i, e) {
					$(e).attr('src', $(e).attr(bigSrc));
					ready($(e).attr('src'), function() {},
						function(width, height) {
							$(e).removeAttr(bigSrc);
						}
					);
				});
			}
		});
	};
	//延时显示
	if(base.browser.ie<9){
		$('.opc0').css('filter','unset');
	}else{
		$('.opc0').animate({'opacity':'1'},160);
	}
	// placeholder
	require('placeholder');
	$('input, textarea').placeholder();
	//按需渲染
	_scanpush();
	//响应图片
	_resImg();
	
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

	/*
	* 站内公用
	*/
 

	
	
	
});