/*
 * name: marquee.js
 * version: v0.10.1
 * update: 重复执行bug
 * date: 2016-04-18
 */
define('marquee', function(require, exports, module) {
	seajs.importStyle('.marquee_wrapper{position:relative;overflow:hidden}', module.uri);
	var $ = require('jquery');
/*
 * Pause $ plugin v0.1
 * Copyright 2010 by Tobia Conforto <tobia.conforto@gmail.com>
 * Based on Pause-resume-animation $ plugin by Joe Weitzel
 */
(function(){var e=$,f="$.pause",d=1,b=e.fn.animate,a={};function c(){return new Date().getTime()}e.fn.animate=function(k,h,j,i){var g=e.speed(h,j,i);g.complete=g.old;return this.each(function(){if(!this[f]){this[f]=d++}var l=e.extend({},g);b.apply(e(this),[k,e.extend({},l)]);a[this[f]]={run:true,prop:k,opt:l,start:c(),done:0}})};e.fn.pause=function(){return this.each(function(){if(!this[f]){this[f]=d++}var g=a[this[f]];if(g&&g.run){g.done+=c()-g.start;if(g.done>g.opt.duration){delete a[this[f]]}else{e(this).stop();g.run=false}}})};e.fn.resume=function(){return this.each(function(){if(!this[f]){this[f]=d++}var g=a[this[f]];if(g&&!g.run){g.opt.duration-=g.done;g.done=0;g.run=true;g.start=c();b.apply(e(this),[g.prop,e.extend({},g.opt)])}})}})();
	/*! marquee begin */
	var def = {
		duration: 3000,
		direction: "top", //top, left
		pauseOnHover: true
	};
	$.fn.marquee = function(config) {
		return $(this).each(function(i, e) {
			var $this = $(e),
				opt = $.extend({}, def, config || {}),
				$wrapper,
				$cont,
				$btnPrev,
				$btnNext,
				contLong = 0,
				wrapLong = 0,
				animParam = {},
				moveTo ,
				repeatAt ,
				initStep = 0,
				anim;
			if($this.data('marqueeinit')){
				return $this
			};
			if (opt.direction !== 'top') {
				opt.direction = 'left';
			};
			$this.css('overflow','hidden').data('marqueeinit',true)
				.wrapInner('<div class="marquee_cont" />')
				.wrapInner('<div class="marquee_wrapper" />');
			
			$wrapper = $(this).children('.marquee_wrapper');
			$cont = $wrapper.children('.marquee_cont');

			if (opt.direction == 'top') {
				//向上
				wrapLong = $this.height();
				contLong = $cont.outerHeight();
				$wrapper.append($cont.clone(true)).height(contLong*2).css('top',0);
			} else {
				//向左
				wrapLong = $this.width();
				var _scrollContClone = $cont.clone().css('position', 'absolute').appendTo('body');
				contLong = _scrollContClone.outerWidth();
				$wrapper.append($cont.clone(true)).width(contLong*2).css('left',0)
					.find('.marquee_cont').css({
						float:'left',
						width:contLong
					});
				setTimeout(function(){
					_scrollContClone.remove();
				});
			};
			if(contLong<wrapLong){
				return console.warn('marquee:内容高度不足以滚动');
			};
			moveTo = wrapLong-contLong*2+'px'
			repeatAt = wrapLong-contLong+'px',
			animParam[opt.direction] = moveTo;
			anim = function () {
				$wrapper.css(opt.direction, !initStep ? initStep : repeatAt).animate(animParam, opt.duration*2, 'linear', anim);
				return ++initStep;
			};
			anim();
			if(opt.pauseOnHover){
				$wrapper.on('mouseenter',function(){
					$wrapper.pause();
				}).on('mouseleave',function(){
					$wrapper.resume();
				})
			}

		});
	};
});