/*
 * name: label.js
 * version: v0.0.1
 * update: build
 * date: 2017-12-28
 */
define('label', function(require, exports, module) {
	"use strict";
	var $ = window.jQuery || require('jquery'),
		def = {
			el: null,
			color: null,
			data: null, //{text: ''}
			closable: false,
			type: null,
			size: null,
			onClose: null
		},
		Label = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(opt.el).eq(0),
				classTemp = [],
				render = function(opt) {
					var html = '';
					if(!$.isArray(opt.data)){
						return console.warn('label(): data方法参数有误！');
					}
					$.each(opt.data, function(i, e) {
						html += ('<span class="label" data-index="' + i + '">' + e.text + (opt.closable ? '<i class="ion">&#xe7de;</i>' : '') + '</span>');
					});
					return $this.html($(html).addClass(classTemp.join(' ')));
				};
			if (!$this.length || $this.data('label-init')) {
				return null;
			}
			if (!$.isArray(opt.data) || !opt.data.length) {
				return console.warn('label(): data 配置有误!');
			}
			if (opt.color && opt.color.split) {
				classTemp.push('label-' + opt.color);
			}
			if (opt.closable) {
				classTemp.push('label-closable');
			}
			switch (opt.type) {
				case 'bordered':
					classTemp.push('label-bordered');
					break;

			}
			switch (opt.size) {
				case 'sm':
					classTemp.push('label-sm');
					break;
				case 'lg':
					classTemp.push('label-lg');
					break;
			}

			render(opt);

			$this.data('label-init', true);

			if (opt.closable) {
				$this.on('click', '.label-closable', function() {
					var i = $(this).data('index');
					if (i !== void 0) {
						var deltag = opt.data.splice(i, 1);
						render(opt);
						if (typeof opt.onClose === 'function') {
							opt.onClose(deltag[0]);
						}
					}
				});
			}

			return {
				data: function(value) {
					if (value === void 0) {
						return opt.data;
					} else if ($.isArray) {
						opt.data = value;
						return render(opt);
					}
				}
			};
		};

	$.fn.label = function(config) {
		return Label($.extend({
			el: this
		}, config || {}));
	};
	module.exports = Label;
});