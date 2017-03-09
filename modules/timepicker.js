/*
 * name: timepicker.js
 * version: v0.0.1
 * update: build
 * date: 2017-03-08
 */
define('timepicker', function(require, exports, module) {
	"use strict";
	seajs.importStyle('.timepicker-ui{white-space:nowrap;overflow:hidden;border-radius: 4px; box-shadow: 0 1px 6px rgba(0,0,0,.2);}\
		.timepicker-ui ul{display:inline-block;vertical-align:top;width: 60px;max-height: 144px;overflow: hidden;border-left:1px solid #e3e8ee;margin-left:-1px;}\
		.timepicker-ui ul:hover{overflow:auto;}\
		.timepicker-ui li{height: 24px;line-height: 24px;width:100%; padding: 0 0 0 16px;text-align: left;user-select: none;cursor: pointer;transition: background .2s ease-in-out;}\
		.timepicker-ui li:hover,.timepicker-ui li._check{background:#f3f3f3}\
		.timepicker-ui-confirm{border-top: 1px solid #e3e8ee;text-align: right;padding: 8px;clear: both;}', module.uri);
	var $ = require('jquery'),
		Tip = require('tip'),
		def = {
			el: null,
			trigger: 'click',
			value: '',
			format: 'hh:mm:ss',
			hours: 24,
			place: 'bottom-left',
			checkClass: 'text-primary',
			confirm: false,
			show: false,
			onchange: null
		},
		pad = function(num, n) {
			if (typeof num === 'number') {
				var len = num.toString().length;
				while (len < n) {
					num = "0" + num;
					len++;
				}
			}
			return num;
		},
		dateRender = function(date, format) {
			if (format.indexOf('hh') === -1 && format.indexOf('mm') === -1 && format.indexOf('ss') === -1) {
				format = def.format;
				return console.warn('timepicker: format配置有误，已重置为默认');
			}
			var hours, minutes, secends;
			if ($.isPlainObject(date)) {
				hours = date.hh;
				minutes = date.mm;
				secends = date.ss;
			} else {
				hours = date.getHours();
				minutes = date.getMinutes();
				secends = date.getSeconds();
			}
			return format.replace('hh', pad(hours, 2)).replace('mm', pad(minutes, 2)).replace('ss', pad(secends, 2));
		},
		timeParser = function(value, format) {
			var hoursStart = format.indexOf('hh'),
				minutesStart = format.indexOf('mm'),
				secendsStart = format.indexOf('ss'),
				hours = hoursStart !== -1 ? value.substring(hoursStart, hoursStart + 2) : void(0),
				minutes = minutesStart !== -1 ? value.substring(minutesStart, minutesStart + 2) : void(0),
				secends = secendsStart !== -1 ? value.substring(secendsStart, secendsStart + 2) : void(0);
			return {
				hh: hours === void(0) ? hours : (isNaN(parseInt(hours)) ? 0 : parseInt(hours)),
				mm: minutes === void(0) ? minutes : (isNaN(parseInt(minutes)) ? 0 : parseInt(minutes)),
				ss: secends === void(0) ? secends : (isNaN(parseInt(secends)) ? 0 : parseInt(secends))
			};
		},
		domRender = function(timeObj, opt) {
			var result = '<div class="timepicker-ui">';
			var repeat = function(num, mark, val) {
				var Dom = '<ul data-mark="' + mark + '">',
					i = 0;
				for (; i < num; i++) {
					Dom += ('<li data-index="' + i + '"' + (val === i ? (' class="' + opt.checkClass + '"') : '') + '>' + pad(i, 2) + '</li>');
				}
				Dom += '</ul>';
				return Dom;
			};
			$.each(timeObj, function(key, val) {
				if (val !== void(0)) {
					var repeattime = 60;
					if (key === 'hh') {
						repeattime = opt.hours;
					}
					result += repeat(repeattime, key, val);
				}
			});
			if (opt.confirm) {
				result += '<div class="timepicker-ui-confirm"><span class="btn btn-sm btn-default _clear">清空</span> <span class="btn btn-sm btn-primary _conf">确定</span></div>';
			}
			result += '</div>';
			return result;
		},
		checkStatus = function($timepicker, opt) {
			var result = {},
				$liHeight = $timepicker.find('li').outerHeight();
			$timepicker.find('ul').each(function(i, ul) {
				if (!$(ul).find('._check').length) {
					$(ul).find('li').eq(0).addClass(opt.checkClass);
				}
				result[$(ul).data('mark')] = $(ul).find('._check').data('index');
				$(ul).animate({
					scrollTop: $liHeight * ($(ul).find('._check').data('index'))
				}, 300);
			});
			opt.value = dateRender(result, opt.format);
			return opt.value;
		},
		TimePicker = function(config) {
			var opt = $.extend({}, def, config || {});
			if (!$(opt.el).length) {
				return console.warn('timepicker:el元素不存在!');
			}
			if (opt.hours !== 24 && opt.hours !== 12) {
				opt.hours = def.hours;
			}
			if (!$.trim(opt.value)) {
				opt.value = dateRender(new Date(), opt.format);
			}
			if ($(opt.el).prop('value') !== void(0)) {
				$(opt.el).val(dateRender(timeParser(opt.value, opt.format), opt.format));
			}
			opt.checkClass = $.trim(opt.checkClass) + ' _check';
			var pickerGenerate = function() {
				var timedate = timeParser(opt.value, opt.format);
				return domRender(timedate, opt);
			};
			var timepickerObject = Tip(pickerGenerate, {
				el: opt.el,
				trigger: opt.trigger,
				hasarr: false,
				offset: 6,
				place: opt.place,
				show: opt.show,
				onshow: function() {
					var $timepicker = $('.timepicker-ui');
					checkStatus($timepicker, opt);
					$timepicker.on('update', function(e, publish) {
						var result = checkStatus($(this), opt);
						if ($(opt.el).prop('value') !== void(0)) {
							$(opt.el).val(result);
						}
						if (publish) {
							if (typeof opt.onchange === 'function') {
								opt.onchange(result);
							}
						}
					}).on('click', 'li', function() {
						$(this).addClass(opt.checkClass).siblings().removeClass(opt.checkClass);
						$timepicker.trigger('update', !opt.confirm);
					});
					if (opt.confirm) {
						$timepicker.on('click', '._clear', function() {
							$timepicker.find('._check').removeClass(opt.checkClass).end().trigger('update', true);
							timepickerObject.hide();
						}).on('click', '._conf', function() {
							$timepicker.trigger('update', true);
							timepickerObject.hide();
						});
					}
				}
			});
			return timepickerObject;
		};

	$.fn.timepicker = function(config) {
		return TimePicker($.extend(config || {}, {
			el: this
		}));
	};

	module.exports = TimePicker;

});