/*
 * name: progress.js
 * version: v0.0.1
 * update: build
 * date: 2017-12-28
 */
define('progress', function(require, exports, module) {
	"use strict";
	var $ = require('jquery'),
		def = {
			el: null,
			persent: 0,
			color: 'info',
			height: 0,
			showInfo: true,
			infoRender: function(persent) {
				return persent + '%';
			}
		},
		template = '<div class="progress">\
    <div class="progress-inner">\
        <div class="progress-bg"></div>\
    </div>\
</div>',
		Progress = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(config.el).eq(0),
				$progress,
				classTemp = [],
				setColor = function(value) {
					if (value !== void(0) && value.split) {
						$progress.removeClass('progress-' + opt.color).addClass('progress-' + value);
						opt.color = value;
					} else {
						return opt.color;
					}
				},
				setPersent = function(persent) {
					var initPersent;
					if (isNaN(parseFloat(persent)) || parseFloat(persent) < 0) {
						initPersent = 0;
					} else {
						initPersent = Math.min(100, parseFloat(persent));
					}
					opt.persent = initPersent;
					$progress.find('.progress-bg').width(initPersent + '%').end().find('.progress-text').html(opt.infoRender(initPersent, {
						color: setColor
					}));
				};
			if (!$this.length || $this.data('progress-init')) {
				return null;
			}
			$progress = $(template);

			if (opt.color && opt.color.split) {
				classTemp.push('progress-' + opt.color);
			}

			if (opt.height) {
				$progress.find('.progress-bg').height(opt.height);
			}
			
			if (opt.showInfo) {
				$progress.append('<span class="progress-text"></span>');
				classTemp.push('progress-show-info');
			}
			
			setPersent(opt.persent);

			$progress.addClass(classTemp.join(' '));

			$this.data('progress-init', 1).append($progress);

			return {
				persent: function(value) {
					if (value !== void(0) && !isNaN(parseFloat(value))) {
						setPersent(value);
					} else {
						return opt.persent;
					}
				},
				color: setColor,
				destroy: function() {
					$this.data('progress-init', null);
					$progress.remove();
					delete this.persent;
					delete this.color;
					delete this.destroy;
				}
			};
		};

	$.fn.progress = function(config) {
		return Progress($.extend({
			el: this
		}, config || {}));
	};
	module.exports = Progress;
});