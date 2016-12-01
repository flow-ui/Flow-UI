/*
 * name: counter.js
 * version: v0.0.1
 * update: build
 * date: 2016-10-26
 */
define("counter", function(require, exports, module) {
	"use strict";
	seajs.importStyle('.counter_wrap{position: relative;display: inline-block;vertical-align: middle; padding:0 30px 0 0; white-space: nowrap;}\
		.pro_counter_val{ width:72px;height: 38px;line-height: 38px; text-align: center;margin:0 1px;padding:0;border:1px solid #a6a5aa;\
		box-shadow: 3px 3px 6px rgba(0,0,0,.1) inset;margin:0;}\
		.pro_counter_btn{position: absolute; right:0; width:24px;height:18px; line-height: 18px; margin:0;padding:0;background: #f8f8f8;\
		border:1px solid #a6a5aa;cursor: pointer; outline: none}\
		.pro_counter_btn:hover{background:#ddd;border-color:#aaa;}\
		.pro_counter_btn.disabled{background:#fff;cursor: default;}\
		.pro_counter_reduce{bottom:0;}\
		.pro_counter_add{top:0;}\
		.pro_counter_inline{padding:0 22px;}\
		.pro_counter_inline .pro_counter_val{width:40px; height: 24px;line-height: 24px;box-shadow: none;border-color:@gray-light;}\
		.pro_counter_inline .pro_counter_btn{width:22px;height: 26px;line-height: 26px;}\
		.pro_counter_inline .pro_counter_reduce{right:auto;left: 0;border-right:0;}\
		.pro_counter_inline .pro_counter_add{border-left: 0;}', module.uri);
	var $ = require('jquery');
	var def = {
		template: function(style, minbuycount, max, init) {
			if (!style.split || isNaN(Number(minbuycount)) || isNaN(Number(max)) || isNaN(Number(init))) {
				return console.warn('模板参数错误！');
			}
			switch($.trim(style)){
				case "inline":
					style = ' pro_counter_inline';
					break;
				default:
					style = '';
			}
			return '<div class="counter_wrap' + style + '">\
                        <button type="button" class="pro_counter_btn pro_counter_reduce" data-minbuycount="' + minbuycount + '">-</button>\
                        <input type="text" value="' + init + '" data-max="' + max + '" class="pro_counter_val">\
                        <button type="button" class="pro_counter_btn pro_counter_add" data-minbuycount="' + minbuycount + '">+</button>\
                    </div>';
		},
		mode: 'replace', // 'insert' || 'replace'
		init: 0,
		minbuycount: 1,
		max: Number.POSITIVE_INFINITY,
		style: 'default', // 'default' || 'inline'
		callback: function() {}
	};
	var catchClickEvent = function(e) {
		var target = $(e.target),
			_input,
			_min,
			_plus,
			_max,
			minBuyCount;
		//计数器减
		if (target.is('.pro_counter_reduce') || target.parents('.pro_counter_reduce').length) {
			e.preventDefault();
			if (target.parents('.pro_counter_reduce').length) {
				target = target.parents('.pro_counter_reduce');
			}
			_input = target.parent().find('.pro_counter_val');
			_min = target;
			_plus = target.parent().find('.pro_counter_add');
			_max = _input.data('max') ? Number(_input.data('max')) : Number.POSITIVE_INFINITY;
			minBuyCount = target.data('minbuycount') || 1;

			if (target.hasClass('disabled')) {
				return null;
			}
			if (parseInt(_input.val()) <= (1 + minBuyCount)) {
				_input.val(minBuyCount);
				_min.addClass('disabled');
				_plus.removeClass('disabled');
			} else {
				_input.val(parseInt(_input.val()) <= _max ? (parseInt(_input.val()) - minBuyCount) : _max);
				_plus.removeClass('disabled');
			}
			_input.parents('.counter_wrap').data('countercallback')(_input);
		}
		//计数器增加
		if (target.is('.pro_counter_add') || target.parents('.pro_counter_add').length) {
			e.preventDefault();
			if (target.parents('.pro_counter_add').length) {
				target = target.parents('.pro_counter_add');
			}
			_input = target.parent().find('.pro_counter_val');
			_min = target.parent().find('.pro_counter_reduce');
			_plus = target;
			_max = _input.data('max') ? Number(_input.data('max')) : Number.POSITIVE_INFINITY;
			minBuyCount = target.data('minbuycount') || 1;
			if (target.hasClass('disabled')) {
				return null;
			}
			if (parseInt(_input.val()) < _max - minBuyCount) {
				_input.val(parseInt(_input.val()) + minBuyCount);
				_min.removeClass('disabled');
			} else {
				_input.val(_max);
				_plus.addClass('disabled');
				_min.removeClass('disabled');
			}
			_input.parents('.counter_wrap').data('countercallback')(_input);
		}
	};
	var catchBlurEvent = function(e) {
		var target = $(e.target),
			_input,
			_min,
			_plus,
			_max,
			_val;
		_input = target;
		_min = target.parent().find('.pro_counter_reduce');
		_plus = target.parent().find('.pro_counter_add');
		_max = _input.data('max') ? Number(_input.data('max')) : Number.POSITIVE_INFINITY;
		_val = isNaN(parseInt(_input.val().replace(/\D/g, ""))) ? 0 : parseInt(_input.val().replace(/\D/g, ""));
		_input.val(_val);

		if (_val <= 1) {
			_input.val('1');
		} else if (_val >= _max) {
			_input.val(_max);
			_plus.addClass('disable');
		} else {
			_min.removeClass('disable');
			_plus.removeClass('disable');
		}
		_input.parents('.counter_wrap').data('countercallback')(_input);
	};

	$.fn.counter = function(config) {
		var $this = $(this),
			opt = $.extend({}, def, config || {});
		//统一绑定事件
		if (!$('body').data('countereventinit')) {
			$('body').on('click', catchClickEvent).on('blur', '.pro_counter_val', catchBlurEvent).data('countereventinit', 1);
		}
		return $this.each(function(i, e) {
			if (opt.mode === 'insert') {
				$(e).html(opt.template(opt.style, opt.minbuycount, opt.max, opt.init)).data('countercallback', opt.callback);
			} else {
				var newDom = $(opt.template(opt.style, opt.minbuycount, opt.max, opt.init)).data('countercallback', opt.callback);
				$(e).after(newDom);
				$(e).remove();
				newDom = null;
			}
		});
	};
});