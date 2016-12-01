/*
 * name: zoom.js
 * version: v2.0.2
 * update: 增加animate和duration配置
 * date: 2016-04-30
 */
define('zoom', function(require, exports, module) {
	var $ = require('jquery'),
		ready = require('img-ready'),
		MouseEvent = function(e) {
			this.x = e.pageX;
			this.y = e.pageY
		};
	seajs.importStyle('.zoomdiv{position:absolute;overflow:hidden;z-index:99;opacity:0;display:none}\
		.zoomdiv.active{opacity:1;}\
		.jqZoomPup{position:absolute;border:1px solid #aaa;background:#fff;background:rgba(255,255,255,.4);filter:alpha(Opacity=50);cursor:move;z-index:9;display:none}', module.uri);
	$.fn.zoom = function(config) {
		return $(this).each(function(i, e) {
			var $this = $(e),
				def = {
					zoomWidth: $this.outerWidth(),
					zoomHeight: $this.outerHeight(),
					zoomScale: 0,
					offset: 10,
					offsetTarget: null,
					position: "right",
					animate: true,
					duration: 200,
					preload: true
				},
				opt = $.extend(def, config || {}),
				imageLeft, imageTop, imageWidth, imageHeight, imagePaddingTop,
				imagePaddingLeft, bigimage, bigwidth, bigheight, dragzoom;
			if ($this.find('img').length !== 1) {
				return console.log('.' + $this.selector + '中需有且只有1张图片');
			};
			(function() {
				var _thisPosition = $this.css('position');
				if (_thisPosition != 'absolute' && _thisPosition != 'fixed') {
					$this.css('position', 'relative');
				}
			})();

			if (!$('#zoomdiv').length) {
				$('body').append('<div class="zoomdiv" id="zoomdiv"></div>');
			};
			if (opt.animate && !isNaN(parseInt(opt.duration))) {
				$('#zoomdiv').get(0).style.transition = 'opacity ease ' + parseInt(opt.duration) + 'ms';
			};
			dragzoom = function(e) {
				var mouse = new MouseEvent(e),
					scalex = (bigwidth / imageWidth),
					scaley = (bigheight / imageHeight),
					xpos = (mouse.x - $("div.jqZoomPup").outerWidth() / 2 < imageLeft) ? 0 + imagePaddingLeft :
					(mouse.x + $("div.jqZoomPup").outerWidth() / 2 > imageWidth + imageLeft) ? (imageWidth - $("div.jqZoomPup").outerWidth() + imagePaddingLeft) :
					mouse.x - $("div.jqZoomPup").outerWidth() / 2 - imageLeft + imagePaddingLeft,
					ypos = (mouse.y - $("div.jqZoomPup").outerHeight() / 2 < imageTop) ? 0 + imagePaddingTop :
					(mouse.y + $("div.jqZoomPup").outerHeight() / 2 > imageHeight + imageTop) ? (imageHeight - $("div.jqZoomPup").outerHeight() + imagePaddingTop) :
					mouse.y - $("div.jqZoomPup").outerHeight() / 2 - imageTop + imagePaddingTop;
				$this.find(".jqZoomPup").css({
					width: (opt.zoomWidth) / scalex,
					height: (opt.zoomHeight) / scaley,
					top: ypos,
					left: xpos
				});
				$("#zoomdiv").scrollTop((ypos - imagePaddingTop) * scaley)
					.scrollLeft((xpos - imagePaddingLeft) * scalex);
			};

			// 准备变量
			var offsetTarget = $(opt.offsetTarget).length ? $(opt.offsetTarget).eq(0) : $this,
				offsetWidth = offsetTarget.outerWidth(),
				offsetLeft = offsetTarget.offset().left,
				offsetTop = offsetTarget.offset().top;

			// 大图位置
			if (opt.position == "right") {
				if (offsetLeft + offsetWidth + opt.offset + opt.zoomWidth > screen.width) {
					leftpos = offsetLeft - opt.offset - opt.zoomWidth;
					console.log('zoom.js: element["' + $this.attr('class') + '"] automatically positioned to the left.')
				} else {
					leftpos = offsetLeft + offsetWidth + opt.offset;
				}
			} else {
				leftpos = offsetLeft - opt.zoomWidth - opt.offset;
				if (leftpos < 0) {
					leftpos = offsetLeft + offsetWidth + opt.offset;
				}
			};

			function bindBigImg() {
				ready(bigimage, function(w, h) {
					// get img size
					if (Number(opt.zoomScale) > 1) {
						bigwidth = parseInt(imageWidth * Number(opt.zoomScale));
						bigheight = parseInt(imageHeight * Number(opt.zoomScale));
					} else {
						bigwidth = w;
						bigheight = h;
					}
					if (bigwidth <= imageWidth || (bigwidth <= opt.zoomWidth || bigheight <= opt.zoomHeight)) {
						console.log('大图不满足放大条件，放弃本次zoom操作');
						$("#zoomdiv").removeClass('active').hide();
						return;
					}
					$("#zoomdiv").find('img').css({
						"width": bigwidth,
						"height": bigheight,
						"maxWidth": "none"
					});
					$('body').bind("mousemove", dragzoom);
				});
			};

			// 绑定事件
			$this.on('mouseenter', 'img', function() {
				var Original = $(this);
				bigimage = Original.attr("zoom") ? Original.attr("zoom") : Original.attr("src");
				imagePaddingTop = Original.offset().top - $this.offset().top;
				imagePaddingLeft = Original.offset().left - $this.offset().left;
				if (!$this.find('.jqZoomPup').length) {
					$this.append("<div class='jqZoomPup'>&nbsp;</div>");
				};
				$this.find('.jqZoomPup').show();
				$("#zoomdiv").css({
					"display": "block",
					"top": offsetTop,
					"left": leftpos,
					"width": opt.zoomWidth,
					"height": opt.zoomHeight
				}).html('<img src="' + bigimage + '"/>');
				setTimeout(function(){
					$('#zoomdiv').addClass('active')
				},0);
				ready(Original.attr('src'), function(w, h) {
					imageLeft = Original.offset().left;
					imageTop = Original.offset().top;
					imageWidth = Original.width();
					imageHeight = Original.height();
					bindBigImg();
					Original = null;
				});
			}).on('mouseleave', function() {
				$(this).find(".jqZoomPup").hide();
				$('body').unbind("mousemove", dragzoom).find("#zoomdiv").removeClass('active').hide();
			});
			if (opt.preload && $this.find("img").attr("zoom")) {
				var imagetopreload = $this.find("img").attr("zoom"),
					preloadImg = new Image();
				preloadImg.src = imagetopreload;
			};
		})
	}
});