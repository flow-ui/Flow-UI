/*
 * name: countdown.js
 * version: v1.0.2
 * update: 替换Date.now()写法
 * data: 2014-12-27
 */
define('countdown',function(require, exports, module) {
	var $ = require('jquery'),
		leadingZeros = function(num, length) {
			length = length || 2;
			num = String(num);
			if (num.length >= length) {
				return num;
			}
			return (Array(length).join('0') + num).substr(-length);
		};
	$.fn.Countdown = function(options) {
		var $this = $(this),
			NOW = new Date(),
			_startServer,
			_startLocal,
			getDiffDate,
			update,
			stop,
			opt = {
				begin: NOW,
				date: new Date(2089,01,05,02,25,00),
				refresh: 1000,
				offset: 0,
				onEnd: function() {},
				render: function($this,date) {
					$this.html( date.years + " 年, " +
						date.days + " 天, " +
						date.hours + " 时, " +
						date.min + " 分 " +
						date.sec + " 秒"
					)
				}
			};

		$.extend(opt,options);

		_startServer = opt.begin;
		_startLocal = NOW.getTime();
		getDiffDate = function() {
			var d = new Date();
			var now = d.getTime();
			var difftime = now - _startLocal;
			_startServer.setMilliseconds(_startServer.getMilliseconds() + difftime);
			_startLocal = now;
			var diff = (opt.date.getTime() - _startServer + opt.offset) / 1000;
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
					opt.onEnd();
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
		}

		update = function(newDate) {
			if (typeof newDate !== 'object') {
				newDate = new Date(newDate);
			}
			opt.date = newDate;
			opt.render($this, getDiffDate());
		}

		stop = function() {
			if (opt.interval) {
				clearInterval(opt.interval);
				opt.interval = false;
			}
		}
		// start
		if (opt.interval) {
			return;
		};
		opt.render($this, getDiffDate());
		if (opt.refresh) {
			opt.interval = setInterval(function(){
				opt.render($this, getDiffDate())
			}, opt.refresh);
		};
		return $this;
	}
})