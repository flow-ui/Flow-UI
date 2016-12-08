/*
 * name: drag
 * vertion: v0.7.0
 * update: 支持批量拖拽
 * date: 2016-12-08
 */
define('drag', function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var base = require('base');
    var ready = require('img-ready');
    var def = {
        wrap: null,
        overflow: false,
        dragStart: null,
        drag: null,
        dragEnd: null
    };
    var moveIt = function(ele, dir, offset) {
        if (base.browser.support3d) {
            var requestAnimationFrame = window.requestAnimationFrame || function(cb) {
                setTimeout(cb, 0);
            };
            var translateX = $(ele).data('translateX') || '0px';
            var translateY = $(ele).data('translateY') || '0px';
            var startX = $(ele).data('start').x;
            var startY = $(ele).data('start').y;
            var movecb = $(ele).data('movecb');
            if (dir === 'left') {
                translateX = (offset - parseInt(startX)) + 'px';
            } else if (dir === 'top') {
                translateY = (offset - parseInt(startY)) + 'px';
            } else {
                console.log('内部错误！');
            }
            $(ele).data('translateX', translateX);
            $(ele).data('translateY', translateY);
            requestAnimationFrame(function() {
                $(ele).get(0).style.transform = 'translate(' + translateX + ',' + translateY + ')';
                typeof(movecb) === 'function' && movecb(ele);
            });
        } else {
            $(ele).css(dir, offset);
        }
    };
    $.fn.drag = function(config) {
        return $(this).each(function(i, e) {
            var $this = $(e),
                ox, oy, mx, my, fw, fh, bindEvents,
                ow = $this.outerWidth(),
                oh = $this.outerHeight(),
                opt = $.extend({}, def, config || {}),
                thisPosition = $this.css('position'),
                cssobj = {
                    "cursor": "move"
                };
            if($this.data('draginit')){
                return null;
            }
            $this.data('draginit',1);
            if (thisPosition !== 'absolute' && thisPosition !== 'fixed') {
                cssobj.position = 'relative';
            }
            $this.css(cssobj).data('movecb', opt.drag);
            thisPosition = cssobj = null;
            if (opt.wrap === null) {
                if ($this.parent().is('body')) {
                    fw = $(window).width();
                    fh = $(window).height();
                } else {
                    fw = $this.parent().outerWidth();
                    fh = $this.parent().outerHeight();
                }
            } else if ($(opt.wrap).length) {
                fw = $(opt.wrap).outerWidth();
                fh = $(opt.wrap).outerHeight();
            } else {
                return console.warn('drag:warp参数错误');
            }
            bindEvents = function() {
                var mousemove = function(e) {
                        e.preventDefault();
                        var rx = parseInt(ox - mx + e.clientX),
                            ry = parseInt(oy - my + e.clientY);
                        // drective X
                        if ((rx < 0 && fw > ow) || (rx > 0 && fw < ow)) {
                            if (!opt.overflow) {
                                moveIt($this, 'left', 0);
                            } else {
                                moveIt($this, 'left', rx);
                            }
                        } else if ((rx > 0 && rx > (fw - ow)) || (rx < 0 && rx < (fw - ow))) {
                            if (!opt.overflow) {
                                moveIt($this, 'left', fw - ow);
                            } else {
                                moveIt($this, 'left', rx);
                            }
                        } else {
                            moveIt($this, 'left', rx);
                        }
                        // drective Y
                        if ((ry < 0 && fw > ow) || (ry > 0 && fw < ow)) {
                            if (!opt.overflow) {
                                moveIt($this, 'top', 0);
                            } else {
                                moveIt($this, 'top', ry);
                            }
                        } else if ((ry > 0 && ry > (fh - oh)) || (ry < 0 && ry < (fh - oh))) {
                            if (!opt.overflow) {
                                moveIt($this, 'top', fh - oh);
                            } else {
                                moveIt($this, 'top', ry);
                            }
                        } else {
                            moveIt($this, 'top', ry);
                        }
                        return false;
                    },
                    mouseup = function() {
                        $(document).unbind('mousemove', mousemove).unbind('mouseup', mouseup);
                        typeof(opt.dragEnd) === 'function' && opt.dragEnd($this);
                    };
                $this.bind("mousedown", function(e) {
                    ox = parseInt($this.offset().left) || 0;
                    oy = parseInt($this.offset().top) || 0;
                    if (!$this.data('start')) {
                        $this.data('start',{
                            x:ox,
                            y:oy
                        });
                    }
                    mx = e.clientX;
                    my = e.clientY;
                    $(document).bind({
                        'mousemove': mousemove,
                        'mouseup': mouseup
                    });
                    typeof(opt.dragStart) === 'function' && opt.dragStart($(this));
                });
            };
            if ($this.get(0).nodeName.toLowerCase() == "img") {
                // wait image's size
                ready($this.attr('src'), function(w, h) {
                    ow = w;
                    oh = h;
                    bindEvents();
                });
            } else {
                bindEvents();
            }
        });
    };
});