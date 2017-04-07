/*
 * name: common-pjax
 * version: v4.0.1
 * update: 移除响应式功能
 * date: 2017-04-07
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var base = require('base');

	if (base.browser.ie < 8) {
		alert('您的浏览器版本过低，请升级或使用chrome、Firefox等高级浏览器！');
		//屏蔽ie78 console未定义错误
		if (typeof console === 'undefined') {
			console = {
				log: function() {},
				warn: function() {}
			};
		}
	}

	//返回顶部
	$('body').on('click', '.gotop', function(e) {
		e.preventDefault();
		$('html,body').stop(1).animate({
			scrollTop: '0'
		}, 300);
	});

	//PJAX预取
	var ic = require('instantclick');
	var ic_scroll;
	ic.on('fetch', function() {
		ic_scroll = $(window).scrollTop();
	});
	ic.on('receive', function(url, body, title) {
		var scrollfixed = base.url.get('scrollfixed', url);
		if (!scrollfixed) {
			ic_scroll = null;
		}
		return {
			body: body,
			title: title
		};
	});
	ic.on('change', function() {
		if (ic_scroll) {
			$('body,html').scrollTop(ic_scroll);
			ic_scroll = null;
		}
	});
	ic.init();

	/*
	 * 输出
	 */
	module.exports = {
		init: function() {
			//textarea限制字数
			$('textarea[max-length]').on('change blur keyup', function() {
				var _val = $(this).val(),
					_max = $(this).attr('max-length');
				if (_val.length > _max) {
					$(this).val(_val.substr(0, _max));
				}
			});

			/*
			 * 站内公用
			 */

			console.log('pjax init');



		}
	};
});