/*
 * name: input.js
 * version: v0.0.1
 * update: build
 * date: 2016-12-28
 */
define('input', function(require, exports, module) {
    "use strict";
    seajs.importStyle('.input-widget{display:inline-block;vertical-align:bottom;margin:0;}\
    	.icon-left .form-control-feedback{right:auto;left:0;}', module.uri);
    var $ = require('jquery'),
        base = require('base'),
        etpl = require('etpl'),
        def = {
            color: '',
            id: '',
            width: 0,
            button: '',
            onClickButton:null,
            type: '',
            holder: '',
            val: '',
            icon: '',
            iconPosition: 'right',
            size: '',
            name: '',
            disable: false,
            readonly: false,
            datatype: '',
            errormsg: '',
            nullmsg: '',
            wrapTag: 'div',
            render: function(val) {
                return val;
            },
            onChange:null
        },
        inputTemplate = '<input type="${type}" class="form-control" id="${id}" placeholder="${holder}" value="${val}"<!-- if: ${disable} --> disabled<!-- /if --><!-- if: ${readonly} --> readonly<!-- /if -->>';

    $.fn.input = function(config) {
    	var inputHandle = {
    		renderDom:[],
    		shadowInput:[],
            disabled: function(flag){
            	$.each(this.shadowInput, function(i,e){
            		$(e).prop('disabled', !flag);
            	});
            },
            readonly: function(flag){
            	$.each(this.shadowInput, function(i,e){
            		$(e).prop('readonly', !flag);
            	});
            },
            destroy: function(){
            	$.each(this.renderDom, function(i,e){
            		$(e).remove();
            	});
            	this.renderDom = [];
            	this.shadowInput = [];
            },
            clear: function(){
            	$.each(this.shadowInput, function(i,e){
            		$(e).val('').trigger('change');
            	});
            },
            reset: function(){
            	$.each(this.shadowInput, function(i,e){
            		var opt = $(e).data('opt');
            		$(e).val(opt.val).trigger('change');
            	});
            },
            text: function(input){
            	if(input){
            		$.each(this.shadowInput, function(i,e){
	            		$(e).val(input);
	            	});
            	}else{
            		return this.shadowInput[0].val();
            	}
            },
            val: function(input){
            	if(input){
            		$.each(this.shadowInput, function(i,e){
	            		$(e).val(input).trigger('change').trigger('blur');
	            	});
            	}else{
            		return this.shadowInput[0].data('clean') || '';
            	}
            }
        };
        $(this).each(function(i, e) {
            var $this = $(e),
                opt = $.extend({}, def, config || {}),
                render,
                tagname = $this.get(0).tagName.toLowerCase(),
                template = inputTemplate;
            //数据准备
            if (opt.color && opt.color.split) {
                opt.color = ' has-' + $.trim(opt.color);
            }
            if (!opt.id) {
                opt.id = 'input-' + base.getUUID();
            }
            if (opt.size === 'sm' || opt.size === 'lg') {
                opt.wrapSizeClass = ' form-group-' + opt.size;
                opt.groupSizeClass = ' input-group-' + opt.size;
            } else if (opt.size) {
                console.warn('input():size参数不正确');
            }
            if (!opt.type) {
                opt.type = $this.attr('type') || 'text';
            }
            if (!opt.width || isNaN(opt.width)) {
                opt.width = parseInt($this.outerWidth());
            }
            if (!opt.datatype) {
                opt.datatype = $this.attr('datatype') || '';
                if (!opt.errormsg) {
                    opt.errormsg = $this.attr('errormsg') || '';
                }
                if (!opt.nullmsg) {
                    opt.nullmsg = $this.attr('nullmsg') || '';
                }
            }
            if(opt.button && opt.button.split){
            	opt.iconPosition = 'left';
            }
            opt.className = $.trim($this.attr('class'));
            if(!$this.parents('form').length){
            	opt.wrapTag = 'form';
            }
            if (tagname === 'textarea') {
                template = '<${wrapTag} class="input-widget form-group${color}${wrapSizeClass}<!-- if: ${className} --> ${className}<!-- /if -->"<!-- if: ${width} --> style="width:${width}px"<!-- /if -->>\
								<textarea class="form-control" id="${id}" placeholder="${holder}" value="${val}"<!-- if: ${disable} --> disabled<!-- /if --><!-- if: ${readonly} --> readonly<!-- /if --><!-- if: ${datatype} --> datatype="${datatype}"<!-- if: ${errormsg} --> errormsg="${errormsg}"<!-- /if --><!-- if: ${nullmsg} --> nullmsg="${nullmsg}"<!-- /if --><!-- /if -->></textarea>\
							</${wrapTag}>';
            } else {
            	template = '<${wrapTag} class="input-widget form-group${color}${wrapSizeClass}<!-- if: ${iconPosition} === "left" --> icon-left<!-- /if --><!-- if: ${icon} --> has-feedback<!-- /if --><!-- if: ${className} --> ${className}<!-- /if -->"<!-- if: ${width} --> style="width:${width}px"<!-- /if -->>' +
            					'<!-- if: ${button} --><div class="input-group${groupSizeClass}"><!-- /if -->' + 
		            			inputTemplate +
		            			'<!-- if: ${button} -->\
				                <span class="input-group-addon btn">${button}</span>\
				                </div>\
				                <!-- /if -->\
				            	<!-- if: ${icon} -->\
				                <i class="ion form-control-feedback">${icon | raw}</i>\
				                <!-- /if -->\
			                </${wrapTag}>';
            }
            render = etpl.compile(template);
            var renderDom = $(render(opt)),
            	shadowInput = renderDom.find('#' + opt.id),
            	validformHandle;
            inputHandle.shadowInput.push(shadowInput.data('opt',opt));
            inputHandle.renderDom.push(renderDom);
        	//生成
        	if (tagname === 'textarea' || tagname === 'input') {
                $this.hide().after(renderDom);
                if(opt.name && opt.name.split){
                	$this.attr('name',opt.name);
                }
            } else {
            	shadowInput.attr('name',opt.name || opt.id);
                $this.html(renderDom);
            }
            //按钮事件
            if(opt.button && opt.button.split && typeof(opt.onClickButton) === 'function'){
            	renderDom.on('click','.input-group-addon',function(){
            		opt.onClickButton(shadowInput.data('clean') || '',shadowInput.val());
            	});
            }
            //验证
            if (opt.datatype) {
                require.async('validform', function() {
                	//等待可能的其他validform实例化完成
            		setTimeout(function(){
            			if(shadowInput.parents('form').get(0).handle){
	                		validformHandle = shadowInput.parents('form').get(0).handle;
	                	}else{
	                		validformHandle = shadowInput.parents('form').Validform({
		                        checkTime: 0
		                    });
	                	}
	                	if(validformHandle){
	                		validformHandle.addRule([{
	                			ele:"#" + opt.id,
						        datatype:opt.datatype,
						        nullmsg:opt.nullmsg,
						        errormsg:opt.errormsg
	                		}]).ignore("#" + opt.id);
	                	}
            		}, 0);
                });
            }
            //修饰
            shadowInput.on('focus', function() {
            	if (typeof(opt.render) === 'function') {
                    var cleanval = $(this).data('clean');
                    if (cleanval!==void(0)) {
                        $(this).val(cleanval);
                    }else{
                    	$this.val($(this).val());
                    }
                }
            }).on('change', function(){
            	var newVal = $(this).val();
        		$this.val(newVal);
            	if(typeof(opt.onChange)==='function'){
            		opt.onChange(newVal);
            	}
            }).on('blur', function() {
            	var that = this,
                    lastval = $(that).val();
                if ($.trim(lastval) && typeof(opt.render) === 'function') {
                	if(opt.datatype && validformHandle){
                		if(validformHandle.check(false, '#' + opt.id)){
	                        $(that).data('clean', lastval).val(opt.render(lastval));
	                	}else{
	                		$(that).data('clean', '');
	                		$this.val('');
	                	}
                	}else{
                		$(that).data('clean', lastval).val(opt.render(lastval));
                	}
                }
            });
        });
		return inputHandle;
	};
});
