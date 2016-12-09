/*
 * name: drag
 * vertion: v0.7.1
 * update: 优化
 * date: 2016-12-09
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
    var moveTimer;
    var moveIt = function(ele, offset) {
        if (!moveTimer) {
            if (base.browser.support3d) {
                var translateX = $(ele).data('translateX') || '0px';
                var translateY = $(ele).data('translateY') || '0px';
                var startX = $(ele).data('start').x;
                var startY = $(ele).data('start').y;
                var movecb = $(ele).data('movecb');
                translateX = (offset[0] - parseInt(startX)) + 'px';
                translateY = (offset[1] - parseInt(startY)) + 'px';
                moveTimer = setTimeout(function() {
                    $(ele)
                        .data('translateX', translateX)
                        .data('translateY', translateY)
                        .get(0).style.transform = 'translate(' + translateX + ',' + translateY + ')';
                    moveTimer = clearTimeout(moveTimer);
                    typeof(movecb) === 'function' && movecb(ele);
                }, 1000 / 60);
            } else {
                moveTimer = setTimeout(function() {
                    $(ele).css({
                        left: offset[0],
                        top: offset[1]
                    });
                    moveTimer = clearTimeout(moveTimer);
                    typeof(movecb) === 'function' && movecb(ele);
                }, 1000 / 60);
            }
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
            if ($this.data('draginit')) {
                return null;
            }
            if (thisPosition !== 'absolute' && thisPosition !== 'fixed') {
                cssobj.position = 'relative';
            }
            $this.css(cssobj).data('movecb', opt.drag).data('draginit', 1);
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
                            ry = parseInt(oy - my + e.clientY),
                            movex, movey;
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
                        if ((ry < 0 && fw > ow) || (ry > 0 && fw < ow)) {
                            if (!opt.overflow) {
                                movey = 0;
                            } else {
                                movey = ry;
                            }
                        } else if ((ry > 0 && ry > (fh - oh)) || (ry < 0 && ry < (fh - oh))) {
                            if (!opt.overflow) {
                                movey = fh - oh;
                            } else {
                                movey = ry;
                            }
                        } else {
                            movey = ry;
                        }
                        return moveIt($this, [rx, ry]);
                    },
                    mouseup = function() {
                        $(document).unbind('mousemove', mousemove).unbind('mouseup', mouseup);
                        typeof(opt.dragEnd) === 'function' && opt.dragEnd($this);
                    };
                $this.bind("mousedown", function(e) {
                    ox = parseInt($this.offset().left) || 0;
                    oy = parseInt($this.offset().top) || 0;
                    if (!$this.data('start')) {
                        $this.data('start', {
                            x: ox,
                            y: oy
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