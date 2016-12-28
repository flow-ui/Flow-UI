/*
 * name: page.js
 * version: v0.0.1
 * update: build
 * date: 2016-12-28
 */
define('page', function(require, exports, module) {
	"use strict";
	seajs.importStyle('.pagination{display:inline-block;padding-left:0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:8px 15px;margin-left:-1px;line-height:1.42857143;color:#ff6e0a;text-decoration:none;background-color:#fff;border:1px solid #ddd}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-top-left-radius:4px;border-bottom-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-top-right-radius:4px;border-bottom-right-radius:4px}.pagination>li>a:focus,.pagination>li>a:hover,.pagination>li>span:focus,.pagination>li>span:hover{color:#ff6e0a;background-color:#eee}.pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover,.pagination>.active>span,.pagination>.active>span:focus,.pagination>.active>span:hover{z-index:2;color:#fff;cursor:default;background-color:#ff6e0a;border-color:#ff6e0a}.pagination>.disabled>a,.pagination>.disabled>a:focus,.pagination>.disabled>a:hover,.pagination>.disabled>span,.pagination>.disabled>span:focus,.pagination>.disabled>span:hover{color:#777;cursor:not-allowed;background-color:#fff;border-color:#ddd}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px;line-height:1.3333333}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-top-left-radius:6px;border-bottom-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-top-right-radius:6px;border-bottom-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px;line-height:1.5}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-top-left-radius:3px;border-bottom-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-top-right-radius:3px;border-bottom-right-radius:3px}.pagination>li>.unable,.pagination>li>.unable:hover{color:#ccc;cursor:default;background:#fff}'
		, module.uri);
	var $ = require('jquery'),
		etpl = require('etpl'),
		template = '<ul class="pagination${size}${hook}">\
                        <li><a href="javascript:;"<!-- if: ${isFirst} --> class="unable"<!-- else --> data-to="${prevPage}"<!-- /if -->>上一页</a></li>\
                        <!-- for: ${pages} as ${page} -->\
                        <li<!-- if: ${page.active} --> class="active"<!-- /if -->><a href="javascript:;" data-to="${page.to}">${page.num}</a></li>\
                        <!-- /for -->\
                        <li><a href="javascript:;"<!-- if: ${isLast} --> class="unable"<!-- else --> data-to="${nextPage}"<!-- /if -->>下一页</a></li>\
                    </ul>',
        pagerender = etpl.compile(template),
        def = {
        	wrap:null,
        	number:1,
			showNum: 5,
			totalPages:null,
			holder: '...',
			onClick:null,
			hook: '',
			size: ''	//sm | lg
		},
		renderPage = function(config) {
			var opt = $.extend({},def,config || {}),
				pageData,
				showStart,
				showEnd,
				i,
				_;
			if (!$(opt.wrap).length || !opt.totalPages) {
				return console.warn('page():参数异常');
			}
			
			if(opt.hook && opt.hook.split){
				opt.hook = ' ' + $.trim(opt.hook);
			}
			if($.trim(opt.size) !== 'sm' && $.trim(opt.size) !== 'lg'){
				opt.size = '';
			}else{
				opt.size = ' pagination-' + $.trim(opt.size);
			}
			pageData = $.extend({
				number: null,
				totalPages: null,
				isFirst: null,
				isLast: null,
				pages: []
			}, opt);

			if(pageData.totalPages < opt.showNum){
				opt.showNum = pageData.totalPages;
			}
			if(pageData.number <= opt.showNum){
				showStart = 1;
			}else if(pageData.totalPages - pageData.number >= opt.showNum){
				showStart = pageData.number;
			}else {
				showStart = pageData.totalPages - opt.showNum + 1;
			}
			showEnd = showStart + opt.showNum - 1;

			for (i = showStart; i <= showEnd; i++) {
				_ = {
					num: i,
					to: i
				};
				if (pageData.number == i) {
					_.active = true;
				}
				pageData.pages.push(_);
			}

			if(showStart > opt.showNum){
				pageData.pages.splice(0,0,{
					num: opt.holder,
					to: pageData.number - opt.showNum
				});
			}
			if (pageData.totalPages > showEnd) {
				pageData.pages.push({
					num: opt.holder,
					to: showEnd + 1
				});
			}
			pageData.isFirst = (pageData.number == 1);
			pageData.isLast = (pageData.number == pageData.totalPages);
			if(!pageData.isFirst){
				pageData.prevPage = pageData.number - 1;
			}
			if(!pageData.isLast){
				pageData.nextPage = pageData.number + 1;
			}
			$(opt.wrap).html(pagerender(pageData)).on('click','a[data-to]', function(e){
				e.preventDefault();
				var pageto = $(this).data('to');
				if(typeof(opt.onClick)==='function'){
					opt.onClick(pageto);
				}
			});
		};

	module.exports = renderPage;
});