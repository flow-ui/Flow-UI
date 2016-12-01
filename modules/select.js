/*
 * name: select.js
 * version: v3.1.9
 * update: 样式微调
 * date: 2016-06-13
 */
define('select',function(require, exports, module) {
	seajs.importStyle('.select-ui-choose{position:relative;display:inline-block;overflow:hidden;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle}\
		.select-ui-choose ._txt{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\
		.select-ui-choose ._arrow{position:absolute;top:0;right:.5em;height:100%}.select-ui-choose ._arrow .arr{position:absolute;top:50%;left:0}\
		.select-ui-options{position:absolute;z-index:101;font-size:.9em; display:none}\
		.select-ui-options li{cursor:pointer}.select-ui-options li._disabled{cursor:default}\
		.select-ui-choose-default{height:2em;line-height:2em;border:1px solid #aaa;border-radius:4px;background:#fff;color:#aaa}\
		.select-ui-choose-default ._txt{padding-right:20px;padding-left:8px}\
		.select-ui-choose-default ._arrow{width:1em}.select-ui-choose-default ._arrow .arr{margin:-.2em 0 0;border:.4em solid;border-color:#333 transparent transparent}\
		.select-ui-choose-default.on ._arrow .arr{margin-top:-.5em;border-color:transparent transparent #333}\
		.select-ui-choose-default-top.on{border-radius:0 0 4px 4px}.select-ui-choose-default-bottom.on{border-radius:4px 4px 0 0}\
		.select-ui-options-default{overflow:auto;max-height:12em;border:1px solid #aaa;background:#fff}\
		.select-ui-options-default li{line-height:1.8em;padding:.4em 1em}\
		.select-ui-options-default li._disabled{color:#aaa}.select-ui-options-default li._selected{background:#eee}\
		.select-ui-options-default li:hover{color:#fff;background:#7b7bff}.select-ui-options-default li._disabled:hover{color:#aaa;background:inherit}\
		.select-ui-options-default li._selected:hover{color:inherit;background:#eee}.select-ui-options-default-top{border-bottom:0;border-radius:4px 4px 0 0}\
		.select-ui-options-default-bottom{border-top:0;border-radius:0 0 4px 4px}\
		.select-ui-choose-thin{min-width:90px;height:2em;line-height:2em}.select-ui-choose-thin ._txt{padding-right:20px;padding-left:8px}\
		.select-ui-choose-thin ._arrow{width:16px}.select-ui-choose-thin ._arrow .arr{position:absolute;width:16px;height:16px;overflow:hidden;margin-top:-16px}\
		.select-ui-choose-thin ._arrow .arr:after{position:absolute;width:16px;height:16px;content:"×";text-align:center;font-family:tahoma;line-height:14px;left:0;bottom:-50%;font-size:16px}\
		.select-ui-choose-thin.on ._arrow .arr{margin-top:-4px}.select-ui-choose-thin.on ._arrow .arr:after{bottom:auto;top:-44%}\
		.select-ui-options-thin{overflow:auto;max-height:12em;background:#fff}.select-ui-options-thin li{line-height:1.8em;padding:6px;border-top:1px solid #aaa}\
		.select-ui-options-thin li._disabled{color:#aaa}.select-ui-options-thin li._selected{background:#eee}.select-ui-options-thin li:hover{color:#fff;background:#7b7bff}\
		.select-ui-options-thin li._disabled:hover{color:#aaa;background:inherit}.select-ui-options-thin li._selected:hover{color:inherit;background:#eee}'
		,module.uri);
	var $ = require('jquery');
	var base = require('base');
	var isMobile = base.browser.isMobile,
		def = {
			data: null,
			act: "click", // click | mouseenter
			posi: "bottom", // bottom | top | auto
			hideDisabled: true, // 不显示不可用项
			hideSelected: false, // 不显示已选中项
			hook: null, // 'thin',用于拼接select-ui-options-hook
			callback: function(val, txt) {}
		};

	$.fn.select = function(config) {
		var opt = $.extend({}, def, config || {}),
			$this = $(this);
		return $this.each(function(i, e) {
			if (e.tagName.indexOf('ELE') < 0) {
				return console.log($this.selector + ' must be a <select>!');
			}
			var createDom = function(init) {
					//创建DOM
					if (isMobile && !fromData) {
						return;
					}
					var _options = _lis = '',
						selectData = $(e).data('data');
					
					for (var i = 0,n = selectData.length; i < n; i++) {
						var value = selectData[i].value ? selectData[i].value : i;
						var text = selectData[i].option;
						var checkDefault = !!selectData[i].checkDefault;
						var selected = selectData[i].selected;
						var disabled = selectData[i].disabled;

						//原生结构
						_options += '<option' + (disabled ? ' disabled' : '') +
							(selected ? ' selected' : '') + ' value="' + value + '">' + text + '</option>';

						//模拟结构
						if(!(selected && opt.hideSelected) && !(disabled && opt.hideDisabled)){
							_lis += '<li class="' + (disabled ? '_disabled' : '') +
							(selected ? '_selected' : '') + '" data-val="' + value + '">' + text + '</li>';
						}

					};
					if(!isMobile){
						selectOptions.html(_lis);
					}
					
					if (fromData) {
						$(e).html(_options);
					}

					_options = _lis = null;
				},
				hideOption = function() {
					selectChoose.removeClass('on');
					selectOptions && selectOptions.hide();
				},
				showOption = function() {
					selectChoose.addClass('on');
					createDom();
					//options定位
					var bodyHeight = $(window).height();
					var selectChooseOS = selectChoose.offset();
					var selectChooseBorder = parseInt(selectChoose.css('border-left-width'))+parseInt(selectChoose.css('border-right-width'));
					var thePosi;
					selectOptions.css({
						"left": selectChooseOS.left,
						"top": selectChooseOS.top + selectChoose.outerHeight(),
						"width": selectChoose.outerWidth() - selectChooseBorder
					})
					switch (opt.posi){
						case "bottom":
							thePosi = "bottom"
							break;
						case "top":
							thePosi = "top"
							break;
						case "auto":
							if (selectChooseOS.top - $(window).scrollTop() < bodyHeight + $(window).scrollTop() - selectChooseOS.top) {
								thePosi = "bottom";
							} else {
								thePosi = "top";
							}
							break;
						default:
							console.log("'posi'属性无效，默认bottom");
							thePosi = "bottom";
					}

					if (thePosi === "bottom") {
						selectChoose.removeClass(chooseHookTop)
							.addClass(chooseHookBottom);
						selectOptions.attr('class', 'select-ui-options' + optionsHook + optionsHookBottom);
					} else if (thePosi === "top"){
						selectChoose.removeClass(chooseHookBottom)
							.addClass(chooseHookTop);
						selectOptions.attr('class', 'select-ui-options' + optionsHook + optionsHookTop)
							.css({
								"top": selectChooseOS.top - selectOptions.outerHeight()
							});
					} 
					selectOptions && selectOptions.show();
				},
				selectData,
				selectChoose,
				selectOptions,
				initSelsectd,
				fromData = $.isArray(opt.data),
				chooseHook = opt.hook ? ' select-ui-choose-' + opt.hook : ' select-ui-choose-default',
				chooseHookTop =  chooseHook+'-top',
				chooseHookBottom = chooseHook+'-bottom',
				optionsHook = opt.hook ? ' select-ui-options-' + opt.hook : ' select-ui-options-default',
				optionsHookTop = optionsHook+'-top',
				optionsHookBottom = optionsHook+'-bottom';

			//获取数据
			if (fromData) {
				selectData = opt.data;
				if($.isArray(selectData) && selectData.length){
					$.each(selectData, function(i, e) {
						if (e.selected && !initSelsectd) {
							initSelsectd = {};
							initSelsectd.text = e.option;
							initSelsectd.value = e.value;
						}
					})
				}else{
					return console.log('select数据无效:'+selectData);
				}
			} else {
				var _domOption = $(e).find('option');
				if(!_domOption.length){
					return console.log($(e).attr('class')+' has no <option>!');
				}
				if (!isMobile) {
					selectData = [];
					$.each(_domOption, function(i, e) {
						var theObj = {};
						theObj.value = $(e).val();
						theObj.option = $(e).text();
						theObj.disabled = $(e).prop('disabled');
						theObj.selected = $(e).prop('selected');
						if (theObj.selected && !initSelsectd) {
							initSelsectd = {};
							initSelsectd.text = theObj.option;
							initSelsectd.value = theObj.value;
						}
						selectData.push(theObj);
					});	
				}
			}
			//未定义selected默认第一项
			if (!initSelsectd && !isMobile) {
				initSelsectd = {};
				initSelsectd.text = selectData[0].option;
				initSelsectd.value = selectData[0].value;
			};
			$(e).data('data', selectData);
			
			if (!isMobile) {
				//定义变量
				if ($(e).data('selectinit')) {
					selectChoose = $(e).next('.select-ui-choose');
				} else {
					selectChoose = $('<span class="select-ui-choose'+chooseHook+'">'+
					   '<span class="_txt"></span>'+
					   '<span class="_arrow"><i class="arr"></i></span>'+
					'</span>').addClass($(e).attr('class')).insertAfter($(e));
					$(e).hide();
				}
				selectOptions = $('.select-ui-options').length ?
					$('.select-ui-options') :
					$('<ul class="select-ui-options" />').appendTo('body');
			}
			//初始化DOM
			createDom(!$(e).data('selectinit'));

			if (!isMobile) {
				//初始化数据
				selectChoose.find('._txt').text(initSelsectd.text);
				$(e).val(initSelsectd.value);
				//销毁变量
				_domOption = initSelsectd = null;
				//绑定事件		
				if(!$(e).data('selectinit')){
					selectChoose
					.on(opt.act, function(e) {
						e.stopPropagation();
						if ($(this).hasClass('on')) {
							hideOption();
						} else {
							showOption();
						}
						//关闭事件
						if (opt.act == "mouseenter") {
							selectOptions.on("mouseleave", function() {
								hideOption();
							});
						} else if (opt.act == 'click') {
							//清除mouseleave关闭事件
							selectOptions.unbind('mouseleave');
						}
						$(document).mouseup(function(e) {
							if (selectChoose.hasClass('on') && !selectChoose.is(e.target) && !selectChoose.has(e.target).length && !selectOptions.is(e.target) && !selectOptions.has(e.target).length) {
								//console.log('失去焦点');
								hideOption();
							}
						})
					});
				}
				
				selectOptions.on('click', 'li', function(e) {
					e.stopPropagation();
					e.preventDefault();
					if (!$(this).hasClass('_disabled')) {
						var _val = $(this).data('val'),
							_text = $(this).text(),
							_thisSelect = $('.select-ui-choose.on'),
							_thisOriginSelect = _thisSelect.prev('select'),
							_data = _thisOriginSelect.data('data');
						if(!_thisSelect.length){
							//二次绑定回调
							if(selectChoose.is(_thisSelect)){
								typeof(opt.callback) === 'function' && opt.callback(_val, _text);
							}
							return;
						}

						$(this).addClass('_selected').siblings('li').removeClass('_selected');

						$.each(_data, function(i,o){
							if(o.value==_val){
								o.selected = true;
								return;
							}
							o.selected = false;
						});
						_thisSelect.find('._txt').text(_text);
						_thisOriginSelect.val(_val).data('data',_data); //给隐藏select赋值
						hideOption();
						if(selectChoose.is(_thisSelect)){
							typeof(opt.callback) === 'function' && opt.callback(_val, _text);
						}
					}
				});
			} else {
				$(e).on('change', function() {
					var _val = $(this).val(),
						_text = $(this).find("option:selected").text();
					typeof(opt.callback) === 'function' && opt.callback(_val, _text);
				})
			}
			$(e).data('selectinit', true);
		})
	}
})