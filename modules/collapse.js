/*
 * name: collapse.js
 * version: v0.0.1
 * update: build
 * date: 2017-04-21
 */
define('collapse', function(require, exports, module) {
	"use strict";
	seajs.importStyle('.collapse{position:relative;border:1px solid #ccc;border-radius:4px;overflow:hidden;}\
		.collapse .card{border-radius:0;}\
		.collapse .card:hover{box-shadow:none;}\
		.collapse .arr{position: absolute;top:50%;left: 10px; transition: transform ease 200ms; transform-origin: 25% 50%; margin: -.4em 0 0;\
border: .4em solid; border-color: transparent transparent transparent #ccc;}\
		.collapse .card-opened .arr{transform: rotateZ(90deg); margin-top: -.5em\\9; border-color: transparent transparent #ccc\\9;}\
		.collapse .card-head{background:#f5f5f5;cursor:pointer;user-select:none;-webkit-user-select:none;}\
		.collapse .card-body{display:none;}\
		.collapse .card-opened .card-body{display:block;}', module.uri);
	var $ = window.jQuery || require('jquery'),
		etpl = require('etpl'),
		def = {
			el: null,
			conts: '.panel',
			data: null,
			opened: [],
			color: '',
			single: true,
			onChange: null
		},
		template = '<!-- for: ${data} as ${card}, ${index} -->\
		<div data-index="${index}" class="card<!-- if: ${card.opened} --> card-opened<!-- /if --><!-- if: ${card.color} --> card-${card.color}<!-- /if -->">\
    <div class="card-head"> <i class="arr"></i> \
        <div class="card-title">${card.title | raw}</div>\
    </div>\
    <div class="card-body">${card.cont | raw}</div>\
</div>\
<!-- /for -->',
		render,
		Collapse = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(opt.el).eq(0),
				cardData,
				html,
				set = function(){

				};
			if (!$this.length || $this.data('collapse-init')) {
				return null;
			}
			if ($.isArray(opt.data) && opt.data.length) {
				cardData = opt.data;
			} else if ($this.find(opt.conts).length) {
				cardData = [];
				$this.find(opt.conts).each(function(i, e) {
					cardData.push({
						title: $(e).data('card-title') || '未命名',
						cont: $(e).html(),
						opened: $(e).attr('opened') !== void 0
					});
				});
			} else {
				return console.warn('collapse:cont not exists!');
			}
			if(!$.isArray(opt.opened)){
				opt.opened = [];
			}

			$.each(cardData, function(indexD, d) {
				if (!opt.opened.length) {
					if (d.opened) {
						if(opt.single){
							if (!opt.opened.length) {
								opt.opened.push(indexD);
							} else {
								d.opened = false;
							}
						}else{
							opt.opened.push(indexD);
						}
					}
				}else{
					if(opt.single && opt.opened.length > 1){
						opt.opened = [opt.opened[0]];
					}
					d.opened = false;
					$.each(opt.opened, function(indexO, opened){
						if(opened === indexD){
							d.opened = true;
							return false;
						}
					});
				}
				//color
				if(opt.color && opt.color.split){
					if (!d.color) {
						d.color = opt.color;
					}
				}
			});

			if (!opt.opened.length) {
				opt.opened.push(0);
				cardData[0].opened = true;
			}
			
			html = render({
				data: cardData
			});
			$this.on('click', '.card-head', function(e) {
				e.preventDefault();
				var thisCard = $(this).parent('.card');
				thisCard.toggleClass('card-opened');
				if (opt.single) {
					thisCard.siblings('.card-opened').removeClass('card-opened');
				}
				if(!thisCard.hasClass('card-opened')){
					$.each(opt.opened, function(i, e){
						if(thisCard.data('index') === e){
							opt.opened.splice(i, 1);
							return false;
						}
					});
				}else{
					if(opt.single){
						opt.opened = [thisCard.data('index')];
					}else{
						opt.opened.push(thisCard.data('index'));
					}
				}
				typeof opt.onChange === 'function' && opt.onChange(opt.opened);
			}).addClass('collapse').html(html).data('collapse-init', true);

			return {
				open: function(array) {
					if (array === void 0) {
						return opt.opened;
					} else if($.isArray(array)){
						$this.children('.card').each(function(){
							var index = $(this).data('index'),
								isOpen = false;
							$.each(array, function(i,o){
								if(index === o){
									isOpen = true;
									return false;
								}
							});
							if(isOpen){
								$(this).addClass('card-opened');
							}else{
								$(this).removeClass('card-opened');
							}
						});
						
					}
				}
			};
		};

	etpl.config({
		variableOpen: '${',
		variableClose: '}'
	});
	render = etpl.compile(template);

	$.fn.collapse = function(config) {
		return Collapse($.extend({
			el: this
		}, config || {}));
	};
	module.exports = Collapse;
});