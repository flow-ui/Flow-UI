/*
 * name: drag-panel.js
 * version: v0.0.1
 * update: build
 * date: 2017-03-09
 */
define('drag-panel', function(require, exports, module) {
	"use strict";
	seajs.importStyle('.drag-panel-start{opacity: 0;}\
		.drag-panel-cell{transition:all ease .3s;}\
		.drag-panel-cell .card-head{cursor:move;}', module.uri);
	var $ = require('jquery'),
		def = {
			el: null,
			dragable: '.dragable',
			dragline: '.flex-row'
		},
		dragshadow = $('#dragshadow'),
		documentMoveInit,
		dragData,
		clearnode = function(that) {
			$(that).removeClass('drag-panel-start');
			documentMoveInit = null;
			dragshadow
				.empty()
				.css({
					width: 0,
					height: 0,
					left: 0,
					top: 0
				})
				.get(0).style.transform = '';
		},
		DragPannel = function(config) {
			var opt = $.extend({}, def, config || {});
			if (!dragshadow.length) {
				dragshadow = $('<div id="dragshadow" style="position:absolute;z-index:99;overflow:hidden;pointer-events:none" />').appendTo('body');
			}
			return $(opt.el).each(function(i,e){
				var $this = $(e);
				if(!$this.find(opt.dragable).length){
					return true;
				}
				$this
				.find(opt.dragable).each(function(i, e) {
					$(e).attr('id', 'wrapper-drag-cell-' + i).addClass('drag-panel-cell').prop('draggable', true);
				})
				.end()
				.on('mousedown', opt.dragable, function(e) {
					var dragele = $(this);
					if ($(this).parent(opt.dragline).children().length <= 1) {
						console.warn('can not drag');
						return e.preventDefault();
					}
					documentMoveInit = {
						left: e.originalEvent.pageX,
						top: e.originalEvent.pageY
					};
					dragshadow
						.css({
							width: dragele.outerWidth(true),
							height: dragele.outerHeight(true),
							left: dragele.offset().left,
							top: dragele.offset().top
						})
						.html(dragele.get(0).outerHTML);
					dragele.addClass('drag-panel-start');
				})
				.on('dragstart', opt.dragable, function(e) {
					e.originalEvent.dropEffect = "move";
					dragData = $(this).attr('id');
					e.originalEvent.dataTransfer.setData('text/plain', $(this).attr('id'));
				})
				.on('dragover', opt.dragable, function(e) {
					e.preventDefault();
					var step = 'translate(' + (e.originalEvent.pageX - documentMoveInit.left) + 'px,' + (e.originalEvent.pageY - documentMoveInit.top) + 'px)';
					dragshadow.get(0).style.transform = step;
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
				})
				.on('mouseup', opt.dragable, function(e) {
					clearnode(this);
				});
			});
		};
		
		$.fn.dragPanel = function(config){
			return DragPannel($.extend(config || {}, {
				el: this
			}));
		};
		module.exports = DragPannel;
});