/*
 * name: album.js
 * version: v2.2.10
 * update: 匹配slideV4
 * date: 2016-06-27
 */
define('album', function(require, exports, module) {
	var $ = require('jquery');
	seajs.importStyle('.album_ordinary,.album_wrap{width:100%;height:100%}\
		.album_wrap{position:fixed!important;left:0;top:0;z-index:98;background:rgba(0,0,0,.8);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#99000000", endColorstr="#99000000")}\
		.album_ordinary .slide_c{text-align:center}\
		.album_ordinary .slide_c img{vertical-align:middle;width:auto;max-height:100%}\
		.album_ordinary .slide_c p{position:absolute;left:0;bottom:80px;width:100%;line-height:22px;color:#fff;font-size:16px}\
		.album_ordinary .album_btns { position:absolute;z-index:99;}\
		.album_ordinary .album_btns:hover{filter:alpha(opacity=80);opacity:0.8;}\
		.album_ordinary .album_prev,.album_ordinary .album_next { width:10%;height:5em;line-height:5em;top:50%;margin-top:-3em;font-size:4em;text-align:center;color:#fff;cursor:pointer;}\
		.album_ordinary .album_prev { left:10%;}.album_ordinary .album_next{right:10%;}\
		.album_ordinary .album_close{width:2em;height:2em;line-height:38px;margin:0;text-align:center;cursor:pointer;background:#fabd00;color:#fff;font-size:20px;right:0;top:0;}\
		.album_ordinary .slide_nav,.album_ordinary.unable .album_next,.album_ordinary.unable .album_prev{display:none}\
		.album_preview .slide_nav{display:block;width:100%;left:0;top:50%}\
		.album_preview .slide_nav a{display:none;position:absolute;top:-28px;width:80px;height:55px;line-height:55px;border:4px solid #ffd643;cursor:pointer}\
		.album_preview .slide_nav img{vertical-align:top;width:100%;height:100%}\
		.album_preview .slide_nav .nav_prev{display:block;left:10%}.album_preview .slide_nav .nav_next{display:block;right:10%}\
		.album_preview .album_close{position:absolute;width:2em;height:2em;line-height:38px;z-index:99;margin:0;text-align:center;cursor:pointer;background:#fabd00;color:#fff;font-size:20px;right:0;top:0}\
		.album_preview .album_close .ion{font-size:28px;margin:0}.album_preview .album_pages{position:absolute;top:10px;left:20px;font-size:14px;color:#fabd00;line-height:38px;margin:0 1em}\
		.album_preview .arrs{display:none}.album_gallery .album_bar{position:absolute;left:0;bottom:0;height:50px;width:100%;background:#000;z-index:0}\
		.album_gallery .arrs{position:absolute;width:40px;height:40px;line-height:40px;font-size:22px;color:#fff;bottom:5px}\
		.album_gallery .arr_prev{left:0}.album_gallery .arr_next{left:100px}.album_gallery .arrs:hover{color:red}\
		.album_gallery .album_close,.album_gallery .album_pages{position:absolute;line-height:40px;bottom:5px;text-align:center;color:#fff;background-color:transparent;}\
		.album_gallery .album_pages{height:40px;left:40px;width:60px;font-size:16px}\
		.album_gallery .slide_nav{position:absolute;left:140px;height:40px;line-height:40px;width:60%;display:block;bottom:5px}\
		.album_gallery .slide_nav a{float:left;height:36px;border:2px solid #ccc;margin-right:4px;opacity:0;cursor:pointer}\
		.album_gallery .slide_nav img{height:100%}.album_gallery .slide_nav .on{border-color:red;opacity:1}\
		.album_gallery .album_close{height:40px;width:40px;right:0;cursor:pointer;z-index:2}\
		.album_gallery .album_close .ion{margin:0;font-size:22px}.album_gallery .album_close:hover{color:red;}\
		@media screen and (max-width:768px){.album_ordinary{background:#000}\
		.album_ordinary .album_prev, .album_ordinary .album_next{width:20%;}\
		.album_ordinary .album_prev {left:0;}.album_ordinary .album_next{right:0;}\
		.album_preview .slide_nav .nav_next,.album_preview .slide_nav .nav_prev{display:none}}\
		@media screen and (max-width:480px){.album_ordinary .album_prev,.album_ordinary \
			.album_next {font-size:2em;}.album_ordinary .slide_c p{bottom:4em}\
			.album_gallery .slide_nav{display:none}}'
		, module.uri);
	require('slide');
	var def = {
		blankclose: false,
		title: null,
		cell: 'li',
		trigger: null,
		type: 1,
		hook: '',
		effect: 'slide', //slide, fade, toggle
		animate: 'ease',
		duration: 480,
		imgattr: null,
		prevHtml: '<i class="ion">&#xe6c3;</i>',
		nextHtml: '<i class="ion">&#xe6c4;</i>',
		callback: function() {},
		ext: function() {}
	};
	$.fn.album = function(config) {
		return $(this).each(function(i, e) {
			var $this = $(e).addClass('albumID' + parseInt(Math.random() * 1e5)),
				opt = $.extend({}, def, config || {}),
				trigger = opt.trigger ? opt.trigger : opt.cell,
				thisClass = '';
			(function() {
				//获取数据
				var thisCell = '';
				var _navs = '';
				var new_slide = $('<div class="album_wrap ' + opt.hook + '"><div><ul></ul></div></div>');

				$this.find(opt.cell).each(function(i, e) {
					var img = '<img ' + (opt.imgattr && $(e).find('img').attr(opt.imgattr) ? opt.imgattr + '="' + $(e).find('img').attr(opt.imgattr) + '"' : 'src="' + $(e).find('img').attr('src') + '"') + ' />',
						title = opt.title && $(e).find(opt.title).length ? '<p>' + $(e).find(opt.title).text() + '</p>' : '';
					thisCell += ('<li>' + img + title + '</li>');
				});
				thisClass = '.' + $this.attr('class').split(' ').join('.') + ' ';
				new_slide.find('ul').append(thisCell);
				//预处理
				switch (opt.type) {
					case 1:
						//普通
						new_slide.children().addClass('album_ordinary')
							.append('<div class="album_btns_bar">\
								<span class="album_btns album_prev" />\
								<span class="album_btns album_next" />\
								<span class="album_btns album_close"><i class="ion">&#xe6c9;</i></span>\
							</div>');
						break;

					case 2:
						//前后预览图
						new_slide.children().addClass('album_ordinary album_preview')
							.append('<div class="slide_nav"></div>\
									<div class="album_pages">\
										<span class="album_page_now" />\
										/\
										<span class="album_page_all" />\
									</div>\
									<div class="album_btns album_close"><i class="ion">&#xe6c9;</i></div>')
							.find('li').each(function(i, e) {
								_navs += ('<a><img src="' + $(e).find('img').attr((opt.imgattr && $(e).find('img').attr(opt.imgattr) ? opt.imgattr : 'src')) + '" ></a>');
							}).end()
							.find('.slide_nav').append(_navs);
						break;

					case 3:
						//所有预览图
						new_slide.children().addClass('album_ordinary album_gallery')
							.append('<div class="album_bar"></div>\
									<div class="slide_nav"></div>\
									<div class="album_pages">\
										<span class="album_page_now" />\
										/\
										<span class="album_page_all" />\
									</div>\
									<div class="album_btns album_close"><i class="ion">&#xe6c9;</i></div>')
							.find('li').each(function(i, e) {
								_navs += ('<a><img src="' + $(e).find('img').attr((opt.imgattr && $(e).find('img').attr(opt.imgattr) ? opt.imgattr : 'src')) + '" ></a>');
							}).end()
							.find('.slide_nav').append(_navs);
						break;
				};
				$this.data('new_slide', new_slide);
			})();
			if ($this.data('albuminit')) return;

			$this.on('click', trigger, function(e) {
				e.preventDefault();
				var winheight = $(window).height();
				var Start = opt.trigger ? $(this).parents(opt.cell).index(thisClass + opt.cell) : $(this).index(thisClass + opt.cell);
				var new_slide = $this.data('new_slide');
				new_slide.css({
						'height': winheight + 1,
						'top': '-102%'
					})
					.appendTo('body')
					.animate({
						top: '0'
					}, 640)
					.children()
					.css({
						'line-height': winheight - 50 + 'px'
					})
					.slide({
						act: 'click',
						effect: opt.effect,
						animate: opt.animate,
						duration: opt.duration,
						prev: '.album_prev',
						next: '.album_next',
						prevHtml: opt.prevHtml,
						nextHtml: opt.nextHtml,
						start: Start,
						imgattr: opt.imgattr,
						auto: false,
						callback: function(o, b, now) {
							if (o.find('.album_page_now').length) {
								o.find('.album_page_now').text(now + 1)
							}
							typeof(opt.callback) === 'function' && opt.callback(o, b, now);
						},
						ext: function(o, b, count) {
							//点空白关闭
							if (opt.blankclose) {
								o.on('click', function(e) {
									if (!$(e.target).is('.album_btns') ) {
										o.find('.album_close').trigger('click');
									}
								})
							}
							o.find('.album_close').on('click', function() {
								new_slide.animate({
									top: '-102%'
								}, 320, function() {
									new_slide.remove()
								});
							});
							if (o.find('.album_page_all').length) {
								o.find('.album_page_all').text(count)
							};
							o.find('.slide_nav a').each(function(i, e) {
								setTimeout(function() {
									$(e).animate({
										opacity: 0.7
									}, 320);
								}, i * 160)
							});
							typeof(opt.ext) === 'function' && opt.ext(o, b, count);
						}
					});
			});
			$this.data('albuminit', true);
		})
	}
})