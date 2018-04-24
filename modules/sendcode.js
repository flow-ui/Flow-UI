/*
 * name: sendcode.js
 * version: v0.3.0
 * update: 增加error配置
 * date: 2018-04-23
 */
define("sendcode", function(require, exports, module) {
	"use strict";
	require('box');
	var $ = window.$ || require('jquery'),
		def = {
			url: null,
			keyName: 'mobile',
			data: null,
			time: 60,
			mobile: null,
			renderTarget: null,
			render: function(sec) {
				return sec + '秒后重发';
			},
			reSendText: '重发验证码',
			sendBefore: null,
			sendAfter: null
		},
		setAble = function(dom, flag) {
			if (flag) {
				return dom.removeClass('unable').data('unable', false);
			} else {
				return dom.addClass('unable').data('unable', true);
			}
		};

	$.fn.sendcode = function(option) {
		var opt = $.extend(def, option || {}),
			intv,
			loading,
			ticktime, 
			renderTarget,
			tick = function(renderTarget) {
				if (ticktime) {
					if (typeof opt.render === 'function') {
						renderTarget.text(opt.render(--ticktime));
					}
				} else {
					clearInterval(intv);
					ticktime = parseInt(opt.time);
					renderTarget.text(opt.reSendText);
					if (renderTarget.data('that')) {
						setAble(renderTarget.data('that'), true);
					} else {
						setAble(renderTarget, true);
					}
					if(loading){
						$.box.hide(loading);
					}
				}
			},
			sendmsg = function(mobileNumber, callback) {
				var thedata = {},
					renderTarget;
				loading = $.box.msg('正在发送验证码...');
				if (opt.renderTarget && $(opt.renderTarget).length) {
					renderTarget = $(opt.renderTarget).data('that', $(this));
				} else {
					renderTarget = $(this);
				}
				console.log(renderTarget)
				thedata[opt.keyName] = mobileNumber;
				$.extend(thedata, opt.data || {});
				setAble($(this),false);
				//开始倒计时
				intv = setInterval(function() {
					tick(renderTarget);
				}, 1000);
				$.ajax({
					url: opt.url,
					data: thedata,
					success: function(res) {
						$.box.hide(loading);
						if (res.status === 'Y') {
							if (typeof callback === 'function') {
								callback();
							}
						} else {
							$.box.msg(res.msg || '出错了');
						}
					},
					error:function(){
						$.box.hide(loading);
						$.box.msg('请求异常！',{
							color:'danger',
							delay:2000
						});
					}
				});
			};
		if(typeof opt.error !== 'function'){
			opt.error = console.warn;
		}
		
		if(!isNaN(parseInt(opt.time))){
			ticktime = parseInt(opt.time);
		}else{
			return console.warn('sendcode():"time"参数异常！');
		}
		return $(this).each(function(i, e) {
			if ($(e).data('sendcodeinit')) {
				return null;
			}
			$(e).data('sendcodeinit', true).on('click', function(e) {
				e.preventDefault();
				var that = this,
					sendNumber;
				if ($(that).data('unable')) {
					return null;
				}
				if (typeof opt.mobile == 'function') {
					sendNumber = opt.mobile();
				} else if ($(opt.mobile).is('input') || $(opt.mobile).is('textarea')) {
					sendNumber = $(opt.mobile).val();
				} else {
					sendNumber = opt.mobile;
				}
				console.log(sendNumber)
				if (!sendNumber || !opt.url) {
					return opt.error('sendcode():缺少"mobile/url"参数！');
				}
				if (typeof opt.sendBefore === 'function') {
					if(opt.sendBefore(sendNumber)){
						sendmsg.call(that, sendNumber, opt.sendAfter);
					};
				} else {
					sendmsg.call(that, sendNumber, opt.sendAfter);
				}
			});
		});
	};
});
