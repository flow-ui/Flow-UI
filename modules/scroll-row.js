/*
 * name: scroll-row
 * version: v3.0.6
 * update: DOM移除后释放全局变量
 * date: 2016-03-11
 */
define('scroll-row', function(require, exports, module) {
	require('easing');
	var $ = require('jquery');
	var def = {
		prev: null,
		next: null,
		wrap: 'ul',
		cell: 'li',
		line: 1,
		duration: 300,
		animate: 'swing',
		auto: true,
		pause: true,
		interval: 5e3,
		callback: function(nowRow) {},
		ext: function(totalRow) {}
	};
	$.fn.scrollRow = function(config) {
		return $(this).each(function(i, e) {
			var $this = $(e),
				opt = $.extend({}, def, config || {}),
				nowRow = 1,
				$wrap, $cell, timer, lasted, scrollRow, _btnUp, _btnDown;
			if ($this.data('scrollrowing')) return $this;
			//添加左右按钮
			if ($(opt.prev).length || $(opt.next).length) {
				_btnUp = $(opt.prev);
				_btnDown = $(opt.next);
			} else {
				$this.append('<a class="arrs arr_prev" /> <a class="arrs arr_next" />');
				_btnUp = $this.children(".arr_prev");
				_btnDown = $this.children(".arr_next");
			};
			$wrap = $this.find(opt.wrap);
			$cell = $wrap.find(opt.cell);
			lineH = $cell.outerHeight(true);
			cols = Math.floor($this.width() / $cell.outerWidth()) ? Math.floor($this.width() / $cell.outerWidth()) : 1;
			rows = Math.floor($this.height() / lineH);
			rowsall = Math.ceil($cell.length / cols);
			line = opt.line > rows ? rows : opt.line;
			upHeight = 0 - line * lineH;
			totalRow = Math.ceil(rowsall / rows);
			//运行条件检测
			if (rowsall * lineH <= $this.height()) {
				_btnUp.addClass('unable');
				_btnDown.addClass('unable');
				opt.ext && opt.ext(totalRow);
				console.log("scroll-row: lines no enough to scroll.");
				return $this;
			};

			scrollRow = function(direct) {
				if ($this.find(':animated').length) return;
				if (direct > 0) {
					//up
					$wrap.stop(1).animate({
						marginTop: upHeight
					}, {
						duration: opt.duration,
						easing: opt.animate,
						complete: function() {
							$wrap.css('marginTop', 0);
							for (i = 1; i <= line; i++) {
								$this.find(opt.cell + ":lt(" + cols + ")").appendTo($wrap);
							}
						}
					});
					nowRow = (nowRow <= 1 ? totalRow : nowRow - 1);
					typeof(opt.callback)==='function' && opt.callback(nowRow);
				} else {
					lasted = $cell.length - cols - 1;
					for (i = 1; i <= line; i++) {
						$this.find(opt.cell + ":gt(" + lasted + ")").show().prependTo($wrap)
					};
					$wrap.stop(1).css('marginTop', upHeight).animate({
						marginTop: 0
					}, {
						duration: opt.duration,
						easing: opt.animate
					});
					nowRow = (nowRow >= totalRow ? 1 : nowRow + 1);
					typeof(opt.callback)==='function' && opt.callback(nowRow);
				}
			};

			_btnUp.click(function(e) {
				e.preventDefault();
				scrollRow(-1)
			});
			_btnDown.click(function(e) {
				e.preventDefault();
				scrollRow(1)
			});
			$this.data('scrollrowing', true).parent().on('DOMNodeRemoved',function(e){
				if($(e.target).is($this)){
					//DOM移除后释放全局变量
					timer && clearInterval(timer);
				}
			});

			if (opt.auto) {
				timer = setInterval(function() {
					scrollRow(1)
				}, opt.interval);
				if (opt.pause) {
					$this.hover(function() {
						clearInterval(timer)
					}, function() {
						timer = setInterval(function() {
							scrollRow(1)
						}, opt.interval)
					})
				}
			};
			typeof(opt.ext) == 'function' && opt.ext(totalRow);
		})
	};
});