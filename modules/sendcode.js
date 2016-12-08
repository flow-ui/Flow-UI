/*
 * name: sendcode.js
 * version: v0.0.2
 * update: ajax错误处理
 * date: 2016-12-08
 */
define("sendcode", function(require, exports, module) {
	"use strict";
	var $ = require('jquery');
	require('box');
	var def = {
		url: null,
		keyName: 'mobile',
		data: null,
		time: 60,
		mobile: null,
		sendBefore: null,
		sendAfter: null
	};
	$.fn.sendcode = function(option) {
		var opt = $.extend(def, option || {});
		if (!opt.mobile || !opt.url) {
			return console.warn('sendcode():缺少参数！');
		}
		var intv,
			loading,
			tick = function(o) {
				if (opt.time) {
					$(o).text(--opt.time + '秒后重发');
				} else {
					clearInterval(intv);
					opt.time = 60;
					$(o).removeClass('unable').text('重发验证码');
				}
			},
			sendmsg = function(mobileNumber, callback) {
				var that = this;
				var thedata = {};
				thedata[opt.keyName] = mobileNumber;
				$.extend(thedata, opt.data || {});
				$(that).addClass('unable');
				$.ajax({
					url: opt.url,
					data: thedata,
					success: function(res) {
						if (res.status === 'Y') {
							//开始倒计时
							intv = setInterval(function() {
								tick(that);
							}, 1000);
							if (typeof callback === 'function') {
								callback();
							}
						} else {
							$.box.msg(res.msg || '出错了');
						}
					},
					always:function(){
						$.box.hide(loading);
					}
				});
			};

		return $(this).each(function(i, e) {
			$(e).on('click', function(e) {
				e.preventDefault();
				var that = this;
				if ($(that).hasClass('unable')) {
					return null;
				}
				if (typeof opt.mobile == 'function') {
					opt.mobile = opt.mobile();
				}
				if (!opt.mobile) {
					return console.warn('sendcode():mobile参数错误！');
				}
				loading = $.box.msg('正在发送验证码...');
				if (typeof opt.sendBefore === 'function') {
					$(that).addClass('unable');
					opt.sendBefore(opt.mobile, function() {
						sendmsg.call(that, opt.mobile, opt.sendAfter);
					}, function() {
						$(that).removeClass('unable');
						$.box.hide(loading);
					});
				} else {
					sendmsg.call(that, opt.mobile, opt.sendAfter);
				}
			});
		});
	};

});