/*
 * name: page.js
 * version: v1.0.7
 * update: bug fix
 * date: 2017-08-10
 */
define('page', function(require, exports, module) {
	"use strict";
	var $ = window.$ || require('jquery'),
		etpl = require('etpl'),
		etplEngine = new etpl.Engine(),
		template = '<ul class="${wrapClass}">\
            <li><a href="javascript:;"<!-- if: ${isFirst} --> class="unable"<!-- else --> data-to="${prevPage}"<!-- /if -->>上一页</a></li>\
            <!-- for: ${pages} as ${page} -->\
            <li<!-- if: ${page.active} --> class="active"<!-- /if -->><a href="javascript:;" data-to="${page.to}">${page.num}</a></li>\
            <!-- /for -->\
            <li><a href="javascript:;"<!-- if: ${isLast} --> class="unable"<!-- else --> data-to="${nextPage}"<!-- /if -->>下一页</a></li>\
        </ul>',
		pagerender,
		def = {
			el: null,
			current: 1,
			showNum: 5,
			total: null,
			holder: '...',
			onChange: null,
			hook: '',
			size: '', //sm | lg
			auto: true
		},
		render = function($el, pageData) {
			var showStart,
				showEnd,
				i,
				_,
				_html = '';
			if (pageData.total !== 0) {
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
				_html = pagerender(pageData);
			}
			$el.data('pagedata', pageData).html(_html);
		},
		Page = function(config) {
			var opt = $.extend({}, def, config || {}),
				pageData,
				wrapClass = ['pagination'],
				set = function(conf) {
					var current = conf.current || pageData.current;
					pageData.total = conf.total || pageData.total;
					if (pageData.total < current) {
						current = pageData.total;
					}
					if ($(opt.el).data('pagedata').current !== current && typeof(opt.onChange) === 'function') {
						opt.onChange(current);
					}
					if (opt.auto && pageData && conf && $.isPlainObject(conf)) {
						pageData.current = current;
						pageData.showNum = conf.showNum || opt.showNum;
						render($(opt.el), pageData);
					}
				};
			if (!$(opt.el).length || typeof opt.total !== 'number') {
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
				set({
					current: $(this).data('to')
				});
			});
			return {
				set: set
			};
		};

	etplEngine.config({
		variableOpen: '${',
		variableClose: '}'
	});
	pagerender = etplEngine.compile(template);

	$.fn.page = function(config) {
		return Page($.extend({
			el: this
		}, config || {}));
	};
	module.exports = Page;
});