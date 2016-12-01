/**
 * 
 */
define(function(require) {
	var $ = require('jquery');
	var base = require('base');
	var com = require('./common');
	/*
	 * fullpage
	 */
	require('mousewheel');
	require('easing');
	var fullPageNav = 'circles',				//自定义导航class，元素自动生成
		fullPageSection = $('.full_section'),	//滚屏元素
		fullpagePrev = 'fullpage_prev',			//上一屏按钮class，元素手动添加
		fullpageNext = 'fullpage_next',			//下一屏按钮class，元素手动添加
		duration = 480,							//滚动动画时长
		easing = 'swing',						//滚动动画效果
		header = $('.head'),					//固定头部元素，可选
		footer = $('.footer'),					//单独一屏的底部，可选
		windowH = $(window).height() - (header.length ? header.height() : 0),
		footerShow = false,
		pagelock = false,
		animate = { //每一屏的进出场动画
			sec1: {
				show: function($this) {

				},
				hide: function($this) {

				}
			},
			sec2: {
				show: function($this) {

				},
				hide: function($this) {

				}
			},
			sec3: {
				show: function($this) {

				},
				hide: function($this) {

				}
			},
			sec4: {
				show: function($this) {

				},
				hide: function($this) {

				}
			},
			sec5: {
				show: function($this) {

				},
				hide: function($this) {

				}
			},
			sec6: {
				show: function($this) {

				},
				hide: function($this) {

				}
			},
			footer: {
				show: function() {
					$('.full_box').stop().animate({
						'top': -footer.outerHeight()
					}, duration, easing, function() {
						pagelock = false;
					});
					footer.stop().animate({
						'bottom': 0
					}, duration, easing, function() {
						pagelock = false;
					});
					footerShow = true;
				},
				hide: function() {
					$('.full_box').stop().animate({
						'top': 0
					}, duration, easing, function() {
						pagelock = false;
					});
					footer.stop().animate({
						'bottom': -footer.outerHeight()
					}, duration, easing, function() {
						pagelock = false;
					});
					footerShow = false;
				}
			}
		},
		current = 0,
		oldPage = 0,
		goPage = function(direct) {
			//翻页
			//判断是不是在页脚
			if (footerShow) {
				animate.footer.hide();
			}
			$('.full_wrap').stop().animate({
				top: -current * windowH
			}, duration, easing, function() {
				//console.log('解锁')
				pagelock = false;
			});
			//导航状态
			$('.circles li').eq(current).addClass('current').siblings().removeClass('current');
			//回调
			animate['sec' + (current + 1)].show(fullPageSection.eq(current));
			animate['sec' + (oldPage + 1)].hide(fullPageSection.eq(oldPage));
		},
		fullPageInit = function() {
			$('.full_body').height(windowH);
			fullPageSection.fadeIn(duration);
			animate['sec1'].show(fullPageSection.eq(0));
			//滚轮驱动
			fullPageSection.each(function(i, e) {
				$(e).mousewheel(function(e) {
					if (pagelock) {
						//console.log('锁定')
						return false;
					}
					oldPage = current;
					current = current - e.deltaY;
					//第一页向上滚
					if (current < 0) {
						current = 0;
						return false;
					}
					pagelock = true;
					//隐藏底部
					if (e.deltaY > 0 && footerShow) {
						current = fullPageSection.length - 1;
						animate.footer.hide();
						return false;
					}
					//显示底部
					if (current >= fullPageSection.length) {
						current = fullPageSection.length - 1;
						if (footer.length && e.deltaY < 0 && !footerShow) {
							animate.footer.show();
						} else {
							pagelock = false;
						}
						return false;
					}
					goPage();
					return false;
				});
			});
			//导航驱动
			if (fullPageNav.length && (fullPageNav.find('li').length == fullPageSection.length)) {
				fullPageNav.on('click', 'li', function(e) {
					e.preventDefault();
					oldPage = current;
					current = $(this).index();
					goPage();
				});
			};
			$(window).on('resize', function() {
				windowH = $(this).height() - $('.head').height();
			});

			if (footer.length) {
				footer.mousewheel(function(e) {
					if (e.deltaY === 1) {
						animate.footer.hide();
					} else if (e.deltaY === -1) {
						animate.footer.show();
					}
					return false;
				});
			}
		};
	//插入导航
	if (fullPageNav && fullPageNav.split && base.getType() === 'Pc') {
		var _nav = '<ul class="circles">';
		for (var i = 0; i < $('.full_section').length; i++) {
			if (!i) {
				_nav += '<li class="current"></li>';
			} else {
				_nav += '<li></li>';
			}

		};
		_nav += '</ul>';
		$('body').append(_nav);
		fullPageNav = $('.' + fullPageNav);
	}
	//启动 
	if (base.getType() == "Pc") {
		//翻页按钮
		$('body').on('click', '.'+fullpagePrev, function() {
			oldPage = current;
			//隐藏底部
			if (current === fullPageSection.length - 1 && footerShow) {
				animate.footer.hide();
				return false;
			}
			current--;

			if (current < 0) {
				current = 0;
				if (footerShow) {
					current = fullPageSection.length - 1;
					animate.footer.hide();
				}
				return false;
			}
			
			goPage();
		})
		.on('click', '.'+fullpageNext, function() {
			oldPage = current;
			current++;
			//显示底部
			if (current >= fullPageSection.length) {
				current = fullPageSection.length - 1;
				if (footer.length && !footerShow) {
					animate.footer.show();
				}
				return false;
			}
			goPage();
		});
		//pc启动
		fullPageInit();
	} else {
		//非pc全显示
		for (anim in animate) {
			if (anim != 'footer') {
				animate[anim]['show']();
			}
		}
	}


})