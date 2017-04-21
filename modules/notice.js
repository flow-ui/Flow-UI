/*
 * name: notice.js
 * version: v0.0.3
 * update: 默认背景色
 * date: 2017-04-21
 */
define('notice', function(require, exports, module) {
	"use strict";
	seajs.importStyle('.notice-queue{width: 24em; margin-right: 1.5em; position: fixed; top: 1.5em; right: 0; z-index: 99;}\
		.notice-ele{margin-bottom: .8em; line-height: 1; position: relative; overflow: hidden;border-radius: 4px; box-shadow: 0 1px 6px rgba(0,0,0,.2);border-left:4px solid;transition:transform ease .3s;transform:translateX(26em);}\
		.notice-ele.show{transform:translateX(0);}\
		.notice-content{ padding: 15px;background:#fff}\
		.notice-title{font-size: 14px; color: #464c5b; padding-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}\
		.notice-desc{font-size: 12px; color: #999; text-align: justify; line-height: 1.5;margin-top:8px;}\
		.notice-close{position: absolute; right: 16px; top: 15px; color: #999; outline: 0;font-size:1.5em;cursor:pointer;-webkit-user-select:none;user-select:none}\
		.notice-just-title .notice-content{padding:20px;}\
		.notice-just-title .notice-close{top:20px;}', module.uri);
	var $ = require('jquery'),
		base = require('base'),
		def = {
			title: '',
			desc: '',
			delay: 0,
			color: 'primary', 
			onClose: null
		},
		$queue = $('#notice-queue'),
		addToQueue = function($ele){
			$queue.append($ele);
			setTimeout(function(){
				$ele.addClass('show');
			},0);
		},
		delFromQueue = function($ele){
			var opt = $ele.data('opt');
			$ele.removeClass('show');
			setTimeout(function(){
				$ele.remove();
				if(typeof(opt.onClose) === 'function'){
					opt.onClose();
				}
			}, 300);
		};
	if(!$queue.length){
		$queue = $('<div id="notice-queue" class="notice-queue"></div>').on('click', '.notice-close', function(){
			delFromQueue($(this).parent('.notice-ele'));
		});
		$('body').append($queue);
	}
	var Notice = function(config){
		var opt = $.extend({}, def, config || {}),
			$ele = $('<div class="notice-ele text-'+opt.color+(opt.desc ? '' : ' notice-just-title') + '">\
    <div class="notice-content">\
        <div class="notice-title">' + opt.title + '</div> '+
        (opt.desc ? ('<div class="notice-desc">' + opt.desc + '</div>') : '')+
    '</div>\
    <a class="notice-close">×</a>\
</div>');
		$queue.css('zIndex', base.getIndex());
		addToQueue($ele.data('opt', opt));
		if(opt.delay){
			setTimeout(function(){
				delFromQueue($ele);
			}, opt.delay);
		}
		return {
			close: function(){
				delFromQueue($ele);
			}
		};
	};

	module.exports = Notice;
});