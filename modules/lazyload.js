/*
 * name: lazyload.js
 * version: v2.0.1
 * update: 引入base公用方法
 * date: 2016-04-07
 */
define('lazyload', function(require, exports, module) {
	var $ = require('jquery'),
		base = require('base'),
		opt = {
			attr: 'data-lazy',
			everyCount: 3, // 每次加载
			distance: 100 // 进入视野距离
		},
		target,
		lazyimgs,
		loadimg = function(lazyimgs, count) {
			var i = 0;
			for (; i < count; i++) {
				if (i < lazyimgs.length) {
					lazyimgs.eq(i)._loadimg(opt.attr)
				}
			};
			init();
		},
		init = function(initImgs) {
			if (initImgs && initImgs.length) {
				lazyimgs = initImgs.filter(function() {
					if ($(this).attr(opt.attr) != 'loaded') {
						return this;
					}
				});
			} else {
				lazyimgs = lazyimgs.filter(function() {
					if ($(this).attr(opt.attr) != 'loaded') {
						return this;
					}
				});
			};
			if (!lazyimgs.length) {
				target.unbind({
					'scroll': init,
					'resize': init
				});
				return console.log('lazyload() is all done!');
			};
			if (lazyimgs.eq(0).offset().top < ($(window).height() + $(window).scrollTop() + opt.distance)) {
				loadimg(lazyimgs, opt.everyCount);
			};
		};
		
	$.fn.lazyload = function(config) {
		return $(this).each(function(i, e) {
			var $this = $(e),
				lazyimgs = $this.is($(window)) ? $('['+opt.attr+']') : $this.find('['+opt.attr+']');
			if (!lazyimgs.length) {
				console.log('no element for lazyload()!');
				return $this;
			};
			if($this.data('lazyloadinit')){
				return $this;
			};
			if($this.get(0).scrollHeight){
				target = $this;
			}else{
				target = $(window);
			};
			//初始加载绑定事件
			init(lazyimgs);
			target.bind({
				'scroll': init,
				'resize': init
			});
		});
	};
});