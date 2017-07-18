/*
 * name: on-scroll
 * version: v2.2.0
 * update: 增加ontop回调
 * date: 2017-07-18
 */
define('on-scroll', function(require, exports, module) {
	var $ = window.$ || require('jquery'),
		base = require('base'),
		def = {
			el: null,
			offset: null,
			target: null,
			targetCell: 'li',
			targetFix: null,
			speed: 300,
			onshow: null,
			ontop: null
		};

	var onScroll = function(config) {
		var opt = $.extend({}, def, config || {}),
			$this = $(opt.el),
			$target,
			watchScroll,
			catchScroll,
			scrollCache = $(window).scrollTop(),
			scrollDown,
			scrollLock,
			_setTime;
		if (!$this.length) {
			return console.log(opt.el + '未找到');
		}
		// 获取目标及绑定事件
		if (opt.target) {
			if (!$(opt.target).children(opt.targetCell).length) {
				console.log('target has no targetCells!');
				return $this;
			}
			$target = $(opt.target);
			var theFixTarget, targetTop;
			if (opt.targetFix && $(opt.targetFix).length) {
				theFixTarget = $(opt.targetFix);
			} else {
				theFixTarget = $target;
			}
			targetTop = theFixTarget.offset().top;
			if (!opt.offset) {
				opt.offset = parseInt(theFixTarget.outerHeight());
			}
			if ($this.length !== $target.children(opt.targetCell).length) {
				console.log("'." + $this.selector + "' 与绑定目标数量不同，无法绑定");
				return $this;
			}
			$target.on('click', opt.targetCell, function(e) {
				e.preventDefault();
				var _posi = $this.eq($(this).index(opt.target + ' ' + opt.targetCell)).offset().top - opt.offset;
				scrollLock = true;
				$('body,html').stop(true).animate({
						"scrollTop": _posi
					},
					opt.speed,
					function() {
						clearTimeout(_setTime);
						_setTime = setTimeout(function() {
							scrollLock = false;
						}, opt.speed + 300); //需要比一般的时间长
					}
				);
			});
		}
		// 滚动定位（函数节流）
		catchScroll = base.throttle(function(winT) {
			var _eIndex,
				winH = $(window).height();
			if (scrollCache <= winT) {
				scrollDown = true;
			} else {
				scrollDown = false;
			}
			scrollCache = winT;
			if (scrollDown) {
				//向下
				$this.each(function(i, e) {
					if (!e.onshowReady && (parseInt($(e).offset().top) <= winH + winT + opt.offset)) {
						e.onshowReady = true;
						typeof opt.onshow === 'function' && opt.onshow(e, i);
					}
					if ($target && !e.ontopReady && (parseInt($(e).offset().top) <= winT + opt.offset)) {
						e.ontopReady = true;
						_eIndex = i;
						typeof opt.ontop === 'function' && opt.ontop(e, i);
					}
				});
			} else if($target) {
				//向上
				$this.each(function(i, e) {
					if (parseInt($(e).offset().top) >= winT + opt.offset) {
						_eIndex = i;
						return false;
					}
				});
			}
			if ($target) {
				$target.children(opt.targetCell).eq(_eIndex).addClass('active')
					.siblings().removeClass('active');
			}
		});
		watchScroll = function() {
			var winT = $(window).scrollTop();
			// 添加目标定位类
			if (theFixTarget) {
				if (targetTop <= winT) {
					theFixTarget.addClass('fixed');
				} else {
					theFixTarget.removeClass('fixed');
				}
			}
			catchScroll(winT);
		};
		watchScroll();

		$(window).on({
			'scroll': watchScroll,
			'resize': watchScroll
		});
		return $this;
	};

	$.fn.onScroll = function(config) {
		return onScroll($.extend({
			el: this
		}, config || {}));
	};

	module.exports = onScroll;
});