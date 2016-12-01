/*
* name: offcanvas.js
* version: v2.0.4
* update: 右侧菜单第一次执行左侧闪现问题
* data: 2015-12-12
*/
define('offcanvas',function(require, exports, module) {
	var $ = require('jquery');
	seajs.importStyle('html.mm-opened,html.mm-opened body{position:relative;overflow:hidden;width:100%;height:100%}.mm-opened #mm-blocker,.mm-opened .mm-fixed-bottom,.mm-opened .mm-fixed-top,.mm-opened .mm-menu,.mm-opened .mm-menu.mm-horizontal>.mm-panel{-webkit-transition:none .4s ease;transition:none .4s ease;-webkit-transition-property:top,right,bottom,left,border;transition-property:top,right,bottom,left,border}#mm-blocker{position:absolute;z-index:999;top:0;display:none;width:100%;height:100%;margin:0;border:0;background:url(about:blank)}.mm-blocking #mm-blocker,.mm-opened #mm-blocker{display:block}.mm-opened.mm-opening .mm-menu{left:0}.mm-opened #mm-blocker{left:50%}.mm-menu .mm-hidden{display:none}.mm-fixed-bottom,.mm-fixed-top{position:fixed;left:0}.mm-fixed-top{top:0}.mm-fixed-bottom{bottom:0}.mm-opened{position:relative;overflow:hidden;width:100%;height:100%}.mm-menu.mm-current{display:block}.mm-menu{position:fixed;z-index:100;top:0;left:-50%;overflow:hidden;width:50%;height:100%;padding:0}.mm-menu>.mm-panel{position:absolute;z-index:0;top:0;left:100%;overflow-x:hidden;overflow-y:auto;box-sizing:border-box;width:100%;height:100%;padding:20px;background:inherit;-webkit-overflow-scrolling:touch}.mm-menu>.mm-panel.mm-opened{left:0}.mm-menu>.mm-panel.mm-subopened{left:-40%}.mm-menu>.mm-panel.mm-highest{z-index:1}.mm-menu>.mm-panel.mm-hidden{display:block;visibility:hidden}.mm-menu .mm-list{padding:20px 0}.mm-menu>.mm-list{padding:20px 0 40px 0}.mm-panel>.mm-list{margin-right:-20px;margin-left:-20px}.mm-panel>.mm-list:first-child{padding-top:0}.mm-list,.mm-list>li{display:block;margin:0;padding:0;list-style:none}.mm-list a,.mm-list a:hover{text-decoration:none}.mm-list>li{position:relative}.mm-list>li>a,.mm-list>li>span{display:block;overflow:hidden;margin:0;padding:10px 10px 10px 20px;white-space:nowrap;text-overflow:ellipsis;color:inherit}.mm-list>li:not(.mm-subtitle):not(.mm-label):not(.mm-noresults)::after{position:absolute;bottom:0;left:0;display:block;width:100%;content:"";border-bottom-width:1px;border-bottom-style:solid}.mm-list>li:not(.mm-subtitle):not(.mm-label):not(.mm-noresults):after{position:relative;left:auto;width:auto;margin-left:20px}.mm-list a.mm-subopen{position:absolute;z-index:2;top:0;right:0;width:40px;height:100%;padding:0}.mm-list a.mm-subopen::before{position:absolute;top:0;left:0;display:block;height:100%;content:"";border-left-width:1px;border-left-style:solid}.mm-list a.mm-subopen.mm-fullsubopen{width:100%}.mm-list a.mm-subopen.mm-fullsubopen:before{border-left:0}.mm-list a.mm-subopen+a,.mm-list a.mm-subopen+span{margin-right:40px;padding-right:5px}.mm-list>li.mm-selected>a.mm-subopen{background:0 0}.mm-list>li.mm-selected>a.mm-fullsubopen+a,.mm-list>li.mm-selected>a.mm-fullsubopen+span{margin-right:0;padding-right:45px}.mm-list a.mm-subclose{margin-top:-20px;padding-top:30px;text-indent:20px}.mm-list>li.mm-label{font-size:10px;line-height:25px;overflow:hidden;padding-right:5px;white-space:nowrap;text-indent:20px;text-transform:uppercase;text-overflow:ellipsis}.mm-list>li.mm-spacer{padding-top:40px}.mm-list>li.mm-spacer.mm-label{padding-top:25px}.mm-list a.mm-subclose:before,.mm-list a.mm-subopen:after{position:absolute;bottom:50%;display:block;width:7px;height:7px;margin-bottom:-5px;content:"";-webkit-transform:rotate(-45deg);transform:rotate(-45deg);border:2px solid transparent}.mm-list a.mm-subopen:after{right:18px;border-top:0;border-left:0}.mm-list a.mm-subclose:before{left:22px;margin-bottom:-15px;border-right:0;border-bottom:0}.mm-menu.mm-vertical .mm-list .mm-panel{display:none;padding:10px 0 10px 10px}.mm-menu.mm-vertical .mm-list .mm-panel li:last-child:after{border-color:transparent}.mm-menu.mm-vertical .mm-list li.mm-opened>.mm-panel{display:block}.mm-menu.mm-vertical .mm-list>li.mm-opened>a.mm-subopen{height:40px}.mm-menu.mm-vertical .mm-list>li.mm-opened>a.mm-subopen:after{top:16px;right:16px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.mm-ismenu{background:#333}.mm-menu{color:rgba(255,255,255,.6)}.mm-menu .mm-list>li:after{border-color:rgba(0,0,0,.15)}.mm-menu .mm-list>li>a.mm-subclose{color:rgba(255,255,255,.3);background:rgba(0,0,0,.1)}.mm-menu .mm-list>li>a.mm-subclose:before,.mm-menu .mm-list>li>a.mm-subopen:after{border-color:rgba(255,255,255,.3)}.mm-menu .mm-list>li>a.mm-subopen:before{border-color:rgba(0,0,0,.15)}.mm-menu .mm-list>li.mm-selected>a:not(.mm-subopen),.mm-menu .mm-list>li.mm-selected>span{background:rgba(0,0,0,.1)}.mm-menu .mm-list>li.mm-label{background:rgba(255,255,255,.05)}.mm-menu.mm-vertical .mm-list li.mm-opened>a.mm-subopen,.mm-menu.mm-vertical .mm-list li.mm-opened>ul{background:rgba(255,255,255,.05)}@media all and (min-width:880px){.mm-menu{left:-440px;width:440px}.mm-opened.mm-opening #mm-blocker,.mm-opened.mm-opening .mm-fixed-bottom,.mm-opened.mm-opening .mm-fixed-top{left:440px}}.mm-opened.mm-front .mm-fixed-bottom,.mm-opened.mm-front .mm-fixed-top,.mm-opened.mm-opening.mm-front .mm-fixed-bottom,.mm-opened.mm-opening.mm-front .mm-fixed-top{right:auto;left:0}.mm-opened.mm-front .mm-fixed-top,.mm-opened.mm-opening.mm-front .mm-fixed-top{top:0}.mm-opened.mm-front .mm-fixed-bottom,.mm-opened.mm-opening.mm-front .mm-fixed-bottom{bottom:0}.mm-bottom.mm-menu,.mm-top.mm-menu{left:0;width:100%;height:50%}.mm-top.mm-menu{top:-50%;bottom:auto}.mm-top.mm-opened.mm-menu{top:0}.mm-top.mm-opened #mm-blocker{top:50%;bottom:auto;left:0}.mm-menu.mm-bottom{top:auto;bottom:-50%}.mm-bottom.mm-opened .mm-menu{bottom:0}.mm-bottom.mm-opened #mm-blocker{top:auto;bottom:50%;left:0}.mm-right .mm-menu{right:-50%;left:auto}.mm-right.mm-opened.mm-opening .mm-menu{right:0;left:auto}.mm-right.mm-opened.mm-opening #mm-blocker{right:50%;left:auto}@media all and (min-height:1100px){.mm-menu.mm-top{top:-880px;height:880px}.mm-top.mm-opened.mm-opening #mm-blocker{top:880px}.mm-menu.mm-bottom{bottom:-880px;height:880px}.mm-bottom.mm-opened.mm-opening #mm-blocker{bottom:880px}}.mm-menu.mm-right{right:-440px;left:auto}@media all and (min-width:880px){.mm-menu.mm-right{width:440px}}.mm-menu.mm-front,.mm-menu.mm-next{-webkit-transition:none .4s ease;transition:none .4s ease;-webkit-transition-property:top,right,bottom,left,-webkit-transform;transition-property:top,right,bottom,left,transform}.mm-front #mm-blocker{z-index:0}.mm-menu.mm-front{box-shadow:0 0 15px rgba(0,0,0,.5)}.mm-opening .mm-menu.mm-front,.mm-opening .mm-menu.mm-next{left:0}.mm-menu.mm-top.mm-front,.mm-menu.mm-top.mm-next{left:0}.mm-opening .mm-menu.mm-top.mm-front,.mm-opening .mm-menu.mm-top.mm-next{top:0;left:0}.mm-menu.mm-right.mm-front,.mm-menu.mm-right.mm-next{left:auto}.mm-opening .mm-menu.mm-right.mm-front,.mm-opening .mm-menu.mm-right.mm-next{right:0;left:auto}.mm-menu.mm-bottom.mm-front,.mm-menu.mm-bottom.mm-next{top:auto;left:0}.mm-opening .mm-menu.mm-bottom.mm-front,.mm-opening .mm-menu.mm-bottom.mm-next{bottom:0;left:0}.mm-menu.mm-front,.mm-menu.mm-next{left:-50%}.mm-ismenu.mm-light{background:#f3f3f3}.mm-menu.mm-light{color:rgba(0,0,0,.6)}.mm-menu.mm-light .mm-list>li:after{border-color:rgba(0,0,0,.1)}.mm-menu.mm-light .mm-list>li>a.mm-subclose{color:rgba(0,0,0,.3);background:rgba(255,255,255,.6)}.mm-menu.mm-light .mm-list>li>a.mm-subclose:before,.mm-menu.mm-light .mm-list>li>a.mm-subopen:after{border-color:rgba(0,0,0,.3)}.mm-menu.mm-light .mm-list>li>a.mm-subopen:before{border-color:rgba(0,0,0,.1)}.mm-menu.mm-light .mm-list>li.mm-selected>a:not(.mm-subopen),.mm-menu.mm-light .mm-list>li.mm-selected>span{background:rgba(255,255,255,.6)}.mm-menu.mm-light .mm-list>li.mm-label{background:rgba(0,0,0,.03)}.mm-menu.mm-light.mm-vertical .mm-list li.mm-opened>a.mm-subopen,.mm-menu.mm-light.mm-vertical .mm-list li.mm-opened>ul{background:rgba(0,0,0,.03)}.mm-menu.mm-light .mm-search input{color:rgba(0,0,0,.6);background:rgba(0,0,0,.1)}.mm-menu.mm-light li.mm-noresults{color:rgba(0,0,0,.3)}.mm-menu.mm-light em.mm-counter{color:rgba(0,0,0,.3)}.mm-menu.mm-light .mm-list li.mm-label>div>div{background:rgba(0,0,0,.03)}.mm-menu.mm-light .mm-header{color:rgba(0,0,0,.3);border-color:rgba(0,0,0,.1)}.mm-menu.mm-light .mm-header a:before{border-color:rgba(0,0,0,.3)}.mm-ismenu.mm-white{background:#fff}.mm-menu.mm-white{color:rgba(0,0,0,.6)}.mm-menu.mm-white .mm-list>li:after{border-color:rgba(0,0,0,.1)}.mm-menu.mm-white .mm-list>li>a.mm-subclose{color:rgba(0,0,0,.3);background:rgba(0,0,0,.08)}.mm-menu.mm-white .mm-list>li>a.mm-subclose:before,.mm-menu.mm-white .mm-list>li>a.mm-subopen:after{border-color:rgba(0,0,0,.3)}.mm-menu.mm-white .mm-list>li>a.mm-subopen:before{border-color:rgba(0,0,0,.1)}.mm-menu.mm-white .mm-list>li.mm-selected>a:not(.mm-subopen),.mm-menu.mm-white .mm-list>li.mm-selected>span{background:rgba(0,0,0,.08)}.mm-menu.mm-white .mm-list>li.mm-label{background:rgba(0,0,0,.03)}.mm-menu.mm-white.mm-vertical .mm-list li.mm-opened>a.mm-subopen,.mm-menu.mm-white.mm-vertical .mm-list li.mm-opened>ul{background:rgba(0,0,0,.03)}.mm-menu.mm-white .mm-search input{color:rgba(0,0,0,.6);background:rgba(0,0,0,.1)}.mm-menu.mm-white li.mm-noresults{color:rgba(0,0,0,.3)}.mm-menu.mm-white em.mm-counter{color:rgba(0,0,0,.3)}.mm-menu.mm-white .mm-list li.mm-label>div>div{background:rgba(0,0,0,.03)}.mm-menu.mm-white .mm-header{color:rgba(0,0,0,.3);border-color:rgba(0,0,0,.1)}.mm-menu.mm-white .mm-header a:before{border-color:rgba(0,0,0,.3)}.mm-ismenu.mm-black{background:#000}.mm-menu.mm-black{color:rgba(255,255,255,.6)}.mm-menu.mm-black .mm-list>li:after{border-color:rgba(255,255,255,.2)}.mm-menu.mm-black .mm-list>li>a.mm-subclose{color:rgba(255,255,255,.3);background:rgba(255,255,255,.25)}.mm-menu.mm-black .mm-list>li>a.mm-subclose:before,.mm-menu.mm-black .mm-list>li>a.mm-subopen:after{border-color:rgba(255,255,255,.3)}.mm-menu.mm-black .mm-list>li>a.mm-subopen:before{border-color:rgba(255,255,255,.2)}.mm-menu.mm-black .mm-list>li.mm-selected>a:not(.mm-subopen),.mm-menu.mm-black .mm-list>li.mm-selected>span{background:rgba(255,255,255,.25)}.mm-menu.mm-black .mm-list>li.mm-label{background:rgba(255,255,255,.15)}.mm-menu.mm-black.mm-vertical .mm-list li.mm-opened>a.mm-subopen,.mm-menu.mm-black.mm-vertical .mm-list li.mm-opened>ul{background:rgba(255,255,255,.15)}.mm-menu.mm-black .mm-search input{color:rgba(255,255,255,.6);background:rgba(255,255,255,.3)}.mm-menu.mm-black li.mm-noresults{color:rgba(255,255,255,.3)}.mm-menu.mm-black em.mm-counter{color:rgba(255,255,255,.3)}.mm-menu.mm-black .mm-list li.mm-label>div>div{background:rgba(255,255,255,.15)}.mm-menu.mm-black .mm-header{color:rgba(255,255,255,.3);border-color:rgba(255,255,255,.2)}.mm-menu.mm-black .mm-header a:before{border-color:rgba(255,255,255,.3)}'
		,module.uri);
	var _PLUGIN_ = 'offcanvas';
	if ($[_PLUGIN_]) {
		return
	};
	var glbl = {
		$wndw: null,
		$html: null,
		$body: null,
		$blck: null,
		$allMenus: null,
		$scrollTopNode: null
	};
	var _c = {},
		_e = {},
		_d = {},
		_serialnr = 0;
	$[_PLUGIN_] = function($menu, opts, conf) {
		glbl.$allMenus = glbl.$allMenus.add($menu);
		this.$menu = $menu;
		this.opts = opts;
		this.conf = conf;
		this.serialnr = _serialnr++;
		this._init();
		return this
	};
	$[_PLUGIN_].prototype = {
		open: function() {
			this._openSetup();
			this._openFinish();
			return 'open'
		},
		_openSetup: function() {
			var _scrollTop = findScrollTop();
			this.$menu.addClass(_c.current);
			glbl.$allMenus.not(this.$menu).trigger(_e.close);
			var _w = 0;
			if (this.opts.position != 'left') {
				glbl.$html.addClass(_c.mm(this.opts.position))
			}
			if (this.opts.classes) {
				glbl.$html.addClass(this.opts.classes)
			}
			glbl.$html.addClass(_c.opened);
			this.$menu.addClass(_c.opened);
			this.$menu.addClass(_c.mm(this.opts.zposition));
			this.$menu.addClass(_c.background);
			this.$menu.scrollTop(0)
		},
		_openFinish: function() {
			var that = this;
			glbl.$html.addClass(_c.opening);
			this.$menu.trigger(_e.opening);
			window.scrollTo(0, 1)
		},
		close: function() {
			var that = this;
			transitionend(glbl.$wndw, function() {
				that.$menu.removeClass(_c.current).removeClass(_c.opened);
				glbl.$html.removeClass(_c.opened).removeClass(_c.background).removeClass(_c.mm(that.opts.position)).removeClass(_c.mm(that.opts.zposition));
				if (that.opts.classes) {
					glbl.$html.removeClass(that.opts.classes)
				}
				glbl.$wndw.off(_e.resize).off(_e.keydown);
				that.$menu.trigger(_e.closed)
			}, this.conf.transitionDuration);
			glbl.$html.removeClass(_c.opening);
			this.$menu.trigger(_e.closing);
			return 'close'
		},
		_init: function() {
			this.opts = extendOptions(this.opts, this.conf, this.$menu);
			this.direction = (this.opts.slidingSubmenus) ? 'horizontal' : 'vertical';
			this._initMenu();
			this._initBlocker();
			this._initPanles();
			this._initLinks();
			this._initOpenClose();
			this._bindCustomEvents();
			if ($[_PLUGIN_].addons) {
				for (var a = 0; a < $[_PLUGIN_].addons.length; a++) {
					if (typeof this['_addon_' + $[_PLUGIN_].addons[a]] == 'function') {
						this['_addon_' + $[_PLUGIN_].addons[a]]()
					}
				}
			}
		},
		_bindCustomEvents: function() {
			var that = this;
			this.$menu.off(_e.open + ' ' + _e.close + ' ' + _e.setPage + ' ' + _e.update).on(_e.open + ' ' + _e.close + ' ' + _e.setPage + ' ' + _e.update, function(e) {
				e.stopPropagation()
			});
			this.$menu.on(_e.open, function(e) {
				if ($(this).hasClass(_c.current)) {
					e.stopImmediatePropagation();
					return false
				}
				return that.open()
			}).on(_e.close, function(e) {
				if (!$(this).hasClass(_c.current)) {
					e.stopImmediatePropagation();
					return false
				}
				return that.close()
			}).on(_e.setPage, function(e, $p) {
				that._initOpenClose()
			});
			var $panels = this.$menu.find(this.opts.isMenu && this.direction != 'horizontal' ? 'ul, ol' : '.' + _c.panel);
			$panels.off(_e.toggle + ' ' + _e.open + ' ' + _e.close).on(_e.toggle + ' ' + _e.open + ' ' + _e.close, function(e) {
				e.stopPropagation()
			});
			if (this.direction == 'horizontal') {
				$panels.on(_e.open, function(e) {
					return openSubmenuHorizontal($(this), that.$menu)
				})
			} else {
				$panels.on(_e.toggle, function(e) {
					var $t = $(this);
					return $t.triggerHandler($t.parent().hasClass(_c.opened) ? _e.close : _e.open)
				}).on(_e.open, function(e) {
					$(this).parent().addClass(_c.opened);
					return 'open'
				}).on(_e.close, function(e) {
					$(this).parent().removeClass(_c.opened);
					return 'close'
				})
			}
		},
		_initBlocker: function() {
			var that = this;
			if (!glbl.$blck) {
				glbl.$blck = $('<div id="' + _c.blocker + '" />').css('opacity', 0).appendTo(glbl.$body)
			}
			glbl.$blck.off(_e.touchstart).on(_e.touchstart, function(e) {
				e.preventDefault();
				e.stopPropagation();
				glbl.$blck.trigger(_e.mousedown)
			}).on(_e.mousedown, function(e) {
				e.preventDefault();
				that.$menu.trigger(_e.close)
			})
		},
		_initMenu: function() {
			var that = this,
				_class = '';
			if (this.opts.isMenu) {
				this.$menu.attr('class','');
				this.$menu.contents().each(function() {
					if ($(this)[0].nodeType == 3) {
						$(this).remove()
					}
				});
			}
			_class+=(_c.menu+' '+_c.mm(this.direction));

			if (this.opts.classes) {
				_class+=(' '+this.opts.classes);
			}
			if (this.opts.isMenu) {
				_class+=(' '+_c.ismenu);
			}
			if (this.opts.position != 'left') {
				_class+=(' '+_c.mm(this.opts.position));
			}
			this.$menu.addClass(_class);
		},
		_initPanles: function() {
			var that = this;
			this.__refactorClass($('.' + this.conf.listClass, this.$menu), 'list');
			if (this.opts.isMenu) {
				$('ul, ol', this.$menu).not('.mm-nolist').addClass(_c.list)
			}
			var $lis = $('.' + _c.list + ' > li', this.$menu);
			this.__refactorClass($lis.filter('.' + this.conf.selectedClass), 'selected');
			this.__refactorClass($lis.filter('.' + this.conf.labelClass), 'label');
			this.__refactorClass($lis.filter('.' + this.conf.spacerClass), 'spacer');
			$lis.off(_e.setSelected).on(_e.setSelected, function(e, selected) {
				e.stopPropagation();
				$lis.removeClass(_c.selected);
				if (typeof selected != 'boolean') {
					selected = true
				}
				if (selected) {
					$(this).addClass(_c.selected)
				}
			});
			this.__refactorClass($('.' + this.conf.panelClass, this.$menu), 'panel');
			this.$menu.children().filter(this.conf.panelNodetype).add(this.$menu.find('.' + _c.list).children().children().filter(this.conf.panelNodetype)).addClass(_c.panel);
			var $panels = $('.' + _c.panel, this.$menu);
			$panels.each(function(i) {
				var $t = $(this),
					id = $t.attr('id') || _c.mm('m' + that.serialnr + '-p' + i);
				$t.attr('id', id)
			});
			$panels.find('.' + _c.panel).each(function(i) {
				var $t = $(this),
					$u = $t.is('ul, ol') ? $t : $t.find('ul ,ol').first(),
					$l = $t.parent(),
					$a = $l.find('> a, > span'),
					$p = $l.closest('.' + _c.panel);
				$t.data(_d.parent, $l);
				if ($l.parent().is('.' + _c.list)) {
					var $btn = $('<a class="' + _c.subopen + '" href="#' + $t.attr('id') + '" />').insertBefore($a);
					if (!$a.is('a')) {
						$btn.addClass(_c.fullsubopen)
					}
					if (that.direction == 'horizontal') {
						$u.prepend('<li class="' + _c.subtitle + '"><a class="' + _c.subclose + '" href="#' + $p.attr('id') + '">' + $a.text() + '</a></li>')
					}
				}
			});
			var evt = this.direction == 'horizontal' ? _e.open : _e.toggle;
			$panels.each(function(i) {
				var $opening = $(this),
					id = $opening.attr('id');
				$('a[href="#' + id + '"]', that.$menu).off(_e.click).on(_e.click, function(e) {
					e.preventDefault();
					$opening.trigger(evt)
				})
			});
			if (this.direction == 'horizontal') {
				var $selected = $('.' + _c.list + ' > li.' + _c.selected, this.$menu);
				$selected.add($selected.parents('li')).parents('li').removeClass(_c.selected).end().each(function() {
					var $t = $(this),
						$u = $t.find('> .' + _c.panel);
					if ($u.length) {
						$t.parents('.' + _c.panel).addClass(_c.subopened);
						$u.addClass(_c.opened)
					}
				}).closest('.' + _c.panel).addClass(_c.opened).parents('.' + _c.panel).addClass(_c.subopened)
			} else {
				$('li.' + _c.selected, this.$menu).addClass(_c.opened).parents('.' + _c.selected).removeClass(_c.selected)
			}
			var $current = $panels.filter('.' + _c.opened);
			if (!$current.length) {
				$current = $panels.first()
			}
			$current.addClass(_c.opened).last().addClass(_c.current);
			if (this.direction == 'horizontal') {
				$panels.find('.' + _c.panel).appendTo(this.$menu)
			}
		},
		_initLinks: function() {
			var that = this;
			$('.' + _c.list + ' > li > a', this.$menu).not('.' + _c.subopen).not('.' + _c.subclose).not('[rel="external"]').not('[target="_blank"]').off(_e.click).on(_e.click, function(e) {
				var $t = $(this),
					href = $t.attr('href');
					
				if (that.__valueOrFn(that.opts.onClick.setSelected, $t)) {
					$t.parent().trigger(_e.setSelected)
				}
				var preventDefault = that.__valueOrFn(that.opts.onClick.preventDefault, $t, href.slice(0, 1) == '#');
				if (preventDefault) {
					e.preventDefault()
				}
				if (that.__valueOrFn(that.opts.onClick.blockUI, $t, !preventDefault)) {
					glbl.$html.addClass(_c.blocking)
				}
				if (that.__valueOrFn(that.opts.onClick.close, $t, preventDefault)) {
					that.$menu.triggerHandler(_e.close)
				}
			})
		},
		_initOpenClose: function() {
			var that = this;
			var id = this.$menu.attr('id');
			if (id && id.length) {
				if (this.conf.clone) {
					id = _c.umm(id)
				}
				$('a[href="#' + id + '"]').off(_e.click).on(_e.click, function(e) {
					e.preventDefault();
					if(that.$menu.hasClass(_c.opened)){
						return that.$menu.trigger(_e.close)
					}
					that.$menu.trigger(_e.open)
				})
			}

		},
		__valueOrFn: function(o, $e, d) {
			if (typeof o == 'function') {
				return o.call($e[0])
			}
			if (typeof o == 'undefined' && typeof d != 'undefined') {
				return d
			}
			return o
		},
		__refactorClass: function($e, c) {
			$e.removeClass(this.conf[c + 'Class']).addClass(_c[c])
		}
	};
	$.fn[_PLUGIN_] = function(opts, conf) {
		if (!glbl.$wndw) {
			_initPlugin()
		}
		opts = extendOptions(opts, conf);
		conf = extendConfiguration(conf);
		return this.each(function() {
			var $menu = $(this);
			if ($menu.data(_PLUGIN_)) {
				return
			}
			$menu.data(_PLUGIN_, new $[_PLUGIN_]($menu, opts, conf))
		})
	};
	$[_PLUGIN_].defaults = {
		position: 'left',
		zposition: 'front',
		moveBackground	: true,
		slidingSubmenus: true,
		classes: '',
		onClick: {
			setSelected: true
		}
	};
	$[_PLUGIN_].configuration = {
		panelClass: 'Panel',
		listClass: 'List',
		selectedClass: 'Selected',
		labelClass: 'Label',
		spacerClass: 'Spacer',
		pageNodetype: 'div',
		panelNodetype: 'ul, ol, div',
		transitionDuration: 400
	};
	(function() {
		var wd = window.document,
			ua = window.navigator.userAgent,
			ds = document.createElement('div').style;
		var _touch = 'ontouchstart' in wd,
			_overflowscrolling = 'WebkitOverflowScrolling' in wd.documentElement.style,
			_oldAndroidBrowser = (function() {
				if (ua.indexOf('Android') >= 0) {
					return 2.4 > parseFloat(ua.slice(ua.indexOf('Android') + 8))
				}
				return false
			})();
		$[_PLUGIN_].support = {
			touch: _touch,
			oldAndroidBrowser: _oldAndroidBrowser,
			overflowscrolling: (function() {
				if (!_touch) {
					return true
				}
				if (_overflowscrolling) {
					return true
				}
				if (_oldAndroidBrowser) {
					return false
				}
				return true
			})()
		}
	})();
	$[_PLUGIN_].useOverflowScrollingFallback = function(use) {
		if (glbl.$html) {
			if (typeof use == 'boolean') {
				glbl.$html[use ? 'addClass' : 'removeClass'](_c.nooverflowscrolling)
			}
			return glbl.$html.hasClass(_c.nooverflowscrolling)
		} else {
			_useOverflowScrollingFallback = use;
			return use
		}
	};
	$[_PLUGIN_].debug = function(msg) {};
	$[_PLUGIN_].deprecated = function(depr, repl) {
		if (typeof console != 'undefined' && typeof console.warn != 'undefined') {
			console.warn('MMENU: ' + depr + ' is deprecated, use ' + repl + ' instead.')
		}
	};
	var _useOverflowScrollingFallback = !$[_PLUGIN_].support.overflowscrolling;

	function extendOptions(o, c, $m) {
		if (typeof o != 'object') {
			o = {}
		}
		if ($m) {
			if (typeof o.isMenu != 'boolean') {
				var $c = $m.children();
				o.isMenu = ($c.length == 1 && $c.is(c.panelNodetype))
			}
			return o
		}
		if (typeof o.onClick != 'object') {
			o.onClick = {}
		}
		if (typeof o.onClick.setLocationHref != 'undefined') {
			$[_PLUGIN_].deprecated('onClick.setLocationHref option', '!onClick.preventDefault');
			if (typeof o.onClick.setLocationHref == 'boolean') {
				o.onClick.preventDefault = !o.onClick.setLocationHref
			}
		}
		o = $.extend(true, {}, $[_PLUGIN_].defaults, o);
		if ($[_PLUGIN_].useOverflowScrollingFallback()) {
			switch (o.position) {
			case 'top':
			case 'right':
			case 'bottom':
				$[_PLUGIN_].debug('position: "' + o.position + '" not supported when using the overflowScrolling-fallback.');
				o.position = 'left';
				break
			}
			switch (o.zposition) {
			case 'front':
			case 'next':
				$[_PLUGIN_].debug('z-position: "' + o.zposition + '" not supported when using the overflowScrolling-fallback.');
				o.zposition = 'back';
				break
			}
		}
		return o
	}
	function extendConfiguration(c) {
		if (typeof c != 'object') {
			c = {}
		}
		if (typeof c.panelNodeType != 'undefined') {
			$[_PLUGIN_].deprecated('panelNodeType configuration option', 'panelNodetype');
			c.panelNodetype = c.panelNodeType
		}
		c = $.extend(true, {}, $[_PLUGIN_].configuration, c);
		if (typeof c.pageSelector != 'string') {
			c.pageSelector = '> ' + c.pageNodetype
		}
		return c
	}
	function _initPlugin() {
		glbl.$wndw = $(window);
		glbl.$html = $('html');
		glbl.$body = $('body');
		glbl.$allMenus = $();
		$.each([_c, _d, _e], function(i, o) {
			o.add = function(c) {
				c = c.split(' ');
				for (var d in c) {
					o[c[d]] = o.mm(c[d])
				}
			}
		});
		_c.mm = function(c) {
			return 'mm-' + c
		};
		_c.add('menu ismenu panel list subtitle selected label spacer current highest hidden page blocker background opened opening subopened subopen fullsubopen subclose nooverflowscrolling');
		_c.umm = function(c) {
			if (c.slice(0, 3) == 'mm-') {
				c = c.slice(3)
			}
			return c
		};
		_d.mm = function(d) {
			return 'mm-' + d
		};
		_d.add('parent style scrollTop offetLeft');
		_e.mm = function(e) {
			return e + '.mm'
		};
		_e.add('toggle open opening opened close closing closed update setPage setSelected transitionend webkitTransitionEnd touchstart touchend mousedown mouseup click keydown keyup resize');
		$[_PLUGIN_]._c = _c;
		$[_PLUGIN_]._d = _d;
		$[_PLUGIN_]._e = _e;
		$[_PLUGIN_].glbl = glbl;
		$[_PLUGIN_].useOverflowScrollingFallback(_useOverflowScrollingFallback)
	}
	function openSubmenuHorizontal($opening, $m) {
		if ($opening.hasClass(_c.current)) {
			return false
		}
		var $panels = $('.' + _c.panel, $m),
			$current = $panels.filter('.' + _c.current);
		$panels.removeClass(_c.highest).removeClass(_c.current).not($opening).not($current).addClass(_c.hidden);
		if ($opening.hasClass(_c.opened)) {
			$current.addClass(_c.highest).removeClass(_c.opened).removeClass(_c.subopened)
		} else {
			$opening.addClass(_c.highest);
			$current.addClass(_c.subopened)
		}
		$opening.removeClass(_c.hidden).removeClass(_c.subopened).addClass(_c.current).addClass(_c.opened);
		return 'open'
	}
	function findScrollTop() {
		if (!glbl.$scrollTopNode) {
			if (glbl.$html.scrollTop() != 0) {
				glbl.$scrollTopNode = glbl.$html
			} else if (glbl.$body.scrollTop() != 0) {
				glbl.$scrollTopNode = glbl.$body
			}
		}
		return (glbl.$scrollTopNode) ? glbl.$scrollTopNode.scrollTop() : 0
	}
	function transitionend($e, fn, duration) {
		var _ended = false,
			_fn = function() {
				if (!_ended) {
					fn.call($e[0])
				}
				_ended = true
			};
		$e.one(_e.transitionend, _fn);
		$e.one(_e.webkitTransitionEnd, _fn);
		setTimeout(_fn, duration * 1.1)
	}
})