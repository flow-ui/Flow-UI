/*
 * name: select.js
 * version: v4.1.0
 * update: 支持搜索
 * date: 2016-12-29
 */
define('select', function(require, exports, module) {
    "use strict";
    var animationDuration = 350;
    seajs.importStyle('.select-ui-choose{position:relative;display:inline-block;overflow:hidden;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle}\
        .select-ui-choose ._txt{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 20px 0 8px;border:0;height:100%;line-height:inherit}\
        .select-ui-choose ._arrow{position:absolute;top:0;right:.5em;height:100%}.select-ui-choose ._arrow .arr{position:absolute;top:50%;left:0}\
        .select-ui-choose ._arrow{width:1em}\
        .select-ui-choose ._arrow .arr{transition:transform ease ' + animationDuration + 'ms;transform-origin:50% 25%;margin:-.2em 0 0;border:.4em solid;border-color:#333 transparent transparent}\
        .select-ui-choose.on ._arrow .arr{transform:rotateZ(180deg);margin-top:-.5em\9;border-color:transparent transparent #333\9}\
        .select-ui-choose-top.on{border-radius:0 0 4px 4px}\
        .select-ui-choose-bottom.on{border-radius:4px 4px 0 0}\
        .select-ui-options{transition:transform ease ' + animationDuration + 'ms;transform-origin:50% 0%;transform:rotateX(90deg);\
            position:absolute;z-index:101;font-size:.9em;top:-999em;opacity:.5}\
        .select-ui-options.on{transform:rotateX(0deg);opacity:1}\
        .select-ui-options li{cursor:pointer}.select-ui-options li._disabled{cursor:default}\
        .select-ui-options{overflow:auto;max-height:12em;border:1px solid #e8e9eb;background:#fff}\
        .select-ui-options li{line-height:1.8em;padding:.4em 1em}\
        .select-ui-options li._disabled{color:#aaa}\
        .select-ui-options li._selected{background:#eee}\
        .select-ui-options li:hover, .select-ui-options li.hover{color:#fff;background:#7b7bff}\
        .select-ui-options li._disabled:hover{color:#aaa;background:inherit}\
        .select-ui-options li._selected:hover{color:inherit;background:#eee}\
        .select-ui-options-top{border-bottom:0;border-radius:4px 4px 0 0}\
        .select-ui-options-bottom{border-top:0;border-radius:0 0 4px 4px}', module.uri);
    var $ = require('jquery'),
        def = {
            data: null,
            act: "click", // click | mouseenter
            posi: "bottom", // bottom | top | auto
            hideDisabled: true, // 不显示不可用项
            hideSelected: false, // 不显示已选中项
            hook: '', // 自定义样式钩子
            name: 'select',
            filterable: false,
            callback: function(val, txt) {}
        },
        createDom = function($this, selectData, opt, isSort) {
            //创建DOM
            var _options = '',
                _lis = '',
                key = 0,
                initSelsectd;
            for (; key < selectData.length; key++) {
                var value = selectData[key].value ? selectData[key].value : key;
                var text = selectData[key].option;
                var checkDefault = !!selectData[key].checkDefault;
                var selected = selectData[key].selected;
                var disabled = selectData[key].disabled;
                //原生结构
                _options += '<option' + (disabled ? ' disabled' : '') +
                    (selected ? ' selected' : '') + ' value="' + value + '">' + text + '</option>';
                //模拟结构
                if (!(selected && opt.hideSelected) && !(disabled && opt.hideDisabled)) {
                    _lis += '<li class="' + (disabled ? '_disabled' : '') +
                        (selected ? '_selected' : '') + '" data-val="' + value + '">' + text + '</li>';
                }
                if (selected && !initSelsectd) {
                    initSelsectd = {
                        text: text,
                        value: value
                    };
                }
            }
            if (!_lis) {
                _lis = '<li>暂无数据</li>';
            }
            //未定义selected默认第一项
            if (!initSelsectd) {
                initSelsectd = {
                    text: selectData[0].option,
                    value: selectData[0].value
                };
            }
            //初始化数据
            $this.data('filterchange', !!isSort).data('lastval', initSelsectd.text).html(_options).next('.select-ui-choose').find('span._txt').text(initSelsectd.text);
            if (opt.filterable && !isSort) {
                $this.next('.select-ui-choose').find('input._txt').val(initSelsectd.text);
            }
            selectOptions.html(_lis).data('cellheight', parseInt(selectOptions.find('li').outerHeight()));
        },
        hideOption = function() {
            var _thisChoose = selectOptions.data('choosetarget'),
                _thisSelect = _thisChoose.prev('select');
            _thisChoose.removeClass('on').find('input._txt').blur().val(_thisSelect.data('lastval'));
            selectOptions.removeClass('on').css('top', '-999em').find('li.hover').removeClass('hover');
        },
        chooseHookTop = 'select-ui-choose-top',
        chooseHookBottom = 'select-ui-choose-bottom',
        selectOptions;

    if ($('.select-ui-options').length) {
        selectOptions = $('.select-ui-options');
    } else {
        selectOptions = $('<ul class="select-ui-options" />').appendTo('body');
        //绑定optionS事件
        selectOptions.on('click', 'li', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (!$(this).hasClass('_disabled')) {
                var _val = $(this).data('val'),
                    _text = $(this).text(),
                    _thisSelect = selectOptions.data('choosetarget'),
                    _thisOriginSelect = _thisSelect.prev('select'),
                    _data = _thisOriginSelect.data('data'),
                    _key = 0;
                $(this).addClass('_selected').siblings('li').removeClass('_selected');
                for (; _key < _data.length; _key++) {
                    if (_data[_key].value == _val) {
                        _data[_key].selected = true;
                    } else if (_data[_key].selected) {
                        _data[_key].selected = false;
                    }
                }
                _thisSelect.find('._txt').text(_text).val(_text);
                _thisOriginSelect.val(_val).data('data', _data).data('lastval',_text);
                hideOption();
                typeof(_thisSelect.data('callback')) === 'function' && _thisSelect.data('callback')(_val, _text);
            }
        });
    }
    $.fn.select = function(config) {
        var $this = $(this),
            opt = $.extend({}, def, config || {}),
            showOption = function(selectChoose) {
                //options定位
                var selectChooseOS = selectChoose.offset();
                var selectChooseBorder = parseInt(selectChoose.css('border-left-width')) + parseInt(selectChoose.css('border-right-width'));
                var selectOptionsCss = {
                    "left": selectChooseOS.left,
                    "width": selectChoose.outerWidth() - selectChooseBorder
                };
                selectChoose.addClass('on').find('input._txt').focus();
                if (!selectOptions.data('choosetarget') || (selectOptions.data('choosetarget') && !selectOptions.data('choosetarget').is(selectChoose))) {
                    //重新创建dom
                    createDom($this, $this.data('data'), opt);
                    if (opt.posi !== "top" && opt.posi !== "bottom") {
                        if (selectChooseOS.top - $(window).scrollTop() < $(window).height() + $(window).scrollTop() - selectChooseOS.top) {
                            opt.posi = "bottom";
                        } else {
                            opt.posi = "top";
                        }
                    }
                    selectOptions.attr('class', 'select-ui-options select-ui-options-' + opt.posi + (opt.hook && opt.hook.split ? ' ' + opt.hook : '')).css(selectOptionsCss);
                }else if($this.data('filterchange')){
                    //索引导致dom变化
                    createDom($this, $this.data('data'), opt);
                }
                if (opt.posi === "bottom") {
                    selectChoose.removeClass(chooseHookTop)
                        .addClass(chooseHookBottom);
                    selectOptionsCss.top = selectChooseOS.top + selectChoose.outerHeight();
                } else {
                    selectChoose.removeClass(chooseHookBottom)
                        .addClass(chooseHookTop);
                    selectOptionsCss.top = selectChooseOS.top - selectOptions.outerHeight();
                }
                selectOptions.data('choosetarget', selectChoose).css("top", selectOptionsCss.top);
                setTimeout(function() {
                    selectOptions.addClass('on');
                }, 0);
            },
            selectData = [],
            selectChoose = $this.next('.select-ui-choose'),
            init = function(data) {
                if (data.length) {
                    createDom($this.data('data', data), data, opt);
                } else {
                    return console.warn('select():数据无效', data);
                }
            },
            insertMode = $this.get(0).tagName.indexOf('ELE') === -1;
        //取第一个元素
        if ($this.length > 1) {
            $this = $this.eq(0);
            console.warn('select():target must be single element!');
        }
        if (insertMode) {
            //插入模式
            var createSelect = $('<select name="' + opt.name + '" class="' + $this.attr('class') + '" style="display:none"></select>');
            $this.after(createSelect).remove();
            $this = createSelect;
            createSelect = null;
        } else {
            $this.hide();
        }
        //获取数据
        if ($.isArray(opt.data) && opt.data.length) {
            selectData = opt.data;
        } else {
            $.each($this.find('option'), function(i, e) {
                selectData.push({
                    value: $(e).val(),
                    option: $(e).text(),
                    disabled: $(e).prop('disabled'),
                    selected: $(e).prop('selected')
                });
            });
        }
        //绑定事件      
        if (!selectChoose.length) {
            selectChoose = $('<span class="' + ["select-ui-choose", "form-control", opt.hook].join(" ") + '">' +
                    (opt.filterable ? '<input type="text" class="_txt" />' : '<span class="_txt"></span>') +
                    '<span class="_arrow"><i class="arr"></i></span>' +
                    '</span>')
                .addClass($this.attr('class'))
                .data('callback', opt.callback)
                .on(opt.act, function(e) {
                    e.stopPropagation();
                    if (selectChoose.hasClass('on')) {
                        return hideOption();
                    }
                    showOption(selectChoose);
                    //关闭事件
                    if (opt.act == "mouseenter") {
                        selectOptions.on("mouseleave", function() {
                            hideOption();
                        });
                    } else if (opt.act == 'click') {
                        //清除mouseleave关闭事件
                        selectOptions.unbind('mouseleave');
                    }
                    $(document).mouseup(function(e) {
                        if (selectChoose.hasClass('on') && !selectChoose.is(e.target) && !selectChoose.has(e.target).length && !selectOptions.is(e.target) && !selectOptions.has(e.target).length) {
                            //console.log('失去焦点');
                            hideOption();
                        }
                    });
                })
                .insertAfter($this);
            //搜索
            if (opt.filterable) {
                selectChoose.children('input._txt')
                    .on('keydown', function(e) {
                        var keyMoveTarget = selectOptions.find('.hover').length ? selectOptions.find('.hover') : (selectOptions.find('._selected').length ? selectOptions.find('._selected') : selectOptions.find('li').eq(0));

                        switch (e.keyCode) {
                            case 38:
                                //up
                                e.preventDefault();
                                if (keyMoveTarget.prev('li').length) {
                                    keyMoveTarget.removeClass('hover').prev('li').addClass('hover');
                                    if(selectOptions.data('cellheight') * (keyMoveTarget.index() - 1) < selectOptions.scrollTop()){
                                        selectOptions.scrollTop(selectOptions.data('cellheight') * (keyMoveTarget.index() - 1));
                                    }
                                } else {
                                    keyMoveTarget.addClass('hover');
                                }
                                break;
                            case 40:
                                //down
                                e.preventDefault();
                                if (keyMoveTarget.next('li').length) {
                                    keyMoveTarget.removeClass('hover').next('li').addClass('hover');
                                    if(selectOptions.data('cellheight') * (keyMoveTarget.index() + 2) > selectOptions.scrollTop() + parseInt(selectOptions.height())){
                                        //console.log('down scroll');
                                        selectOptions.scrollTop(selectOptions.data('cellheight') * (keyMoveTarget.index()+2) - parseInt(selectOptions.height()));
                                    }
                                } else {
                                    keyMoveTarget.addClass('hover');
                                }
                                break;
                            case 13:
                                //enter
                                e.preventDefault();
                                if (selectOptions.find('.hover').length) {
                                    selectOptions.find('.hover').trigger('click');
                                } else {
                                    selectOptions.find('._selected').trigger('click');
                                }
                                break;
                            default:
                                
                        }
                    }).on('keyup', function(e) {
                        if(e.keyCode!==38 && e.keyCode!==40 && e.keyCode!==13){
                            e.preventDefault();
                            selectData = $this.data('data');
                            var filterKey = $.trim($(this).val());
                            if (filterKey) {
                                if ($this.data('lastval') !== filterKey) {
                                    console.log('触发搜索',$this.data('lastval'));
                                    var _sort = 0,
                                        _filterData = [];
                                    for (; _sort < selectData.length; _sort++) {
                                        if (selectData[_sort].option.indexOf(filterKey) > -1) {
                                            _filterData.push(selectData[_sort]);
                                        }
                                    }
                                    if (_filterData.length) {
                                        createDom($this, _filterData, opt, true);
                                    }
                                }
                            } else {
                                createDom($this, selectData, opt, true);
                            }
                        }
                    });
            }
        }
        //初始化
        init(selectData);
        return {
            update: init
        };
    };
});
