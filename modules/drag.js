/*
 * name: drag
 * vertion: v0.5.0
 * update: 增加dragStart和dragEnd回调
 * date: 2015-09-13
 */
define('drag',function(require, exports, module) {
    var $ = require('jquery');
    var ready = require('img-ready');
    var def = {
                wrap: null,
                overflow: false,
                dragStart: null,
                dragEnd: null
            };
    $.fn.drag = function(config) {
        var $this = $(this),
            ox, oy, mx, my, fw, fh, bindEvents,
            ow = $this.outerWidth(),
            oh = $this.outerHeight(),
            opt = $.extend({}, def, config || {}),
            thisPosition = $this.css('position');

        if (thisPosition !== 'absolute' && thisPosition !== 'fixed') {
            thisPosition = 'relative';
        }
        $this.css({
            "position": thisPosition,
            "cursor": "move"
        });
        if (opt.wrap === null) {
            if ($this.parent().is('body')) {
                fw = $(window).width();
                fh = $(window).height();
            } else {
                fw = $this.parent().outerWidth();
                fh = $this.parent().outerHeight();
            };
        } else {
            fw = $(opt.wrap).outerWidth();
            fh = $(opt.wrap).outerHeight();
        }
        bindEvents = function() {
            var mousemove = function(e) {
                    e.preventDefault();
                    var rx = parseInt(ox - mx + e.clientX),
                        ry = parseInt(oy - my + e.clientY);
                    // drective X
                    if ((rx < 0 && fw > ow) || (rx > 0 && fw < ow)) {
                        if (!opt.overflow) {
                            $this.css('left', 0);
                        } else {
                            $this.css('left', rx);
                        }
                    } else if ((rx > 0 && rx > (fw - ow)) || (rx < 0 && rx < (fw - ow))) {
                        if (!opt.overflow) {
                            $this.css('left', fw - ow);
                        } else {
                            $this.css('left', rx);
                        }
                    } else {
                        $this.css('left', rx);
                    };
                    // drective Y
                    if ((ry < 0 && fw > ow) || (ry > 0 && fw < ow)) {
                        if (!opt.overflow) {
                            $this.css('top', 0);
                        } else {
                            $this.css('top', ry);
                        }
                    } else if ((ry > 0 && ry > (fh - oh)) || (ry < 0 && ry < (fh - oh))) {
                        if (!opt.overflow) {
                            $this.css('top', fh - oh);
                        } else {
                            $this.css('top', ry);
                        }
                    } else {
                        $this.css('top', ry);
                    };
                    return false;
                },
                mouseup = function() {
                    $(document).unbind('mousemove', mousemove).unbind('mouseup', mouseup);
                    typeof(opt.dragEnd)==='function' && opt.dragEnd($this);
                };
            $this.bind("mousedown", function(e) {
                ox = parseInt($this.css('left')) || 0;
                oy = parseInt($this.css('top')) || 0;
                mx = e.clientX;
                my = e.clientY;
                $(document).bind({
                    'mousemove': mousemove,
                    'mouseup': mouseup
                });
                typeof(opt.dragStart)==='function' && opt.dragStart($(this));
            });
        }
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
        return $this;
    }
});