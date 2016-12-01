/*
 * name:scrollbar
 * vertion: v2.2.7
 * update: 增加错误提示
 * date: 2016-04-06
 */
define('scroll-bar', function(require, exports, module) {
    seajs.importStyle('.scrollbar-ui .scroll_cont{position:relative}\
        .scrollbar-ui .scroll_bar{position:absolute;z-index:8;cursor:default;-moz-user-select:none;opacity:0;background:#efefef;transition:opacity ease .3s}\
        .scrollbar-ui-hover .scroll_bar{opacity:1}.scrollbar-ui .scroll_up,.scrollbar-ui .scroll_down{position:absolute;left:0;background:black}\
        .scrollbar-ui .scroll_up{top:0}.scrollbar-ui .scroll_down{bottom:0}.scroll_up_on,.scroll_down_on{background:#ccc}\
        .scrollbar-ui .scroll_slider{position:absolute;left:0;cursor:default;background:#666}.scroll_slider_on{background:#ccc}', module.uri);
    require('mousewheel');

    var $ = require('jquery'),
        base = require('base'),
        def = {
            wrap: null, //包裹元素，默认不指定，将新增div.scroll_cont
            monitor: false, //监听内容变化（用于多插件协作），布尔值，默认false
            overflow: "y", //滚动条方向，默认"y"(纵向)，可选"x"(横向)
            keyway: 30, //键程，默认30（px）
            width: 8, //滚动条宽度，默认8（px）
            btnLength: 0, //按钮长度，默认0（不显示按钮）
            btnBreadth: '100%', //按钮宽度，默认与滚动条同宽
            sliderWidth: '100%', //滑块宽度，默认与滚动条同宽
            hideBar: false, //自动隐藏滚动条,
            ontop: function(){}, //滚动到顶部触发
            onend: function(){} //滚动到底部触发
        };

    $.fn.scrollBar = function(config) {
        var opt = $.extend({}, def, config || {});

        if (base.browser.isMobile) {
            return $(this).css({
                'overflow': 'auto',
                '-webkit-overflow-scrolling': 'touch'
            }).each(function(i,e){
                if(opt.overflow=='y'){
                    $(e).on('scroll',function(){
                        var st = $(this).scrollTop(),
                            sh = $(this).get(0).scrollHeight;
                        if(st==0){
                            opt.ontop();
                        };
                        if(st>=sh-$(this).height()){
                            opt.onend();
                        }
                    })
                }else if(opt.overflow=='x'){
                    $(e).on('scroll',function(){
                        var sl = $(this).scrollLeft(),
                            sw = $(this).get(0).scrollWidth;
                        if(sl==0){
                            opt.ontop();
                        };
                        if(sl>=sw-$(this).width()){
                            opt.onend();
                        }
                    })
                };
            });
        };

        return $(this).each(function(i, e) {
            
            var $this = $(e).addClass('scrollbar-ui').fadeIn(320),
                scrollCont, sliderBar, sliderLength, prop, wheelHandler, init, passive, setSlider,
                _length, _breadth, _posiLength, _posiBreadth, _scrollContLength, thisLength,
                sliderGone = 0,
                isWork = false,
                sliderBar = $("<div class='scroll_bar' onselectstart='return false;'>\
                        <div class='scroll_up'><!----></div>\
                        <div class='scroll_slider' unselectable='on'><!----></div>\
                        <div class='scroll_down'><!----></div>\
                    </div>"),
                btnUp = sliderBar.children('.scroll_up'),
                btnDown = sliderBar.children('.scroll_down'),
                scrollSlider = sliderBar.children('.scroll_slider'),
                statusLock = false,
                _thisInnerWidth = 0; //横向滚动内容宽度容器
            if ($(e).data('scrollbar')) {
                return;
            }
            //定义基本概念
            switch (opt.overflow) {
                case 'x':
                    _length = "width"
                    _breadth = "height"
                    _posiLength = "left"
                    _posiBreadth = "bottom"
                    break;
                default:
                    _length = "height"
                    _breadth = "width"
                    _posiLength = "top"
                    _posiBreadth = "right"
                    break;
            };
            //获取scrollCont
            if ($this.find(opt.wrap).length) {
                scrollCont = $this.find(opt.wrap);
            } else {
                _thisInnerWidth = parseFloat($this.children().css(_length));
                $this.wrapInner("<div class='scroll_cont'></div>");
                scrollCont = $this.children('.scroll_cont');
            };
            //插入滚动条
            $this.append(sliderBar);
            if (opt.hideBar) {
                $this.on({
                    'mouseenter': function() {
                        $(this).addClass('scrollbar-ui-hover');
                    },
                    'mouseleave': function() {
                        $(this).removeClass('scrollbar-ui-hover');
                    }
                })
            } else {
                $this.addClass('scrollbar-ui-hover');
            };
            //预处理
            thisLength = parseFloat($this.css(_length));
            sliderBar.
                css(_length, "100%").
                css(_breadth, opt.width).
                css(_posiBreadth, 0).
                css(_posiLength, 0);
            btnUp.
                css(_length, opt.btnLength).
                css(_breadth, opt.btnBreadth);
            btnDown.
                css(_length, opt.btnLength).
                css(_breadth, opt.btnBreadth);
            scrollSlider.
                css(_breadth, opt.sliderWidth).
                css(_posiBreadth, 0).
                css(_posiLength, 0);

            scrollSlider.bind('mousedown', function(e) {
                var pageLength, topCur, Move,
                    docMouseMove = function(e2) {
                        if (opt.overflow === 'y') {
                            Move = e2.pageY - pageLength;
                        } else {
                            Move = e2.pageX - pageLength;
                        };
                        sliderGone = topCur + Move;
                        setSlider();
                        return false;
                    },
                    docMouseUp = function() {
                        $(document)
                            .unbind('mousemove', docMouseMove)
                            .unbind('mouseup', docMouseUp);
                        scrollSlider.removeClass('scroll_slider_on');
                    };
                if (opt.overflow === 'y') {
                    pageLength = e.pageY
                } else {
                    pageLength = e.pageX
                };
                topCur = parseFloat($(this)._css(_posiLength));

                $(this).addClass('scroll_slider_on');
                $(document)
                    .bind('mousemove', docMouseMove)
                    .bind('mouseup', docMouseUp);
            });
            btnUp.bind({
                'mousedown': function() {
                    $(this).addClass('scroll_up_on');
                },
                'mouseup': function() {
                    sliderGone = sliderGone - opt.keyway / prop;
                    setSlider();
                    $(this).removeClass('scroll_up_on');
                }
            });
            btnDown.bind({
                'mousedown': function() {
                    $(this).addClass('scroll_down_on');
                },
                'mouseup': function() {
                    sliderGone = sliderGone + opt.keyway / prop;
                    setSlider();
                    $(this).removeClass('scroll_down_on')
                }
            });
            //主方法
            setSlider = function() {
                if (sliderGone <= opt.btnLength) {
                    sliderGone = opt.btnLength;
                    if(!statusLock){
                        statusLock = true;
                        opt.ontop();
                    }
                } else if (sliderGone >= thisLength - opt.btnLength - sliderLength) {
                    sliderGone = thisLength - opt.btnLength - sliderLength;
                    if(!statusLock){
                        statusLock = true;
                        opt.onend();
                    }
                } else{
                    statusLock = false;
                };
                scrollSlider._css(_posiLength, sliderGone);
                scrollCont._css(_posiLength, -((sliderGone - opt.btnLength) * prop));
            };
            init = function(fromMonitor) {
                //获取滚动内容长度
                if (opt.overflow === 'x') {
                    scrollCont.hide();
                };
                _scrollContLength = parseFloat(scrollCont.css(_length));
                if(_scrollContLength===0){
                    return console.warn('there is something wrong with "scrollBar()", check whether the element is hidden.');
                }
                scrollCont.show();
                if (_scrollContLength > thisLength) {
                    //计算滚动条长度
                    sliderLength = parseFloat(scrollSlider.css(_length)) ?
                        parseFloat(scrollSlider.css(_length)) :
                        Math.round(thisLength / _scrollContLength * thisLength);

                    sliderBar.show();
                    isWork = true;
                } else {
                    sliderBar.hide();
                    isWork = false;
                };
                if (fromMonitor){
                    if(isWork){
                        //监听高度改变重新计算滑条长度
                        sliderLength = Math.round(thisLength / _scrollContLength * thisLength);
                    }else{
                        //从无到有
                        return;
                    }
                };
                scrollSlider.css(_length, sliderLength);
                
                //计算比率
                prop = (_scrollContLength - thisLength) < 0 ? 0 :
                    (_scrollContLength - thisLength) / (thisLength - opt.btnLength * 2 - sliderLength);

                setSlider();
                if (fromMonitor && isWork) return;//监听高度改变不重复绑定事件

                //滚轮事件
                wheelHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (_scrollContLength > thisLength) {
                        var delta = e.deltaY * opt.keyway;
                        sliderGone -= delta;
                        setSlider();
                    } else {
                        sliderGone = 0;
                        setSlider();
                        if (!isWork) {
                            $this.off('mousewheel');
                        }
                    }
                }
                $this.on('mousewheel', wheelHandler);
            };
            //监听
            passive = function(scrollCont) {
                var scTop, _sliderGone, _ssH = _scrollContLength, 
                    timer = setInterval(function(event) {
                        //内容定位改变
                        _sliderGone = scrollCont._css(_posiLength);
                        if (scTop != _sliderGone) {
                            scrollSlider._css(_posiLength, opt.btnLength - _sliderGone / prop);
                            scTop = _sliderGone;
                        };
                        //内容高度改变
                        if (parseFloat(scrollCont.css(_length)) != _ssH) {
                            init(true); //区分来自监听的初始化
                            _ssH = parseFloat(scrollCont.css(_length));
                        }
                    }, 160);
                $this.parent().on('DOMNodeRemoved',function(e){
                    if($(e.target).is($this)){
                        //DOM移除后释放全局变量
                        timer && clearInterval(timer);
                    }
                });
            };

            //初始化
            if (scrollCont.find('img').length) {
                require.async('img-loaded', function() {
                    scrollCont.imagesLoaded(function() {
                        init(false);
                        if (opt.monitor) passive(scrollCont);
                    })
                })
            } else {
                init(false);
                if (opt.monitor) passive(scrollCont);
            };
            $this.data('scrollbar', true);
        });
    };
});