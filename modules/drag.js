/*
 * name: drag
 * vertion: v0.9.3
 * update: 兼容触屏
 * date: 2017-08-16
 */
define('drag', function(require, exports, module) {
    'use strict';
    var $ = window.$ || require('jquery'),
        base = require('base'),
        ready = require('img-ready'),
        def = {
            wrap: null,
            el: null,
            overflow: false,
            dragStart: null,
            onDrag: null,
            dragEnd: null,
            onMove: null
        },
        moveTimer,
        moveIt = function(ele, offset) {
            if (!moveTimer) {
                var wst = $(window).scrollTop();
                if (base.browser.support3d) {
                    var startX = $(ele).data('start').x;
                    var startY = $(ele).data('start').y;
                    var movecb = $(ele).data('movecb');
                    var translateX = (offset[0] - parseInt(startX)) + 'px';
                    var translateY = (offset[1] - parseInt(startY)) + 'px';
                    moveTimer = setTimeout(function() {
                        $(ele)
                            .data('translateX', translateX)
                            .data('translateY', translateY)
                            .get(0).style.transform = 'translate(' + translateX + ',' + translateY + ')';
                        moveTimer = clearTimeout(moveTimer);
                        typeof(movecb) === 'function' && movecb(ele);
                    }, 0);
                } else {
                    moveTimer = setTimeout(function() {
                        $(ele).css({
                            left: offset[0],
                            top: offset[1]
                        });
                        moveTimer = clearTimeout(moveTimer);
                        typeof(movecb) === 'function' && movecb(ele);
                    }, 0);
                }
            }
        },
        Drag = function(config) {
            var opt = $.extend({}, def, config || {}),
                $this = $(opt.el).eq(0),
                ox, oy, mx, my, fw, fh, bindEvents,
                ow,
                oh,
                thisPosition,
                cssobj = {};
            if (!$this.length || $this.data('drag-init')) {
                return null;
            }
            if(typeof opt.onMove !== 'function'){
                cssobj.cursor = "move";
            }
            ow = $this.outerWidth();
            oh = $this.outerHeight();
            thisPosition = base.getStyle($this.get(0),'position');

            if (thisPosition !== 'absolute' && thisPosition !== 'fixed') {
                cssobj.position = 'relative';
            }
            $this.css(cssobj).data('movecb', opt.onDrag).data('drag-init', 1);
            thisPosition = cssobj = null;
            if ($(opt.wrap).length) {
                fw = $(opt.wrap).outerWidth();
                fh = $(opt.wrap).outerHeight();
            } else {
                 if ($this.parent().is('body')) {
                    fw = $(window).width();
                    fh = $(window).height();
                } else {
                    fw = $this.parent().outerWidth();
                    fh = $this.parent().outerHeight();
                }
            }
            bindEvents = function() {
                var mousemove = function(e) {
                        e.preventDefault && e.preventDefault();
                        var rx = parseInt(ox - mx + e.clientX),
                            ry = parseInt(oy - my + e.clientY),
                            wst = base.getStyle($this.get(0),'position')==='fixed' ? 0 : $(window).scrollTop(),
                            movex, movey;
                        if (typeof opt.onMove === 'function') {
                            return opt.onMove(e.clientX - mx, my - e.clientY);
                        }
                        // drective X
                        if ((rx < 0 && fw > ow) || (rx > 0 && fw < ow)) {
                            if (!opt.overflow) {
                                movex = 0;
                            } else {
                                movex = rx;
                            }
                        } else if ((rx > 0 && rx > (fw - ow)) || (rx < 0 && rx < (fw - ow))) {
                            if (!opt.overflow) {
                                movex = fw - ow;
                            } else {
                                movex = rx;
                            }
                        } else {
                            movex = rx;
                        }
                        // drective Y
                        if ((ry < wst && fw > ow) || (ry > wst && fw < ow)) {
                            if (!opt.overflow) {
                                movey = wst;
                            } else {
                                movey = ry;
                            }
                        } else if ((ry > wst && ry > (fh - oh + wst)) || (ry < wst && ry < (fh - oh + wst))) {
                            if (!opt.overflow) {
                                movey = fh - oh + wst;
                            } else {
                                movey = ry;
                            }
                        } else {
                            movey = ry;
                        }
                        return moveIt($this, [movex, movey]);
                    },
                    mouseup = function() {
                        $(document).off('mousemove', mousemove).off('mouseup', mouseup);
                        if(typeof(opt.dragEnd) === 'function'){
                            setTimeout(function(){
                                opt.dragEnd($this);
                            },64);
                        }
                    };
                $this.on("mousedown", function(e) {
                    var wst = base.getStyle($this.get(0),'position')==='fixed' ? $(window).scrollTop() : 0;
                    ox = parseInt($this.offset().left) || 0;
                    oy = parseInt($this.offset().top - wst) || 0;
                    if (!$this.data('start')) {
                        $this.data('start', {
                            x: ox,
                            y: oy
                        });
                    }
                    mx = e.clientX;
                    my = e.clientY;
                    $(document).on({
                        'mousemove': mousemove,
                        'mouseup': mouseup
                    });
                    typeof(opt.dragStart) === 'function' && opt.dragStart($this);
                });
                //触屏
                $this.on("touchstart", function(e) {
                    e.preventDefault();
                    var evt = e.originalEvent;
                    var wst = base.getStyle($this.get(0),'position')==='fixed' ? $(window).scrollTop() : 0;
                    ox = parseInt($this.offset().left) || 0;
                    oy = parseInt($this.offset().top - wst) || 0;
                    if (!$this.data('start')) {
                        $this.data('start', {
                            x: ox,
                            y: oy
                        });
                    }
                    mx = evt.touches[0].clientX;
                    my = evt.touches[0].clientY;
                    typeof(opt.dragStart) === 'function' && opt.dragStart($this);
                }).on('touchmove', function(e){
                    mousemove(e.originalEvent.touches[0]);
                }).on('touchend', function(e){
                    mouseup(e.originalEvent.touches[0]);
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
        };

    $.fn.drag = function(config) {
        return Drag($.extend({
            el: this
        }, config || {}));
    };
    module.exports = Drag;
});