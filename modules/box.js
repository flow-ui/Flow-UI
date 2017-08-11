/*
 * name: box.js
 * version: v3.12.1
 * update: toast()样式微调
 * date: 2017-08-11
 */
define('box', function(require, exports, module) {
	"use strict";
	seajs.importStyle('.box-wrap-close a,.box-wrap-close a:hover{text-decoration:none}\
		.box-wrap-close a:hover{color:#fd7b6d}\
		.box-wrap-close a,.box-wrap-msg-clo{text-align:center;cursor:pointer}\
		.box-wrap-in{min-width:9em}\
		.box-wrap-out{z-index:100;}\
		.box-wrap-out-posi{position:absolute;border-radius:4px;overflow:hidden;max-width:100%;}\
		.box-wrap-out-posi.init{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}\
		.box-wrap-out-posi.show{-webkit-transform:scale(1);transform:scale(1);opacity:1;\
			-webkit-transition:all 160ms ease-in-out;transition:all 160ms ease-in-out}\
		.box-wrap-out-drag{-webkit-transition:none;transition:none}\
		.box-wrap-bar{position:relative;height:52px;line-height:52px; -webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}\
		.box-wrap-title{padding-left:1em;margin:0;font-weight:400;font-size:16px;color:#fff;line-height:inherit}\
		.box-wrap-close{position:absolute;right:0;top:0;}\
		.box-wrap-close a,.box-wrap-msg-clo a{font:700 1.5em/20px Tahoma;padding:.5em}\
		.box-wrap-toast{display:inline-block;background:#434343;background:rgba(0,0,0,.6);color:#fff;line-height:2em;padding:.8em 1em;border-radius:.5em;\
			max-width:20em;}\
		.box-img-close{background:#fff;border-radius:4px}\
		.box-wrap-body {background:#fff;overflow-x:hidden;overflow-y:auto}\
		.box-wrap-remind{font-size:16px; padding:2em 2em;min-width:14em;overflow:hidden}\
		.box-wrap-foot{position:relative; min-width:12em;overflow:hidden;text-align:right;border-top:1px solid #ccc;background:#f6f6f6;height:50px;line-height:50px}\
		.box-wrap-foot .btn{border:0;background:none;margin:0 10px 0 0}\
		.box-wrap-foot .btn:hover{background:#ccc}\
		.box-wrap-foot .boxconfirm{position:relative;color:#286090}\
		.box-wrap-foot.-confirm .boxconfirm:after{content:"";position:absolute; display:inline-block;width:1px;height:1.8em;right:-5px;background:#ccc}\
		.box-wrap-msg{position:relative;width:500px;max-width:100%}\
		.box-wrap-msg-cont{padding:15px 40px 15px 15px;line-height:22px;color:#fff}\
		.box-wrap-msg-clo{position:absolute; height:52px;line-height:52px;right:0;top:0}\
		.box-wrap-msg-clo .ion{margin:0;font-size:16px}\
		.box-wrap-msg-clo:hover{opacity:.8}', module.uri);
	var $ = window.$ || require('jquery'),
		base = require('base'),
		Language = [{
			close: "关闭",
			confirm: "确认",
			cancel: "取消",
			loading: "加载中...",
			error: "加载出了点问题"
		}, {
			close: "close",
			confirm: "confirm",
			cancel: "cancel",
			loading: "loading...",
			error: "something is wrong"
		}],
		def = {
			title: "对话框",
			oktext: null,
			canceltext: null,
			shut: "×",
			width: "auto",
			height: "auto",
			layout: true, //是否使用默认弹出框
			setposi: true, //是否自动定位
			hook: '', //自定义样式名
			bar: true, //是否显示标题栏
			bg: true, //是否显示背景
			fix: true, //是否弹出框固定在页面上
			bgclose: true, //是否点击半透明背景隐藏弹出框
			drag: false, //是否可拖拽
			protect: false, //保护装载的内容
			opacity: 0.5, // 背景透明度
			onshow: null, //弹窗显示后触发事件
			onclose: null, //弹窗关闭后触发事件
			delay: 0, //弹窗打开后关闭的时间, 0和负值不触发
			lang: 0, //语言选择，0：中文 1:英文,
			color: "info", //msg方法情景色，info，primary，success，warning，danger
			animate: true
		},
		$blank;
	if ($("#boxBlank").length) {
		$blank = $("#boxBlank");
	}else{
		$blank = $('<div id="boxBlank" style="position:fixed;z-index:98;left:0;top:0;width:100%;height:100%;background: #000;" onselectstart="return false" />');
		$('body').append($blank);
	}
	if(!$blank.data('call')){
		$blank.hide();
	}
	//全局配置
	if (window.innerWidth < 640) {
		def.animate = false;
	}
	if ($.isPlainObject(window.boxGlobal)) {
		$.extend(def, window.boxGlobal);
	}

	var Box = {
		open: function(cont, options) {
			if (cont === void(0) || cont === null) {
				return null;
			}
			var s = $.extend({}, def, options || {}),
				$o,
				eleOut;
			$blank.css('opacity', s.opacity);
			if (typeof(cont) === 'function') cont = cont();
			if (typeof(cont) === 'object' && cont.length) {
				//现有dom
				cont.show();
				if (cont.context && cont.parent().length) {
					//默认保护
					s.protect = cont.parent();
				}
			} else if ($.parseHTML($.trim(cont + ''))[0].nodeType === 1) {
				//dom字符串
				cont = $(cont);
			} else {
				//纯字符串
				cont = $('<div class="box-wrap-remind">' + cont + '</div>');
				if (!s.layout) cont.css('min-width', '0');
			}

			eleOut = (function() {
				var result;
				if (s.layout) {
					result = $('<div class="box-wrap-out-posi">' +
						'<div class="box-wrap-in">' +
						(s.bar ? ('<div class="box-wrap-bar bg-primary" onselectstart="return false;">' +
							'<h4 class="box-wrap-title">' + s.title + '</h4>' +
							(s.shut ? '<div class="box-wrap-close"><a href="#" title="' + Language[s.lang].close + '">' + s.shut + '</a></div>' : '') +
							'</div>') : '') +
						'<div class="box-wrap-body"></div>' +
						'</div>' +
						'</div>');
					result.find('.box-wrap-body').append(cont);
				} else if (s.setposi) {
					result = $('<div class="box-wrap-out-posi" />').append(cont);
				} else {
					result = cont;
				}

				return result.addClass(s.hook + ' box-wrap-out ')
					.data({
						protect: s.protect,
						bgclose: s.bgclose,
						setposi: s.setposi,
						bg: s.bg
					})
					.css('zIndex', base.getIndex())
					.appendTo('body');
			})();

			$o = {
				s: s,
				ele: cont,
				bg: $blank,
				out: eleOut
			};

			if (typeof(s.onshow) === 'function') {
				setTimeout(function() {
					s.onshow(eleOut);
				}, 0);
			}
			if (s.setposi) {
				Box.setSize($o);
				if (s.fix) {
					$o.out.css({
						position: "fixed"
					});
				} else if (!s.drag) {
					var PluginBoxResizeHandel = base.throttle(function() {
						Box.setSize($o);
					});
					$(window).on('resize', PluginBoxResizeHandel);
				}
			}
			if (s.drag) {
				require.async('drag', function() {
					$o.out.drag({
						dragStart: function($this) {
							$this.addClass('box-wrap-out-drag');
						},
						dragEnd: function($this) {
							$this.removeClass('box-wrap-out-drag');
						}
					});
				});
			}

			if (!s.bg) {
				Box.bgCheck();
			} else {
				if($blank.data('call')){
					$blank.data('call', $blank.data('call') + 1);
				}else{
					$blank.data('call', 1);
				}
				$blank.show();
			}
			if (s.bar && s.shut) {
				$o.out.find(".box-wrap-close a").one('click', function(e) {
					e.preventDefault();
					return Box.hide($o);
				});
			}
			if (s.delay > 0) {
				setTimeout(function() {
					Box.hide($o);
				}, s.delay);
			}
			//返回box元素
			return $o;
		},
		setSize: function($o, config) {
			if (!$o.ele.length || !$o.out.length) {
				return null;
			}
			var w = $(window).width(),
				h = $(window).height(),
				st = $(window).scrollTop(),
				outHeight,
				barHeight = 0, 
				xh,
				xw;
			if ($.isPlainObject(config)) {
				if (config.width) {
					xw = config.width;
				}
				if (config.height) {
					xh = config.height;
				}
			}
			if (!xw) {
				if ($o.s.width == 'auto') {
					xw = Math.min($o.out.width(), w);
				} else {
					xw = Math.min($o.s.width, w);
				}
			}
			if (!xh) {
				barHeight = $o.s.bar ? $o.out.find('.box-wrap-bar').outerHeight(true) : 0;
				if ($o.s.height === 'auto') {
					if ($o.s.layout) {
						//jquery可以通过hide获取真实高度
						outHeight = $o.out.find('.box-wrap-body').height('auto').hide().outerHeight(true) + barHeight;
					} else {
						outHeight = $o.out.height();
					}
					xh = Math.min(outHeight, h);
				} else {
					xh = Math.min(parseFloat($o.s.height), h);
					console.log('box高度自定调整为窗口最大高度：' + h);
				}
			}
			$o.out.css({
				"width": xw,
				"height": xh
			});
			if ($o.s.layout) {
				$o.out.find('.box-wrap-body').show().height(xh - barHeight);
			}
			if ($o.s.setposi) {
				var l = (w - xw) / 2,
					t;
				if ($o.s.top !== void(0)) {
					t = $o.s.top;
				} else if ($o.s.fix) {
					t = (h - xh) / 2;
				} else {
					t = st + (h - xh) / 2;
				}
				$o.out.css({
					top: t,
					left: l
				});
				if ($o.s.animate) {
					$o.out.addClass('init');
					setTimeout(function() {
						$o.out.addClass('show');
					}, 0);
				}
			}
			return $o;
		},
		bgCheck: function() {
			if (!$blank.data('call')) {
				setTimeout(function() {
					$blank.hide();
				}, 0);
			}
		},
		hide: function($o, fromBgClick) {
			if (window.PluginBoxResizeHandel) {
				$(window).unbind('resize', PluginBoxResizeHandel);
				window.PluginBoxResizeHandel = null;
			}
			if (!$o) {
				var allBox = $('.box-wrap-out');
				if (fromBgClick) {
					allBox = allBox.filter(function() {
						return $(this).data('bgclose') === true;
					});
				}
				allBox.each(function(i, e) {
					var that = $(e);
					if (!that.data('setposi')) {
						//actionSheet插件关闭
						that.removeClass('action-sheet-up');
					}
					if (that.data('protect')) {
						var $ele = that.find('.box-wrap-body').length ? that.find('.box-wrap-body').children() : that.children();
						$ele.hide().appendTo(that.data('protect'));
					}
					if(that.data('bg') && $blank.data('call')){
						$blank.data('call', $blank.data('call') - 1);
					}
					that.remove();
				});
				return Box.bgCheck();
			} else if ($o.ele && $o.out.length && $o.out.css("display") !== "none") {
				var to = $o.s.animate ? 200 : 0;
				if ($o.s.setposi && $o.s.animate) {
					$o.out.removeClass('show');
				} else {
					$o.out.removeClass('action-sheet-up');
				}
				if($o.s.bg && $blank.data('call')){
					$blank.data('call', $blank.data('call') - 1);
				}
				setTimeout(function() {
					if ($o.s.protect) {
						$o.ele.hide().appendTo($o.s.protect);
					}
					$o.out.remove();
					Box.bgCheck();
					if ($.isFunction($o.s.onclose)) {
						$o.s.onclose();
					}
					$o = null;
				}, to);
			}
		},
		loading: function(s) {
			return Box.open(Language[s.lang].loading, {
				bar: false,
				bgclose: false
			});
		},
		confirm: function(message, sureCall, cancelCall, options) {
			var s = $.extend({}, def, options || {});
			var element = $('<div class="box-wrap-remind">' + message + '</div>' + '<div class="box-wrap-foot -confirm"><button class="btn boxconfirm">' + (s.oktext ? s.oktext : Language[s.lang].confirm) + '</button><button class="btn boxcancel">' + (s.canceltext ? s.canceltext : Language[s.lang].cancel) + '</button></div>');
			var o = Box.open(element, s);
			o.out.find(".boxcancel").one('click', function(e) {
				e.preventDefault();
				if (cancelCall && $.isFunction(cancelCall)) {
					cancelCall.call(this);
				}
				Box.hide(o);
			}).end()
			.find(".boxconfirm").one('click', function(e) {
				e.preventDefault();
				if ($.isFunction(sureCall)) {
					sureCall.call(this);
				}
			}).focus();
			return o;
		},
		alert: function(message, callback, options) {
			var s = $.extend({}, def, options || {});
			var element = $('<div class="box-wrap-remind">' + message + '</div>' + '<div class="box-wrap-foot"><button class="btn boxconfirm">' + (s.oktext ? s.oktext : Language[s.lang].confirm) + '</button></div>');
			var o = Box.open(element, s);
			o.out.find(".boxconfirm").one('click', function(e) {
				e.preventDefault();
				if (callback && $.isFunction(callback)) {
					callback.call(this);
				}
				Box.hide(o);
			}).focus();
			return o;
		},
		msg: function(message, options) {
			var s = $.extend({}, def, options || {}),
				element;
			s.top = 0;
			s.layout = false;
			s.bg = false;
			if (s.delay) {
				element = '<div class="box-wrap-msg"><div class="box-wrap-msg-cont bg-' + s.color + '">' + message + '</div></div>';
			} else {
				element = '<div class="box-wrap-msg"><div class="box-wrap-msg-cont bg-' + s.color + '">' + message + '</div><div class="box-wrap-msg-clo"><a href="#" title="' + Language[s.lang].close + '">×</a></div></div>';
			}
			var o = Box.open(element, s);
			o.out.find(".box-wrap-msg-clo").one('click', function(e) {
				e.preventDefault();
				Box.hide(o);
			});
			return o;
		},
		toast: function(message, options) {
			var s = $.extend({}, def, options || {}),
				element;
			s.layout = false;
			s.bg = false;
			s.delay = s.delay || 2000;
			element = '<div class="box-wrap-toast">' + message + '</div>';
			return Box.open(element, s);
		},
		ajax: function(uri, params, options) {
			var s = $.extend({}, def, options || {});
			if (uri) {
				var loading = Box.loading(s);
				options = options || {};
				options.protect = false;
				$.ajax({
					url: uri,
					data: params || {},
					success: function(html, other) {
						Box.hide(loading);
						return Box.open(html, options);
					},
					error: function() {
						Box.hide(loading);
						return Box.alert(Language[s.lang].error);
					}
				});
			}
		},
		ifram: function(uri, params, options) {
			if (uri) {
				var html;
				options = options || {};
				options.protect = false;
				params = params || {};
				html = '<iframe name="' + (params.name || '') + '" src="' + uri + '" width="' + (params.width || 640) + '" height="' + (params.height || 480) + '" frameborder="0"></iframe>';
				return Box.open(html, options);
			}
		},
		img: function(src, options) {
			if (!src || !src.split) return;
			var s = $.extend({}, def, options || {}),
				loading = Box.loading(s),
				$img = '<img src="' + src + '">',
				imgBox;
			options = options || {};
			options.bg = true;
			options.layout = false;
			options.onshow = function($box) {
				$box.append('<div class="box-wrap-close box-img-close"><a>x</a></div>')
					.find('.box-img-close').one('click', function(e) {
						e.preventDefault();
						Box.hide(imgBox);
					});
			};
			require.async('img-ready', function(ready) {
				ready(src, function(width, height) {
					options.width = width;
					options.height = height;
					Box.hide(loading);
					return (imgBox = Box.open($img, options));
				});
			});
		}
	};

	$blank.click(function() {
		Box.hide(false, true);
	});
	
	$.box = Box;

	module.exports = Box;
});