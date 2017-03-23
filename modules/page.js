/*
 * name: page.js
 * version: v1.0.0
 * update: extend jquery plugin & add "set" method
 * date: 2017-03-23
 */
define('page', function(require, exports, module) {
	"use strict";
	var $ = require('jquery'),
		etpl = require('etpl'),
		template = '<ul class="${wrapClass}">\
            <li><a href="javascript:;"<!-- if: ${isFirst} --> class="unable"<!-- else --> data-to="${prevPage}"<!-- /if -->>上一页</a></li>\
            <!-- for: ${pages} as ${page} -->\
            <li<!-- if: ${page.active} --> class="active"<!-- /if -->><a href="javascript:;" data-to="${page.to}">${page.num}</a></li>\
            <!-- /for -->\
            <li><a href="javascript:;"<!-- if: ${isLast} --> class="unable"<!-- else --> data-to="${nextPage}"<!-- /if -->>下一页</a></li>\
        </ul>',
		pagerender = etpl.compile(template),
		def = {
			el: null,
			current: 1,
			showNum: 5,
			total: null,
			holder: '...',
			onClick: null,
			hook: '',
			size: '', //sm | lg
			auto: true
		},
		render = function($el, pageData) {
			var showStart,
				showEnd,
				i,
				_;
			if (pageData.total < pageData.showNum) {
				pageData.showNum = pageData.total;
			}
			if (pageData.total < pageData.current) {
				pageData.current = pageData.total;
			}
			if (pageData.current <= pageData.showNum) {
				showStart = 1;
			} else if (pageData.total - pageData.current >= pageData.showNum) {
				showStart = pageData.current;
			} else {
				showStart = pageData.total - pageData.showNum + 1;
			}
			showEnd = showStart + pageData.showNum - 1;
			pageData.pages = [];
			for (i = showStart; i <= showEnd; i++) {
				_ = {
					num: i,
					to: i
				};
				if (pageData.current == i) {
					_.active = true;
				}
				pageData.pages.push(_);
			}

			if (showStart > pageData.showNum) {
				pageData.pages.splice(0, 0, {
					num: pageData.holder,
					to: pageData.current - pageData.showNum
				});
			}
			if (pageData.total > showEnd) {
				pageData.pages.push({
					num: pageData.holder,
					to: showEnd + 1
				});
			}
			pageData.isFirst = (pageData.current == 1);
			pageData.isLast = (pageData.current == pageData.total);
			if (!pageData.isFirst) {
				pageData.prevPage = pageData.current - 1;
			}
			if (!pageData.isLast) {
				pageData.nextPage = pageData.current + 1;
			}
			$el.data('pagedata', pageData).html(pagerender(pageData));
		},
		Page = function(config) {
			var opt = $.extend({}, def, config || {}),
				pageData,
				wrapClass = ['pagination'],
				set = function(conf) {
					if (pageData && conf && $.isPlainObject(conf)) {
						pageData.current = conf.current || pageData.current;
						pageData.total = conf.total || pageData.total;
						pageData.showNum = conf.showNum || pageData.showNum;
						render($(opt.el), pageData);
					}
				};
			if (!$(opt.el).length || !opt.total) {
				return console.warn('page():缺少el或total参数!');
			}

			if (opt.hook && opt.hook.split) {
				wrapClass.push($.trim(opt.hook));
			}
			if ($.trim(opt.size) !== 'sm' && $.trim(opt.size) !== 'lg') {
				opt.size = '';
			}
			if (opt.size) {
				wrapClass.push('pagination-' + opt.size);
			}
			pageData = $.extend(true, {
				wrapClass: wrapClass.join(' '),
				current: null,
				total: null,
				isFirst: null,
				isLast: null,
				pages: []
			}, opt);

			render($(opt.el), pageData);

			$(opt.el).unbind('click').on('click', 'a[data-to]', function(e) {
				e.preventDefault();
				if (!$(this).parent('.active').length && typeof(opt.onClick) === 'function') {
					opt.onClick($(this).data('to'));
				}
				if (opt.auto) {
					set({
						current: $(this).data('to')
					});
				}
			});
			return {
				set: set
			};
		};

	$.fn.page = function(config) {
		return Page($.extend(config || {}, {
			el: this
		}));
	};
	module.exports = Page;
});