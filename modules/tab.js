/*
 * name: tab.js
 * version: v2.2.0
 * update: 增加tab_t.last
 * date: 2016-06-20
 */
define('tab', function(require, exports, module) {
	var $ = require('jquery');
	seajs.importStyle('.tab .tab_t{cursor:pointer}.tab .tab_c{display:none}.tab .tab_c_cur{display:block}', module.uri)

	var def = {
		tabs: ".tab_t", //标签
		conts: ".tab_c", //内容
		width_auto: false, //标签自适应宽度
		posi_auto: true, //标签自动定位，关闭后可以样式控制
		left: 0, //第一个标签距左起始位置
		margin: 0, //标签间距
		auto: false, //是否自动播放，默认否
		interval: 5e3, //自动播放间隔，默认5s
		start: 0, //初始显示，默认第一个
		timeout: 0, //触发延迟
		act: 'click', //触发动作
		beforeChange:function(){},//切换前，return false将终止切换
		callback: function() {}, //回调方法 @param ($this,$tab_t,index) : 当前对象，标签，当前帧序号
		ext: function() {} //扩展方法 @param ($this,$tab_t,opts) : 当前对象，标签，配置
	}
	$.fn.tab = function(config) {
		return $(this).each(function(i, e) {
			var $this = $(e).addClass('tab tabID' + parseInt(Math.random() * 1e5)),
				opt = $.extend({}, def, opt, config || {}),
				thisPosition = $this.css('position'),
				toggletab, tab_t_collect, tiemout, $tab_t, $tab_t_avail, $tab_c;
			if ($this.data('tabruning')) return $this;
			if (thisPosition !== 'absolute' && thisPosition !== 'fixed') {
				thisPosition = 'relative';
			}
			$this.css('position', thisPosition).fadeIn(160);

			$tab_t = $this.find(opt.tabs);
			if (!$tab_t.length) {
				console.log('tabs not exists');
				return $(this);
			}
			$tab_t_avail = $tab_t.filter(function() {
				if ($(this).attr('ignore') === void(0)) {
					return $(this);
				}
			}).addClass('tab_available');

			$tab_c = $this.find(opt.conts).addClass('tab_c');
			if (!$tab_c.length) {
				console.log('tabContent not exists');
				return $(this);
			}
			toggletab = function(i) {
				$tab_t_avail.eq(i).addClass('tab_t_cur').siblings().removeClass('tab_t_cur');
				$tab_c.eq(i).addClass('tab_c_cur').siblings().removeClass('tab_c_cur');
			};
			tab_t_collect = (' ' + $this.attr('class')).split(' ').join('.') + " .tab_available";

			//选显卡和标签数量不相等
			if ($tab_t_avail.length !== $tab_c.length) {
				console.log("tabs'length !== contents'length");
				return $this;
			}
			if (opt.width_auto) {
				$tab_t.width(1 / $tab_t.length * 100 + '%');
			};

			$tab_t.each(function(i, e) {
				if (opt.posi_auto) {
					var leftPx = 0;
					for (var _i = 0; _i < i; _i++) {
						leftPx += parseFloat($tab_t.eq(_i).outerWidth(true));
					};
					$(e).css({
						position: 'absolute',
						top: 0,
						'left': opt.width_auto ? 1 / $tab_t.length * 100 * i + '%' : leftPx + opt.left + opt.margin * i
					});
				}
				if (!i) {
					$(e).addClass('first');
				}
				if($tab_t.length-i===1){
					$(e).addClass('last');
				}
			}).on(opt.act, function(event) {
				if ($(this).attr('ignore') == void(0)) {
					event.preventDefault();
					var index = $(this).index(tab_t_collect),
						_timeout,
						_last;
					typeof(opt.beforeChange)==='function' && opt.beforeChange($this, $tab_t, index);
					if (event.timeStamp) {
						_last = event.timeStamp;
						_timeout = setTimeout(function() {
							if (_last - event.timeStamp == 0) {
								toggletab(index);
							};
						}, opt.tiemout);
					} else {
						toggletab(index);
					};
				};
				setTimeout(function() {
					typeof(opt.callback)==='function' && opt.callback($this, $tab_t, index);
					index = _timeout = _last = null;
				}, 0);
			});

			//启动
			$tab_t_avail.eq(opt.start).trigger(opt.act);
			$this.data('tabruning');
			//扩展
			opt.ext && opt.ext($this, $tab_t, opt);

			//自动播放
			if ($tab_t_avail.length > 1 && opt.auto) {
				var i = opt.start,
					auto = function() {
						i = i >= $tab_t_avail.length - 1 ? 0 : ++i;
						$tab_t_avail.eq(i).trigger(opt.act);
					},
					t = setInterval(function() {
						auto()
					}, opt.interval);
				$tab_c.hover(function() {
					clearInterval(t);
				}, function() {
					t = setInterval(function() {
						auto()
					}, opt.interval);
				});
				$this.parent().on('DOMNodeRemoved',function(e){
					if($(e.target).is($this)){
						//DOM移除后释放全局变量
						t && clearInterval(t);
					}
				});
			};
		})
	};
});