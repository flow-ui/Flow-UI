/*
 * name: slider.js
 * version: v0.0.2
 * update: default color = primary
 * date: 2017-04-14
 */
define('slider', function(require, exports, module) {
	"use strict";
	seajs.importStyle('.slider{cursor: pointer;}\
        .slider .progress-bg{height: 12px;}\
        .slider .slider-handle{position: absolute;width:18px;height: 18px;border-radius: 9px; left:0;top:50%;margin:-9px 0 0 -9px;z-index: 2;cursor: pointer;box-shadow:1px 1px 1px 0 rgba(0,0,0,.3);transition: all ease .3s;}\
        .slider .slider-handle:after{content:"";position:absolute;width:100%;height:100%;left:0;top:0;border-radius:50%;background:rgba(0,0,0,.2);}\
        .slider .slider-handle:hover{box-shadow: none;}\
        .slider .slider-handle:hover:after{background:rgba(255,255,255,.2);}\
        .on-move .progress-bg, .on-move .slider-handle{transition:none}\
        .slider-popper{display:none;position: absolute;min-width:40px;height:30px;line-height:30px; left: 50%;bottom: 100%;margin:0 0 5px -20px; transform: translateX(-50%) translate3d(20px,0,0);user-select:none;-webkit-user-select:none;}\
        .slider-popper-arrow{position: absolute; width: 0; height: 0; border:5px solid;bottom: 3px; border-color: #4f4f4f transparent transparent;border-color: rgba(70,76,91,.9) transparent transparent;left: 50%; margin-left: -5px;top:100%;}\
        .slider-popper-inner{padding: 0 12px; color: #fff; text-align: center; text-decoration: none; background-color: #4f4f4f; background-color: rgba(70,76,91,.9);border-radius: 4px; box-shadow: 0 1px 6px rgba(0,0,0,.2); white-space: nowrap;}\
        .slider-handle-hover .slider-popper, .slider-handle:hover .slider-popper{display:block}\
        .slider-disabled{cursor: not-allowed;}\
        .slider-disabled .progress-bg{background:#ccc;}\
        .slider-disabled .slider-handle{background:#999;cursor: not-allowed;}', module.uri);
	var $ = require('jquery'),
		drag = require('drag'),
		def = {
			el: null,
			value: 0,
			min: 0,
			max: 100,
			step: 1,
			color: 'primary',
			disabled: false,
			tip: true,
			tipRender: null,
			onChange: null
		},
		template = '<div class="progress slider">\
                    <div class="progress-inner">\
                        <div class="progress-bg"></div>\
                    </div>\
                    <div class="slider-handle slider-handle-end"></div>\
                </div>',
		Slider = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(config.el).eq(0),
				$slider,
				total,
				isRange,
				setValue = function(value, init) {
					var start,
						end;
					if(opt.disabled && !init){
						return null;
					}
					if (isRange) {
						start = parseFloat(value[0]);
						end = parseFloat(value[1]);
						if (isNaN(start) || isNaN(end)) {
							return console.warn('slider(): value不是有效数值！');
						}
						start = Math.max(opt.min, start);
						start = start - start % opt.step;
						end = end - end % opt.step;
						end = Math.max(opt.step + start, end);
						end = Math.min(opt.max, end);
						start = Math.min(end - opt.step, start);

						if (!init && start === opt.value[0] && end === opt.value[1]) {
							return null;
						}
						opt.value = [start, end];
					} else {
						end = parseFloat(value);
						if (isNaN(end)) {
							return console.warn('slider(): value不是有效数值！', value);
						}
						end = Math.min(opt.max, end);
						end = Math.max(opt.min, end);
						if (!init) {
							if (String(opt.step).indexOf('.') === -1) {
								end = end - end % opt.step;
							} else {
								var dotlength = String(opt.step).length - Math.max(String(opt.step).indexOf('.'), 1) - 1;
								var dotmult = 1;
								var _dotlength = dotlength;
								while (_dotlength) {
									dotmult = dotmult * 10;
									_dotlength--;
								}
								_dotlength = null;
								end = ((end * dotmult - (end * dotmult) % (opt.step * dotmult)) / dotmult).toFixed(dotlength);
							}
							if (end === opt.value) {
								return null;
							}
						}
						opt.value = end;
					}

					if (start !== void 0) {
						var startTip = start;
						if (typeof opt.tipRender === 'function') {
							startTip = opt.tipRender(start);
						}
						$slider.find('.slider-handle-start').css('left', Math.round(start / total * 100) + '%')
							.find('.slider-popper-inner').text(startTip).end().end()
							.find('.progress-bg').css('left', Math.round(start / total * 100) + '%');
					}
					if (end !== void 0) {
						var endTip = end;
						if (typeof opt.tipRender === 'function') {
							endTip = opt.tipRender(end);
						}
						$slider.find('.slider-handle-end').css('left', Math.round(end / total * 100) + '%')
							.find('.slider-popper-inner').text(endTip).end().end()
							.find('.progress-bg').css('width', Math.round((end - (start || 0)) / total * 100) + '%');
					}
				},
				disabled = function(flag, init){
					if(!init && (opt.disabled === !flag)){
						return null;
					}
					if(flag){
						$slider.removeClass('slider-disabled');
					}else{
						$slider.addClass('slider-disabled');
					}
					return opt.disabled = !flag;
				};

			if (!$this.length || $this.data('slider-init')) {
				return null;
			}
			isRange = $.isArray(opt.value) && opt.value.length >= 2;
			opt.step = Math.abs(opt.step);

			if (isNaN(parseFloat(opt.min))) {
				opt.min = def.min;
				console.warn('slider(): min设置无效，将使用默认值', def.min);
			}
			if (isNaN(parseFloat(opt.max))) {
				opt.max = def.max;
				console.warn('slider(): max设置无效，将使用默认值', def.max);
			}
			if (opt.max <= opt.min) {
				return console.warn('slider(): max <= min， 请检查配置！');
			}
			total = opt.max - opt.min;

			$slider = $(template);
			
			disabled(!opt.disabled, true);

			if (isRange) {
				$slider.prepend('<div class="slider-handle slider-handle-start"></div>');
			}
			if (opt.tip) {
				$slider.find('.slider-handle').append('<div class="slider-popper"><div class="slider-popper-arrow"></div> <div class="slider-popper-inner"></div></div>');
			}

			if(opt.color && opt.color.split){
				$slider.addClass('progress-' + opt.color).find('.slider-handle').addClass('bg-' + opt.color);
			}

			setValue(opt.value, true);

			$this.data('slider-init', true).append($slider);

			var totalWidth = parseFloat($slider.width()),
				startWidth,
				hasWidth,
				oValue;

			drag({
				el: $slider.find('.slider-handle-end'),
				dragStart: function($this) {
					oValue = opt.value;
					$slider.addClass('on-move');
					$this.addClass('slider-handle-hover');
					startWidth = $slider.find('.progress-bg').css('left') === 'auto' ? 0 : parseFloat($slider.find('.progress-bg').css('left'));
					hasWidth = startWidth + parseFloat($slider.find('.progress-bg').width());
				},
				onMove: function(x, y) {
					var newEnd = opt.max * (hasWidth + x) / totalWidth;
					if (isRange) {
						return setValue([opt.value[0], newEnd]);
					}
					return setValue(newEnd);
				},
				dragEnd: function($this) {
					$slider.removeClass('on-move');
					$this.removeClass('slider-handle-hover');

					if (typeof opt.onChange === 'function' && oValue !== opt.value) {
						opt.onChange(opt.value);
					}
				}
			});
			if ($slider.find('.slider-handle-start').length) {
				drag({
					el: $slider.find('.slider-handle-start'),
					dragStart: function($this) {
						$slider.addClass('on-move');
						$this.addClass('slider-handle-hover');
						startWidth = $slider.find('.progress-bg').css('left') === 'auto' ? 0 : parseFloat($slider.find('.progress-bg').css('left'));
						hasWidth = startWidth + parseFloat($slider.find('.progress-bg').width());
					},
					onMove: function(x, y) {
						var newStart = opt.max * (startWidth + x) / totalWidth;
						return setValue([newStart, opt.value[1]]);
					},
					dragEnd: function($this) {
						$slider.removeClass('on-move');
						$this.removeClass('slider-handle-hover');
					}
				});
			}

			return {
				value: function(value) {
					if (value === void 0) {
						return opt.value;
					} else {
						return setValue(value);
					}
				},
				disabled: disabled
			};
		};

	$.fn.slider = function(config) {
		return Slider($.extend({
			el: this
		}, config || {}));
	};
	module.exports = Slider;
});