/*
 * name: city-selector.js
 * version: v1.0.0
 * update: callback => onSelect; add val() method
 * date: 2017-03-27
 */
define('city-select', function(require, exports, module) {
	'use strict';
	seajs.importStyle('\
		.city-selector-warp{display:none; position:absolute;z-index:99;background:#fff;border:1px solid #e5eaee;padding:0 15px;width:600px;}\
		.city-selector-head{position:relative; height:40px;line-height:40px;border-bottom:1px solid #e5eaee;}\
		.city-selector-head-back{display:inline-block;cursor:pointer; visibility:hidden;}\
		.city-selector-head-close{position:absolute;right:0;top:0;padding:0 .5em;cursor:pointer;font-family:tahoma;font-size:2em;}\
		.city-selector-head-back:hover,.city-selector-head-close:hover{color:#ff6e0a;}\
		.city-selector-items{overflow:hidden;}\
		.city-selector-item{float:left; cursor:pointer;margin:1em;}\
		.city-selector-item:hover,.city-selector-items.cur{color:#ff6e0a;}', module.uri);
	require('tip');
	var $ = require('jquery'),
		base = require('base'),
		def = {
			el: null,
			textKey: 'name',
			subKeys: ['city', 'area'],
			data: null,
			readOnly: true,
			onSelect: null
		},
		template = '<div class="city-selector-warp">\
	<div class="city-selector-head">\
		<div class="city-selector-head-back">返回</div>\
		<div class="city-selector-head-close">×</div>\
	</div>\
	<div class="city-selector-body">\
		<div class="city-selector-items"></div>\
	</div>\
</div>',
		cityData,
		citySelectorTarget = $('#citySelectorTarget'),
		citySelectResult = [],
		checkStatus = function(selectItem) {
			//返回按钮状态
			if (citySelectResult.length) {
				citySelectorTarget.find('.city-selector-head-back').css('visibility', 'visible');
			} else {
				citySelectorTarget.find('.city-selector-head-back').css('visibility', 'hidden');
			}
		},
		render = function(citySelectorThis, citySelectCallback) {
			var _html = '',
				_data,
				_result = [],
				opt;
			if (citySelectorThis && citySelectorThis.length) {
				citySelectorTarget.data('el', citySelectorThis);
			} else {
				citySelectorThis = citySelectorTarget.data('el');
			}

			opt = citySelectorThis.data('cityselecteropt');

			if (typeof citySelectCallback === 'function') {
				citySelectorTarget.data('cb', citySelectCallback);
			} else {
				citySelectCallback = citySelectorTarget.data('cb');
			}
			if (!citySelectorThis) {
				return console.warn('render() 异常！');
			}
			
			if (citySelectResult.length) {
				var _cache = cityData;
				$.each(citySelectResult, function(i, e) {
					var thisData = base.deepcopy(_cache[e]);
					_cache = _cache[e][opt.subKeys[i]];
					delete thisData[opt.subKeys[i]];
					_result.push(thisData);
				});
				_data = _cache;
			} else {
				_data = cityData;
			}
			if ($.isArray(_data) && _data.length) {
				$.each(_data, function(i, e) {
					_html += ('<span class="city-selector-item" data-index="' + i + '">' + e[opt.textKey] + '</span>');
				});
				citySelectorTarget.find('.city-selector-items').html(_html).end().css({
					left: citySelectorThis.offset().left,
					top: citySelectorThis.offset().top + citySelectorThis.outerHeight(),
					display: 'block'
				});
			} else {
				//最终一级
				citySelectorThis.data('result', _result);
				if (typeof(citySelectCallback) === 'function') {
					citySelectCallback.call(citySelectorThis, _result);
				}
				citySelectResult = [];
				citySelectorTarget.find('.city-selector-head-close').trigger('click');
			}
		};

	base.ajaxSetup($);

	if (!citySelectorTarget.length) {
		citySelectorTarget = $(template).attr('id', 'citySelectorTarget').appendTo('body');
	}

	citySelectorTarget.on('click', '.city-selector-head-close', function(e) {
		//关闭
		e.preventDefault();
		citySelectorTarget.hide();
	}).on('click', '.city-selector-head-back', function(e) {
		//返回
		e.preventDefault();
		if (citySelectResult.length) {
			citySelectResult.pop();
		}
		checkStatus();
		render();
	}).on('click', '.city-selector-item', function(e) {
		//前进
		e.preventDefault();
		citySelectResult.push($(this).data('index'));
		checkStatus();
		render();
	});

	var citySelect = function(config) {
		var opt = $.extend({}, def, config || {});
		if (!$(opt.el).length) {
			return console.warn('citySelect():缺少el参数！');
		}

		if (!opt.textKey || !opt.textKey.split) {
			return console.warn('citySelect(): 缺少textKey参数！');
		}

		if ($.isArray(opt.data)) {
			cityData = base.deepcopy(opt.data);
		} else if (!opt.data || !opt.data.split) {
			return console.warn('citySelect(): data配置错误！');
		}

		$(opt.el).each(function(i, e) {
			var $this = $(e);
			if (!$this.data('cityselecteropt')) {
				$this.data('cityselecteropt', opt);

				if (opt.readOnly && ($this.is('input') || $this.is('textarea'))) {
					$this.on('focus', function(e) {
						$this.blur();
					});
				}

				$this.on('click', function(e) {
					e.preventDefault();
					if (cityData) {
						render($this, opt.onSelect);
					} else {
						var loading = $this.tip('加载中...', {
							place: 'bottom-center',
							modal: true,
							show: true
						});
						$.ajax({
							url: opt.data,
							localCache: 1e6,
							success: function(res) {
								loading.hide();
								if (res.status === 'Y') {
									cityData = res.data;
									render($this, opt.onSelect);
								} else {
									console.warn('city-select数据加载失败');
								}
							}
						});
					}
				});
			}
		});

		return {
			val: function(value){
				if(value && value.split){
					value = value.split(',');
					citySelectResult = [];
					if (value.length) {
						var _cache = cityData;
						$.each(value, function(i, e) {
							$.each(_cache, function(di, data){
								if(e === data[opt.textKey]){
									var thisData = base.deepcopy(data);
									_cache = _cache[di][opt.subKeys[i]];
									delete thisData[opt.subKeys[i]];
									citySelectResult.push(di);
								}
							});
						});
						return render($(opt.el), opt.onSelect);
					}
				}else{
					return $(opt.el).data('result');
				}
			}
		};
	};

	$.fn.citySelect = function(config) {
		return citySelect($.extend({
			el: this
		}, config || {}));
	};
	module.exports = citySelect;
});