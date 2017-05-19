/*
 * name: tab.js
 * version: v4.2.0
 * update: 增加 throttle 配置
 * date: 2017-05-19
 */
define('tab', function(require, exports, module) {
	"use strict";
	var $ = window.$ || require('jquery'),
		etpl = require('etpl'),
		etplEngine = new etpl.Engine(),
		def = {
			el: null,
			conts: ".tab-cont", //内容元素
			data: null,
			active: undefined, //初始显示，默认第一个
			act: 'click', //mouseenter, 
			throttle: 300, 
			extra: null,
			beforeChange: null, 
			onChange: null, 
			onReady: null 
		},
		template = '<div class="tab-nav">\
    <!-- for: ${data} as ${tab} -->\
    <div class="tab-title<!-- if: ${tab.color} --> tab-${tab.color}<!-- /if --><!-- if: ${tab.disabled} --> tab-disabled<!-- /if --><!-- if: ${tab.actived} --> tab-actived<!-- /if -->">${tab.title | raw}</div>\
    <!-- /for -->\
</div>\
<div class="tab-extra"></div>\
<div class="tab-cont-wrap">\
	<!-- for: ${data} as ${tab} -->\
    <div class="tab-cont<!-- if: ${tab.actived} --> tab-actived<!-- /if -->">${tab.cont | raw}</div>\
   	<!-- /for -->\
</div>',
		render,
		Tab = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(opt.el).eq(0),
				thisPosition,
				toggletab,
				throttleTimer,
				$tab_t,
				$tab_c,
				tabsData,
				html;
			if (!$this.length || $this.data('tab-init')) {
				return null;
			}
			if ($.isArray(opt.data) && opt.data.length) {
				tabsData = opt.data;
			} else if ($this.find(opt.conts).length) {
				tabsData = [];
				$this.find(opt.conts).each(function(i, e) {
					tabsData.push({
						title: $(e).data('tab-title') || '未命名',
						cont: $(e).html(),
						disabled: $(e).attr('disabled') !== void 0,
						actived: $(e).attr('actived') !== void 0
					});
				});
			} else {
				return console.warn('tab:tabs not exists!');
			}
			if (opt.active === void 0) {
				$.each(tabsData, function(i, d) {
					if (d.actived) {
						if (opt.active === void 0) {
							opt.active = i;
						} else {
							d.actived = false;
						}
					}
				});
			}
			if (opt.active === void 0) {
				opt.active = 0;
				tabsData[opt.active].actived = true;
			}

			html = render({
				data: tabsData
			});
			thisPosition = $this.css('position');
			if (thisPosition !== 'absolute' && thisPosition !== 'fixed') {
				thisPosition = 'relative';
			}

			$this.data('tab-init', true).addClass('tab').css('position', thisPosition).html(html).fadeIn(160);
			if (typeof opt.extra === 'function') {
				opt.extra = opt.extra();
			}
			if (opt.extra) {
				$this.find('.tab-extra').html(opt.extra);
			}
			$tab_t = $this.find('.tab-title');
			$tab_c = $this.find('.tab-cont');

			toggletab = function($this) {
				var index = $this.index();
				if(opt.active === index || $this.hasClass('tab-disabled') || $this.hasClass('tab-actived')){
					return null;
				}
				opt.active = index;
				typeof(opt.beforeChange) === 'function' && opt.beforeChange(index);
				$tab_t.eq(index).addClass('tab-actived').siblings('.tab-actived').removeClass('tab-actived');
				$tab_c.eq(index).addClass('tab-actived').siblings('.tab-actived').removeClass('tab-actived');
				setTimeout(function() {
					typeof(opt.onChange) === 'function' && opt.onChange(index);
				}, 0);
			};

			$tab_t.on(opt.act, function(event) {
				event.preventDefault();
				var targetTab = $(this),
					_last;
				if (opt.act === 'mouseenter' && event.timeStamp) {
					_last = event.timeStamp;
					throttleTimer && clearTimeout(throttleTimer);
					throttleTimer = setTimeout(function() {
						if (_last - event.timeStamp === 0) {
							toggletab(targetTab);
						}
						_last = null;
					}, opt.throttle);
				} else {
					toggletab(targetTab);
				}
			}).eq(opt.active).trigger(opt.act);

			typeof opt.onReady === 'function' && opt.onReady($this, opt);

			return {
				active: function(index) {
					if (index === void 0) {
						return opt.active;
					} else {
						return $tab_t.eq(index).trigger(opt.act);
					}
				},
				disabled: function(index, value) {
					if ($tab_t.eq(index).length) {
						if (!!value) {
							$tab_t.eq(index).removeClass('tab-disabled');
						} else {
							$tab_t.eq(index).addClass('tab-disabled');
						}
					}
				},
				setCont: function(index, cont) {
					if ($tab_c.eq(index).length && (cont !== void 0)) {
						$tab_c.eq(index).html(cont);
					}
				}
			};
		};

	etplEngine.config({
		variableOpen: '${',
		variableClose: '}'
	});
	render = etplEngine.compile(template);

	$.fn.tab = function(config) {
		return Tab($.extend({
			el: this
		}, config || {}));
	};
	module.exports = Tab;
});