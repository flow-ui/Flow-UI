/*
 * name: mouseMenu
 * version: v1.0.0
 * update: 内嵌style
 * data: 2015-05-09
 * base on: zhangxinxu
 */
define('mousemenu',function(require, exports, module) {
    seajs.importStyle('.smart_menu_box{display:none;width:140px;position:absolute;z-index:99}.smart_menu_body{padding:1px;border:1px solid #b8cbcb;background-color:#fff;box-shadow:2px 2px 5px #666}.smart_menu_ul{margin:0;padding:0;list-style-type:none}.smart_menu_li{position:relative}.smart_menu_a{display:block;height:25px;line-height:24px;padding:0 5px 0 25px;color:#000;font-size:12px;text-decoration:none;overflow:hidden}.smart_menu_a:hover,.smart_menu_a_hover{background-color:#348ccc;color:#fff;text-decoration:none}.smart_menu_li_separate{line-height:0;margin:3px;border-bottom:1px solid #b8cbcb;font-size:0}.smart_menu_triangle{width:0;height:0;border:5px dashed transparent;border-left:5px solid #666;overflow:hidden;position:absolute;top:7px;right:5px}.smart_menu_a:hover .smart_menu_triangle,.smart_menu_a_hover .smart_menu_triangle{border-left-color:#fff}.smart_menu_li_hover .smart_menu_box{top:-1px;left:130px}'
        ,module.uri)
    var $ = require('jquery'),
        D = $(document).data("func", {});
    $.mousemenu = function(){};
    $.fn.mousemenu = function(data, options) {
        var B = $("body"),
            defaults = {
                name: "",
                offsetX: 2,
                offsetY: 2,
                textLimit: 6,
                beforeShow: function(){},
                afterShow: function(){},
                broke: function(){}
            };
        var params = $.extend(defaults, options || {});

        var htmlCreateMenu = function(datum) {
                var dataMenu = datum || data,
                    nameMenu = datum ? Math.random().toString() : params.name,
                    htmlMenu = "",
                    htmlCorner = "",
                    clKey = "smart_menu_";
                if ($.isArray(dataMenu) && dataMenu.length) {
                    htmlMenu = '<div id="mousemenu_' + nameMenu + '" class="' + clKey + 'box">' +
                        '<div class="' + clKey + 'body">' +
                        '<ul class="' + clKey + 'ul">';

                    $.each(dataMenu, function(i, arr) {
                        if (i) {
                            htmlMenu = htmlMenu + '<li class="' + clKey + 'li_separate">&nbsp;</li>';
                        }
                        if ($.isArray(arr)) {
                            $.each(arr, function(j, obj) {
                                var text = obj.text,
                                    htmlMenuLi = "",
                                    strTitle = "",
                                    rand = Math.random().toString().replace(".", "");
                                if (text) {
                                    if (text.length > params.textLimit) {
                                        text = text.slice(0, params.textLimit) + "…";
                                        strTitle = ' title="' + obj.text + '"';
                                    }
                                    if ($.isArray(obj.data) && obj.data.length) {
                                        htmlMenuLi = '<li class="' + clKey + 'li" data-hover="true">' 
                                        + htmlCreateMenu(obj.data) +
                                            '<a href="javascript:" class="' + clKey + 'a"' + strTitle 
                                            + ' data-key="' + rand + '"><i class="'+clKey+'triangle"></i>' 
                                            + text + '</a>' +
                                            '</li>';
                                    } else {
                                        htmlMenuLi = '<li class="' + clKey + 'li">' +
                                            '<a href="javascript:" class="' + clKey + 'a"' + strTitle 
                                            + ' data-key="' + rand + '">' + text + '</a>' +
                                            '</li>';
                                    }

                                    htmlMenu += htmlMenuLi;

                                    var objFunc = D.data("func");
                                    objFunc[rand] = obj.func;
                                    D.data("func", objFunc);
                                }
                            });
                        }
                    });

                    htmlMenu = htmlMenu + '</ul>' +
                        '</div>' +
                        '</div>';
                }
                return htmlMenu;
            },
            funSmartMenu = function() {
                var idKey = "#mousemenu_",
                    clKey = "smart_menu_",
                    jqueryMenu = $(idKey + params.name);
                if (!jqueryMenu.length) {
                    $("body").append(htmlCreateMenu());

                    //事件
                    $(idKey + params.name + " a").bind("click", function() {
                        var key = $(this).attr("data-key"),
                            callback = D.data("func")[key];
                        if ($.isFunction(callback)) {
                            callback.call(D.data("trigger"), params.name);
                        }
                        $.mousemenu.hide();
                        return false;
                    });
                    $(idKey + params.name + " li").each(function() {
                        var isHover = $(this).attr("data-hover"),
                            clHover = clKey + "li_hover";

                        $(this).hover(function() {
                            var jqueryHover = $(this).siblings("." + clHover);
                            jqueryHover.removeClass(clHover).children("." + clKey + "box").hide();
                            jqueryHover.children("." + clKey + "a").removeClass(clKey + "a_hover");

                            if (isHover) {
                                $(this).addClass(clHover).children("." + clKey + "box").show();
                                $(this).children("." + clKey + "a").addClass(clKey + "a_hover");
                            }

                        });

                    });
                    return $(idKey + params.name);
                }
                return jqueryMenu;
            };

        $(this).each(function() {
            this.oncontextmenu = function(e) {
                //回调
                if ($.isFunction(params.beforeShow)) {
                    params.beforeShow.call(this);
                }
                e = e || window.event;
                //阻止冒泡
                e.cancelBubble = true;
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                //隐藏当前上下文菜单，确保页面上一次只有一个上下文菜单
                $.mousemenu.hide();
                if (params.broke()) return false;
                var st = D.scrollTop();
                var jqueryMenu = funSmartMenu();
                if (jqueryMenu) {
                    jqueryMenu.css({
                        display: "block",
                        left: e.clientX + params.offsetX,
                        top: e.clientY + st + params.offsetY
                    });
                    D.data("target", jqueryMenu);
                    D.data("trigger", this);
                    //回调
                    if ($.isFunction(params.afterShow)) {
                        params.afterShow.call(this);
                    }
                    return false;
                }
            };
        });
        if (!B.data("bind")) {
            B.bind("click", $.mousemenu.hide).data("bind", true);
        }
    };
    $.extend($.mousemenu, {
        hide: function() {
            var target = D.data("target");
            if (target && target.css("display") === "block") {
                target.hide();
            }
        },
        remove: function() {
            var target = D.data("target");
            if (target) {
                target.remove();
            }
        }
    });
})
