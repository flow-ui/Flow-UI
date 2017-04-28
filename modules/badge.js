/*
 * name: badge.js
 * version: v0.0.1
 * update: build
 * date: 2017-12-28
 */
define('badge', function(require, exports, module) {
	"use strict";
	var $ = window.$ || require('jquery'),
		def = {
			el: null,
			slot: true,
			color: 'danger',
			max: 99,
			count: 0,
			dot: false
		},
		Badge = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(opt.el).eq(0),
				$badge,
				set = function(count) {
					if (isNaN(parseInt(count)) || parseInt(count) < 0) {
						count = 0;
					} else {
						count = parseInt(count);
					}
					opt.count = count;
					if (opt.dot) {
						if (count) {
							if (!$badge.find('.badge-dot').length) {
								$badge.append('<sup class="badge-dot"></sup>');
							}
						} else {
							$badge.find('.badge-dot').remove();
						}
					} else {
						if (count || !opt.slot) {
							if (!$badge.find('.badge-count').length) {
								$badge.append('<sup class="badge-count"></sup>');
							}
							$badge.find('.badge-count').text(count > opt.max ? opt.max + '+' : count);
						} else {
							$badge.find('.badge-count').remove();
						}
					}
				};
			if (!$this.length || $this.data('badge-init')) {
				return null;
			}

			if (opt.slot) {
				$this.data('badge-init', true).wrap('<div class="badge"></div>');
				$badge = $this.parent('.badge');
			} else {
				$badge = $('<div class="badge"></div>');
				$this.data('badge-init', true).append($badge);
			}
			
			if ($.trim(opt.color) !== 'danger') {
				$badge.addClass('badge-' + $.trim(opt.color));
			}

			set(opt.count);

			return {
				count: function(value) {
					if (value === void 0) {
						return opt.count;
					} else if (parseInt(value) !== opt.count) {
						set(parseInt(value));
					}
				}
			};
		};

	$.fn.badge = function(config) {
		return Badge($.extend({
			el: this
		}, config || {}));
	};
	module.exports = Badge;
});