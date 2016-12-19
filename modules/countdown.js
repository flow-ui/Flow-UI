/*
 * name: countdown.js
 * version: v1.0.3
 * update: 优化
 * data: 2016-12-19
 */
define('countdown', function(require, exports, module) {
	'use strict';
	var $ = require('jquery'),
		leadingZeros = function(num, length) {
			length = length || 2;
			num = String(num);
			if (num.length >= length) {
				return num;
			}
			return (Array(length).join('0') + num).substr(-length);
		},
		def = {
			begin: null,
			date: null,
			refresh: 1000,
			offset: 0,
			onEnd: null,
			render: function(dom, date) {
				dom.html(date.years + " 年, " +
					date.days + " 天, " +
					date.hours + " 时, " +
					date.min + " 分 " +
					date.sec + " 秒"
				);
			}
		};
	$.fn.Countdown = function(options) {
		return $(this).each(function(i, e) {
			var $this = $(e),
				_startServer,
				_startLocal,
				_endServer,
				getDiffDate,
				stop,
				opt = $.extend({}, def, options || {});
			if (!opt.begin) {
				opt.begin = new Date();
			}
			if (!opt.date) {
				return console.warn("Countdown()参数错误");
			}
			_startServer = new Date(opt.begin).getTime();
			_startLocal = new Date().getTime();
			_endServer = new Date(opt.date).getTime();
			getDiffDate = function() {
				var diff = (_endServer - (_startServer + new Date().getTime() - _startLocal) + opt.offset) / 1000;
				var dateData = {
					years: 0,
					days: 0,
					hours: 0,
					min: 0,
					sec: 0,
					millisec: 0
				};
				if (diff <= 0) {
					if (opt.interval) {
						stop();
						typeof(opt.onEnd) === 'function' && opt.onEnd($this);
					}
					dateData.hours = leadingZeros(dateData.hours);
					dateData.min = leadingZeros(dateData.min);
					dateData.sec = leadingZeros(dateData.sec);
					return dateData;
				}
				if (diff >= (365.25 * 86400)) {
					dateData.years = Math.floor(diff / (365.25 * 86400));
					diff -= dateData.years * 365.25 * 86400;
				}
				if (diff >= 86400) {
					dateData.days = Math.floor(diff / 86400);
					diff -= dateData.days * 86400;
				}
				if (diff >= 3600) {
					dateData.hours = Math.floor(diff / 3600);
					diff -= dateData.hours * 3600;
				}
				if (diff >= 60) {
					dateData.min = Math.floor(diff / 60);
					diff -= dateData.min * 60;
				}
				dateData.sec = Math.round(diff);
				dateData.millisec = diff % 1 * 1000;
				dateData.hours = leadingZeros(dateData.hours);
				dateData.min = leadingZeros(dateData.min);
				dateData.sec = leadingZeros(dateData.sec);
				return dateData;
			};

			stop = function() {
				if (opt.interval) {
					clearInterval(opt.interval);
					opt.interval = null;
				}
			};
			// start
			if (opt.interval) {
				return;
			}

			if (opt.refresh && typeof(opt.render) === 'function') {
				opt.render($this, getDiffDate());
				opt.interval = setInterval(function() {
					opt.render($this, getDiffDate());
				}, opt.refresh);
			}
		});
	};
});