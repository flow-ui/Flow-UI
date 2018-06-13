/*
 * name: drag-panel.js
 * version: v1.1.0
 * update: 自动添加drag-panel-wrap,drag-panel-cell,drag-panel-active类，新增showShadow配置
 * date: 2018-06-13
 */
define('drag-panel', function(require, exports, module) {
	"use strict";
	
	var $ = window.$ || require('jquery'),
		def = {
			el: null,
			sortkey: 'data-key',
			dragable: '.dragable',
			dragwrap: null,
			dragwrapLimitLength: 1,
			ondrag: null,
			showShadow: false
		},
		dragshadow = $('#dragshadow'),
		documentMoveInit,
		dragData,
		clearnode = function(that) {
			$(that).removeClass('drag-panel-active');
			documentMoveInit = null;
			if(dragshadow.length){
				dragshadow
				.empty()
				.css({
					width: 0,
					height: 0,
					left: 0,
					top: 0
				})
				.get(0).style.transform = '';
			}
		},
		DragPannel = function(config) {
			var opt = $.extend({}, def, config || {});
			if (opt.showShadow && !dragshadow.length) {
				dragshadow = $('<div id="dragshadow" style="position:absolute;z-index:99;overflow:hidden;pointer-events:none" />').appendTo('body');
			}
			return $(opt.el).each(function(i,e){
				var $this = $(e);
				if(!$this.find(opt.dragable).length){
					return true;
				}
				if($this.data('dragpanel-init')){
					return true;
				}
				$this
				.find(opt.dragable).each(function(i, e) {
					$(e).attr('id', 'wrapper-drag-cell-' + i).addClass('drag-panel-cell').prop('draggable', true);
				})
				.end()
				.on('mousedown', opt.dragable, function(e) {
					var dragele = $(this);
					if (opt.dragwrap && opt.dragwrapLimitLength && (dragele.parent(opt.dragwrap).find(opt.dragable).length <= opt.dragwrapLimitLength)) {
						console.warn('According to the dragwrapLimitLength set, canot drag');
						return e.preventDefault();
					}
					documentMoveInit = {
						left: e.originalEvent.pageX,
						top: e.originalEvent.pageY
					};
					if(dragshadow.length){
						dragshadow
						.css({
							width: dragele.outerWidth(true),
							height: dragele.outerHeight(true),
							left: dragele.offset().left,
							top: dragele.offset().top
						})
						.html(dragele.get(0).outerHTML);
					}
					dragele.addClass('drag-panel-active');
				})
				.on('dragstart', opt.dragable, function(e) {
					e.originalEvent.dropEffect = "move";
					dragData = $(this).attr('id');
					e.originalEvent.dataTransfer.setData('text/plain', $(this).attr('id'));
					$this.addClass('drag-panel-wrap');
				})
				.on('dragover', opt.dragable, function(e) {
					e.preventDefault();
					var step = 'translate(' + (e.originalEvent.pageX - documentMoveInit.left) + 'px,' + (e.originalEvent.pageY - documentMoveInit.top) + 'px)';
					if(dragshadow.length){
						dragshadow.get(0).style.transform = step;
					}
					var dropdata = dragData; //e.originalEvent.dataTransfer.getData('text/plain');
					var target = $('#' + dropdata);
					var mycenter = parseInt($(this).offset().left) + $(this).outerWidth() / 2;
					if (e.originalEvent.pageX > mycenter) {
						$(this).after(target);
					} else {
						$(this).before(target);
					}
				})
				.on('dragend', opt.dragable, function(e) {
					e.preventDefault();
					clearnode(this);
					var newSort = [];
					$this.removeClass('drag-panel-wrap').find(opt.dragable).each(function(i, cell){
						newSort.push($(cell).attr(opt.sortkey));
					});
					if(typeof opt.ondrag === 'function'){
						opt.ondrag(newSort);
					}
				})
				.on('dragenter', function(e){
					e.stopPropagation();
					e.preventDefault();
					if($(e.target).is($this)){
						$this.removeClass('drag-panel-out');
					}
					
				})
				.on('dragleave', function(e){
					e.stopPropagation();
					e.preventDefault();
					if($(e.target).is($this)){
						$this.addClass('drag-panel-out');
					}
				})
				.on('mouseup', opt.dragable, function(e) {
					clearnode(this);
				})
				.data('dragpanel-init', true);
				if(opt.dragwrap){
					$this.on('dragenter', opt.dragwrap, function(e) {
						e.preventDefault();
						var step = 'translate(' + (e.originalEvent.pageX - documentMoveInit.left) + 'px,' + (e.originalEvent.pageY - documentMoveInit.top) + 'px)';
						if(dragshadow.length){
							dragshadow.get(0).style.transform = step;
						}
						var dropdata = dragData; //e.originalEvent.dataTransfer.getData('text/plain');
						var target = $('#' + dropdata);
						var mycenter = parseInt($(this).offset().left) + $(this).outerWidth() / 2;
						$(this).append(target);
					})
				}
			});
		};
		
		$.fn.dragPanel = function(config){
			return DragPannel($.extend(config || {}, {
				el: this
			}));
		};
		module.exports = DragPannel;
});