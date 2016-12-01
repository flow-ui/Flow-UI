/*
 * name: city-selector.js
 * version: v0.0.5
 * update: loading居中
 * date: 2016-11-25
 */
define('city-select', function(require, exports, module) {
	var $ = require('jquery');
	var base = require('base');
	base.ajaxSetup($);
	require('tip');
	seajs.importStyle('\
		.city-selector-warp{display:none; position:absolute;z-index:99;background:#fff;border:1px solid #e5eaee;padding:0 15px;width:600px;}\
		.city-selector-head{position:relative; height:40px;line-height:40px;border-bottom:1px solid #e5eaee;}\
		.city-selector-head-back{display:inline-block;cursor:pointer; visibility:hidden;}\
		.city-selector-head-close{position:absolute;right:0;top:0;padding:0 .5em;cursor:pointer;font-family:tahoma;font-size:2em;}\
		.city-selector-head-back:hover,.city-selector-head-close:hover{color:#ff6e0a;}\
		.city-selector-items{overflow:hidden;}\
		.city-selector-item{float:left;width:12.5%;cursor:pointer;margin:1em 0;}\
		.city-selector-item:hover,.city-selector-items.cur{color:#ff6e0a;}\
		', module.uri);
	var def = {
			data: null,
			template: '<div class="city-selector-warp">\
					<div class="city-selector-head">\
						<div class="city-selector-head-back">返回</div>\
						<div class="city-selector-head-close">×</div>\
					</div>\
					<div class="city-selector-body">\
						<div class="city-selector-items"></div>\
					</div>\
				</div>',
			callback: function() {}
		},
		citySelectorThis,
		citySelectCallback,
		citySelectorTarget,
		cityData,
		cityDataKey = ['city', 'area'],
		citySelectResult = [],
		checkStatus = function(selectItem) {
			if (selectItem && selectItem.length) {
				//前进
				var _name = selectItem.text(),
					_id = selectItem.data('id'),
					_index = selectItem.index();
				if (_name && _id) {
					citySelectResult.push({
						name: _name,
						id: _id,
						index: _index
					});
				} else {
					console.log('所选地区数据异常');
				}
			} else if (citySelectResult.length) {
				//后退
				citySelectResult.pop();
			}
			//返回按钮状态
			if (citySelectResult.length) {
				citySelectorTarget.find('.city-selector-head-back').css('visibility', 'visible');
			} else {
				citySelectorTarget.find('.city-selector-head-back').css('visibility', 'hidden');
			}
		},
		renderData = function(dataIndex) {
			var _html = '',
				_data;
			if (citySelectResult.length) {
				var _cache = cityData;
				$.each(citySelectResult, function(i, e) {
					_cache = _cache[e.index][cityDataKey[i]];
				});

				_data = _cache;
			} else {
				_data = cityData;
			}
			if ($.isArray(_data)) {
				$.each(_data, function(i, e) {
					_html += ('<span class="city-selector-item" data-index="' + i + '" data-id="' + e.id + '">' + e.name + '</span>');
				});
				citySelectorTarget.find('.city-selector-items').html(_html).end().css({
					left: citySelectorThis.offset().left,
					top: citySelectorThis.offset().top + citySelectorThis.outerHeight(),
					display: 'block'
				});
			} else {
				//最终一级
				if (typeof(citySelectCallback) === 'function') {
					citySelectCallback.call(citySelectorThis, citySelectResult);
				}
				citySelectResult = [];
				citySelectorTarget.find('.city-selector-head-close').trigger('click');
			}
		};
	if (!$('#citySelectorTarget').length) {
		$('body').append($(def.template).attr('id', 'citySelectorTarget'));
	}
	citySelectorTarget = $('#citySelectorTarget');

	citySelectorTarget.on('click', '.city-selector-head-close', function(e) {
		//关闭
		e.preventDefault();
		citySelectResult = [];
		checkStatus();
		citySelectorTarget.hide();
	}).on('click', '.city-selector-head-back', function(e) {
		//返回
		e.preventDefault();
		checkStatus();
		renderData();
	}).on('click', '.city-selector-item', function(e) {
		//前进
		e.preventDefault();
		var $this = $(this);
		checkStatus($this);
		renderData($this.data('index'));
	});
	
	$.fn.citySelect = function(config) {
		return $(this).each(function(i, e) {
			var $this = $(e),
				opt = $.extend({}, def, config || {});
			if ($this.data('cityselectorinit')) return null;

			if ($.isArray(opt.data)) {
				cityData = opt.data;
			} else if(!opt.data || !opt.data.split || !/^([\w-]+:)?\/\/([^\/]+)/.test(opt.data)){
				return console.log('data配置错误！');
			}

			$this.on('click', function(e) {
				e.preventDefault();
				citySelectorThis = $this;
				citySelectCallback = opt.callback;
				if (cityData) {
					renderData();
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
								renderData();
							} else {
								console.log('city-select数据加载失败');
							}
						}
					});
				}
			});
			$this.data('cityselectorinit', true);
		});
	};
});