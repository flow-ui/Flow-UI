/*
 * name: input-number.js
 * version: v0.0.2
 * update: bug fix
 * date: 2016-10-26
 */
define("input-number", function(require, exports, module) {
	"use strict";
	seajs.importStyle('.pro_counter_val{ min-width:2em;text-align: center;}\
		.pro_counter_btn{cursor:pointer;user-select:none;}\
		.pro_counter_btn:hover{color:#000;}\
		.pro_counter_btn.disabled{background:#fff;cursor: not-allowed;}\
		.counter_default{position: relative;display: inline-block;vertical-align: middle; padding:0 30px 0 0; white-space: nowrap;}\
		.counter_default .pro_counter_val{height:38px;line-height:38px;border-radius:4px 0 0 4px;}\
		.counter_default .pro_counter_btn{position: absolute; right:0; width:29px;height:18px; line-height: 18px; margin:0;padding:0;\
		background: #f8f8f8; border:1px solid #e8e9eb;border-left:0;text-align:center; outline: none}\
		.counter_default .pro_counter_btn:hover{background:#eee;}\
		.counter_default .pro_counter_reduce{bottom:0;border-top:0;border-bottom-right-radius:4px;}\
		.counter_default .pro_counter_add{top:0;border-bottom:0;border-top-right-radius:4px;}\
		.counter_wrap:hover .pro_counter_btn, .counter_wrap:hover .pro_counter_val{border-color:#ccc;}', module.uri);
	var $ = require('jquery');
	var def = {
		template: function(style, minbuycount, max, init) {
			if (!style.split || isNaN(Number(minbuycount)) || isNaN(Number(max)) || isNaN(Number(init))) {
				return console.warn('模板参数错误！');
			}
			var _temp;
			switch($.trim(style)){
				case "inline":
					_temp = '<div class="counter_wrap counter_inline input-group">\
                        <div class="pro_counter_btn pro_counter_reduce input-group-addon" data-minbuycount="' + minbuycount + '">-</div>\
                        <input type="text" value="' + init + '" data-max="' + max + '" class="form-control pro_counter_val">\
                        <div class="pro_counter_btn pro_counter_add input-group-addon" data-minbuycount="' + minbuycount + '">+</div>\
                    </div>';
					break;
				default:
					_temp = '<div class="counter_wrap counter_default">\
                        <div class="pro_counter_btn pro_counter_reduce" data-minbuycount="' + minbuycount + '">-</div>\
                        <input type="text" value="' + init + '" data-max="' + max + '" class="form-control pro_counter_val">\
                        <div class="pro_counter_btn pro_counter_add" data-minbuycount="' + minbuycount + '">+</div>\
                    </div>';
			}
			return _temp;
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

	$.fn.inputNumber = function(config) {
		var $this = $(this),
			opt = $.extend({}, def, config || {});
		//统一绑定事件
		if (!$('body').data('countereventinit')) {
			$('body').on('click', catchClickEvent).on('blur', '.pro_counter_val', catchBlurEvent).data('countereventinit', 1);
		}
		return $this.each(function(i, e) {
			if (opt.mode === 'insert') {
				$(e).html(opt.template(opt.style, opt.minbuycount, opt.max, opt.init)).children('.counter_wrap').data('countercallback', opt.callback);
			} else {
				var newDom = $(opt.template(opt.style, opt.minbuycount, opt.max, opt.init)).data('countercallback', opt.callback);
				$(e).after(newDom);
				$(e).remove();
				newDom = null;
			}
		});
	};
});