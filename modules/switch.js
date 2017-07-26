/*
 * name: switch.js
 * version: v1.0.0
 * update: switch => switcher 避开js保留字
 * date: 2017-07-26
 */
define('switch', function(require, exports, module) {
	"use strict";
	var $ = window.$ || require('jquery'),
		def = {
			el: null,
			name: null,
			value: null,
			round: false,
			color: "default",
			disabled: false,
			size: null,
			onChange: null
		},
		template = '<label class="switch"><div class="track"><div class="handle"></div></div></label>',
		Switcher = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(opt.el).eq(0),
				$switch,
				$syncInput,
				classTemp = [],
				set = function(value, init) {
					var status = $syncInput.prop('checked');
					if(opt.disabled){
						return null;
					}
					if (!!value !== status) {
						if (value) {
							$switch.addClass('switch-on');
						} else {
							$switch.removeClass('switch-on');
						}
						$syncInput.prop('checked', !!value);
						if (!init && typeof opt.onChange === 'function') {
							opt.onChange(!!value);
						}
					}
				},
				disabled = function(flag, init){
					if(!init && (opt.disabled === !flag)){
						return null;
					}
					if(flag){
						$switch.removeClass('switch-disabled');
					}else{
						$switch.addClass('switch-disabled');
					}
					return opt.disabled = !flag;
				};
			if (!$this.length || $this.data('switch-init')) {
				return null;
			}
			if($.isPlainObject($this.data('config'))){
				$.extend(opt, $this.data('config'));
			}
			$switch = $(template);
			if (opt.round) {
				classTemp.push('switch-round');
			}
			if (opt.color && opt.color.split) {
				classTemp.push('switch-' + opt.color);
			}
			switch (opt.size) {
				case "lg":
					classTemp.push('switch-lg');
					break;
				case "sm":
					classTemp.push('switch-sm');
					break;
			}
			if($this.is('input[type="checkbox"]')){
				$syncInput = $this;
				if (opt.name && opt.name.split) {
					$syncInput.attr('name', opt.name);
				}
			}else{
				if (opt.name && opt.name.split) {
					if ($('input[name="' + opt.name + '"]').length) {
						$syncInput = $('input[name="' + opt.name + '"]');
					} else {
						$syncInput = $('<input type="checkbox" name="' + opt.name + '" style="display:none">').appendTo($this);
					}
				} else {
					$syncInput = $('<input type="checkbox" >');
				}
			}
			if(opt.value===null){
				opt.value = $syncInput.prop('checked');
			}else{
				$syncInput.prop('checked', opt.value);
			}
			
			if ($syncInput.prop('checked')) {
				classTemp.push('switch-on');
			}
			
			disabled(!opt.disabled, true);
			set(opt.value, true);

			$switch
				.addClass(classTemp.join(' '))
				.on('mouseup', '.handle', function(e) {
					e.preventDefault();
					var status = $syncInput.prop('checked');
					set(!status);
				});

			$this.data('switch-init', 1);
			if($this.is('input[type="checkbox"]')){
				$this.hide().after($switch);
			}else{
				$this.append($switch);
			}

			return {
				value: function(flag){
					if(flag === void 0){
						return $syncInput.prop('checked');
					}else{
						return set(!!flag);
					}
				},
				disabled: disabled
			};
		};

	$.fn.switcher = function(config) {
		return Switcher($.extend({
			el: this
		}, config || {}));
	};
	$('.flow-ui-switch').each(function(){
		$(this).switcher();
	});
	module.exports = Switcher;
});