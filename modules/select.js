/*
 * name: select.js
 * version: v4.3.2
 * update: 引入全局层级管理
 * date: 2017-03-30
 */
define('select', function(require, exports, module) {
    "use strict";
    var animationDuration = 350;
    seajs.importStyle('.select-ui-choose{position:relative;display:inline-block;overflow:hidden;-webkit-user-select:none;user-select:none;vertical-align:middle;}\
        .select-ui-choose.disabled, .select-ui-choose.disabled ._txt .label{cursor:not-allowed;}\
        .select-ui-choose.readonly, .select-ui-choose.readonly ._txt .label{cursor:default;}\
        .select-ui-choose ._txt{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 20px 0 8px;border:0;height:100%;line-height:inherit}\
        .select-ui-choose ._txt .label{cursor:pointer}\
        .select-ui-choose ._txt ._close{font-size:1.2em;display:inline-block;margin-left:.5em;vertical-align:middle}\
        .select-ui-choose ._arrow{position:absolute;top:0;right:.5em;height:100%}.select-ui-choose ._arrow .arr{position:absolute;top:50%;left:0}\
        .select-ui-choose ._arrow{width:1em}\
        .select-ui-choose ._arrow .arr{transition:transform ease ' + animationDuration + 'ms;transform-origin:50% 25%;margin:-.2em 0 0;border:.4em solid;border-color:#333 transparent transparent}\
        .select-ui-choose.on ._arrow .arr{transform:rotateZ(180deg);margin-top:-.5em\9;border-color:transparent transparent #333\9}\
        .select-ui-choose-top.on{border-radius:0 0 4px 4px}\
        .select-ui-choose-bottom.on{border-radius:4px 4px 0 0}\
        .select-ui-options{transition:transform ease ' + animationDuration + 'ms;transform-origin:50% 0%;transform:rotateX(90deg);}\
        .select-ui-options{position:absolute;z-index:101;font-size:.9em;top:-999em;opacity:.5;white-space:nowrap;overflow:auto;max-height:12em;border:1px solid #e8e9eb;background:#fff}\
        .select-ui-cascader ul{display:inline-block;vertical-align:top; min-width:100px;height:12em;overflow:auto; border-left:1px solid #e3e8ee;margin:0 0 0 -1px;}\
        .select-ui-options.on{transform:rotateX(0deg);opacity:1}\
        .select-ui-options li{position:relative;line-height:1.8em;padding:.4em 1em;cursor:pointer}\
        .select-ui-options li._disabled{cursor:default}\
        .select-ui-options li._disabled{color:#aaa}\
        .select-ui-options li._selected{background:#eee}\
        .select-ui-options li:hover, .select-ui-options li.hover{color:#fff;background:#7b7bff}\
        .select-ui-options li._disabled:hover{color:#aaa;background:inherit}\
        .select-ui-options li._selected:hover{color:inherit;background:#eee}\
        .select-ui-options li._hasChildren:before,.select-ui-options li._hasChildren:after{content:"";position:absolute;width:0;height:0;border:6px solid;top:50%;margin-top:-6px;}\
        .select-ui-options li._hasChildren:before{right:6px;border-color:transparent transparent transparent #aaa;}\
        .select-ui-options li._hasChildren:after{right:7px;border-color:transparent transparent transparent #fff;}\
        .select-ui-options li:hover:after{border-left-color:#7b7bff;}\
        .select-ui-options li._selected:after{border-left-color:#eee;}\
        .select-ui-options-top{border-bottom:0;border-radius:4px 4px 0 0}\
        .select-ui-options-bottom{border-top:0;border-radius:0 0 4px 4px}\
        .select-ui-options-top.select-ui-cascader{border-bottom:1px solid #e3e8ee;margin-bottom:-1px;}\
        .select-ui-options-bottom.select-ui-cascader{border-top:1px solid #e3e8ee;margin-top:-1px;}', module.uri);
    var $ = require('jquery'),
        base = require('base'),
        def = {
            data: null,
            val: null,
            act: "click", // click | mouseenter
            posi: "bottom", // bottom | top | auto
            hideDisabled: true, // 不显示不可用项
            hideSelected: false, // 不显示已选中项
            hook: '', // 自定义样式钩子
            name: null,
            disabled: false,
            readonly: false,
            multi: false,
            filterable: false,
            onChange: null,
            format: function(textArray) {
                return textArray.join(' / ');
            }
        },
        multitext = function(dataOrigin) {
            var text = [],
                value = [];
            $.each(dataOrigin, function(i, e) {
                if (!e.disabled) {
                    text.push(e.text || e.option);
                    value.push(e.value);
                }
            });
            return {
                text: text.join(','),
                value: value.join(',')
            };
        },
        isCascader = function(selectData) {
            var hasChildren = false;
            $.each(selectData, function(i, e) {
                if ($.isArray(e.children) && e.children.length) {
                    hasChildren = true;
                    return false;
                }
            });
            return hasChildren;
        },
        clearStatus = function(data){
                    $.each(data, function(i,e){
                        delete e.selected;
                        if(e.children){
                            clearStatus(e.children);
                        }
                    });
                },
        render = function(renderData, opt, selectedCB, path) {
            var _options = '',
                _doms = '',
                _path = '',
                selectedChildren,
                each = function(data){
                    var key = 0,
                        _lis = '',
                        thisTurnPath = _path;
                    selectedChildren = null;
                    for (; key < data.length; key++) {
                        var value = data[key].value ? data[key].value : key;
                        var text = data[key].option;
                        var checkDefault = !!data[key].checkDefault;
                        var selected = data[key].selected;
                        var disabled = data[key].disabled;
                        var hasChildren = $.isArray(data[key].children) && data[key].children.length;
                        if(!hasChildren){
                            //原生结构
                            _options += '<option' + (disabled ? ' disabled' : '') +
                                (selected ? ' selected' : '') + ' value="' + value + '">' + text + '</option>';
                        }
                        //模拟结构
                        if (!(selected && opt && opt.hideSelected) && !(disabled && opt && opt.hideDisabled)) {
                            _lis += ('<li class="' + (disabled ? '_disabled' : '') + (selected ? ' _selected' : '') + (hasChildren ? ' _hasChildren' : '') + '" data-val="' + value + '"' + (hasChildren || thisTurnPath ? ' data-path="' + (thisTurnPath || '') + key + '"' : '') + '>' + text + '</li>');
                        }
                        if(selected && hasChildren){
                            selectedChildren = data[key].children;
                            _path += (key + '/');
                        }
                        if (selected && typeof selectedCB === 'function') {
                            selectedCB({
                                text: text,
                                value: value,
                                disabled: disabled
                            });
                        }
                    }
                    if(!_lis){
                        _lis = '<li class="_disabled">暂无数据</li>';
                    }
                    _doms += ('<ul>' + _lis + '</ul>');
                    if(selectedChildren){
                        each(selectedChildren);
                    }
                };
            each(renderData);
            return {
                options: _options,
                doms: _doms
            };
        },
        createDom = function($this, sortData, formUpdate, noTriggerChange) {
            var renderResult,
                isSort = !!sortData,
                initSelsectd,
                selectData = $.isArray(sortData) ? sortData : $this.data('data'),
                opt = $this.data('opt'),
                hasChildren = isCascader(selectData),
                iscascader = $this.data('iscascader');
            renderResult = render(selectData, opt, function(selectItem) {
                if (opt.multi || hasChildren) {
                    if (!$.isArray(initSelsectd)) {
                        initSelsectd = [];
                    }
                    initSelsectd.push(selectItem);
                } else {
                    initSelsectd = selectItem;
                }
            });
            
            //未定义selected默认第一项
            if (!initSelsectd) {
                if (opt.multi || hasChildren) {
                    initSelsectd = [{
                        text: selectData[0].option,
                        value: selectData[0].value,
                        disabled: selectData[0].disabled
                    }];
                } else {
                    initSelsectd = {
                        text: selectData[0].option,
                        value: selectData[0].value,
                        disabled: selectData[0].disabled
                    };
                }
            }
            //初始化数据
            var lastvalue = $this.data('lastvalue'),
                nowvalue,
                nowtext;
            if (hasChildren) {
                nowvalue = multitext(initSelsectd).value;
                nowtext = multitext(initSelsectd).text;
                $this.next('.select-ui-choose').find('span._txt').html(opt.format(nowtext.split(',')));
            } else if (opt.multi) {
                nowvalue = multitext(initSelsectd).value;
                nowtext = multitext(initSelsectd).text;
                $this.next('.select-ui-choose').find('span._txt').html(multiValRender(initSelsectd));
                $this.data('multitarget').val(nowvalue);
            } else {
                nowvalue = initSelsectd.value;
                nowtext = initSelsectd.text;
                if (opt.filterable && !isSort) {
                    $this.next('.select-ui-choose').find('input._txt').val(initSelsectd.text);
                } else {
                    $this.next('.select-ui-choose').find('span._txt').text(initSelsectd.text);
                }
            }
            $this.data('lastvalue', nowvalue).data('lasttext', nowtext).data('filterchange', isSort).html(renderResult.options);
            if (!formUpdate) {
                selectOptions.html(renderResult.doms).data('cellheight', parseInt(selectOptions.find('li').outerHeight()));
            }
            //change事件
            if ((!hasChildren || (hasChildren && iscascader)) && !noTriggerChange && (lastvalue !== nowvalue) && (typeof opt.onChange === 'function')) {
                opt.onChange(nowvalue, nowtext);
            }
        },
        hideOption = function() {
            var _thisChoose = selectOptions.data('choosetarget'),
                _thisSelect = _thisChoose.prev('select');
            _thisChoose.removeClass('on').find('input._txt').blur().val(_thisSelect.data('lasttext'));
            selectOptions.removeClass('on').css('top', '-999em').find('li.hover').removeClass('hover');
        },
        multiValRender = function(array) {
            var html = '';
            $.each(array, function(i, e) {
                if (!e.disabled) {
                    html += ('<span class="label label-sm" data-val="' + e.value + '">' + e.text + '<i class="_close">×</i></span>');
                }
            });
            if (!html) {
                html = array[0].text;
            }
            return html;
        },
        chooseHookTop = 'select-ui-choose-top',
        chooseHookBottom = 'select-ui-choose-bottom',
        selectOptions = $('.select-ui-options');
    //selectOptions & event
    if (!selectOptions.length) {
        selectOptions = $('<div class="select-ui-options"><ul></ul></div>')
        .on('click', 'li', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).hasClass('_disabled')) {
                return null;
            }
            var _val = $.trim($(this).data('val')),
                _text = $(this).text(),
                _thisSelect = selectOptions.data('choosetarget'),
                _thisOriginSelect = _thisSelect.prev('select'),
                _data = _thisOriginSelect.data('data'),
                _opt = _thisOriginSelect.data('opt'),
                dataPath = $(this).data('path'),
                cascader;
            if (dataPath!==void(0)) {
                //级联
                var children = _data;
                cascader = !$(this).hasClass('_hasChildren');
                clearStatus(children);
                $.each(String(dataPath).split('/'), function(pathIndex, path) {
                    $.each(children, function(childIndex, child){
                        if(childIndex === parseInt(path)){
                            child.selected = true;
                        }
                    });
                    children = children[path].children;
                });
            } else if (_opt.multi) {
                //多选
                var isRepeat,
                    multival = [];
                if (_thisOriginSelect.data('multitarget').val()) {
                    multival = _thisOriginSelect.data('multitarget').val().split(',');
                }
                $.each(multival, function(i, e) {
                    if (e === _val) {
                        isRepeat = true;
                        $.each(_data, function(i, d) {
                            if (d.value === _val) {
                                d.selected = false;
                                return false;
                            }
                        });
                        return false;
                    }
                });
                if (!isRepeat) {
                    $.each(_data, function(i, d) {
                        if (d.value === _val) {
                            d.selected = true;
                            return false;
                        }
                    });
                }
                multival = null;
                _val = multitext(_data).value;
                _text = multitext(_data).text;
            } else {
                //单选
                var _key = 0;
                for (; _key < _data.length; _key++) {
                    if ($.trim(_data[_key].value) === _val) {
                        _data[_key].selected = true;
                    } else if (_data[_key].selected) {
                        _data[_key].selected = false;
                    }
                }
            }
            //重新生成DOM
            createDom(_thisOriginSelect.data('data', _data).data('lasttext', _text).data('iscascader', cascader));
            if(dataPath===void(0) || (dataPath!==void(0) && cascader)){
                hideOption();
            }
        });
        $('body').append(selectOptions);
    }

    var Select = function(config) {
        var returnObject = {
            elements: [],
            update: function(data) {
                if (data.length) {
                    $.each(this.elements, function(i, e) {
                        if ($(e).prop('disabled') || $(e).prop('readonly')) {
                            return console.warn(e, '元素为只读或禁用状态！');
                        }
                        createDom($(e).data('data', data), false, true);
                    });
                } else {
                    return console.warn('select():update数据无效', data);
                }
            },
            disabled: function(flag) {
                $.each(this.elements, function(i, e) {
                    $(e).prop('disabled', !flag);
                    if (flag) {
                        $(e).next('.select-ui-choose').removeClass('disabled');
                    } else {
                        $(e).next('.select-ui-choose').addClass('disabled');
                    }
                });
            },
            readonly: function(flag) {
                $.each(this.elements, function(i, e) {
                    $(e).prop('readonly', !flag);
                    if (flag) {
                        $(e).next('.select-ui-choose').removeClass('readonly');
                    } else {
                        $(e).next('.select-ui-choose').addClass('readonly');
                    }
                });
            },
            destroy: function() {
                $.each(this.elements, function(i, e) {
                    $(e).data('multitarget').remove();
                    $(e).next('.select-ui-choose').remove().end().remove();
                });
                this.elements = [];
            },
            clear: function() {
                var obj = this;
                $.each(this.elements, function(i, e) {
                    if ($(e).prop('disabled') || $(e).prop('readonly')) {
                        return console.warn(e, '元素为只读或禁用状态！');
                    }
                    obj.val('', e);
                });
            },
            reset: function() {
                var obj = this;
                $.each(this.elements, function(i, e) {
                    if ($(e).prop('disabled') || $(e).prop('readonly')) {
                        return console.warn(e, '元素为只读或禁用状态！');
                    }
                    var opt = $(e).data('opt');
                    obj.val(opt.val, e);
                });
            },
            text: function(text) {
                if (text !== void(0)) {
                    text = $.trim(text);
                    $.each(this.elements, function(i, e) {
                        if ($(e).prop('disabled') || $(e).prop('readonly')) {
                            return console.warn(e, '元素为只读或禁用状态！');
                        }
                        $(e).next('.select-ui-choose').find('._txt').val(text).text(text);
                    });
                } else {
                    var data = this.elements[0].data('data'),
                        getText = [];
                    $.each(data, function(i, d) {
                        if (d.selected) {
                            getText.push(d.option);
                        }
                    });
                    return getText.join(',');
                }
            },
            val: function(value, target) {
                if (value !== void(0)) {
                    var setVal = function() {
                        var data = $(this).data('data'),
                            opt = $(this).data('opt');
                        if ($(this).prop('disabled') || $(this).prop('readonly')) {
                            return console.warn(this, '元素为只读或禁用状态！');
                        }
                        //抹掉原值
                        clearStatus(data);
                        //设置新值
                        if (opt.multi) {
                            value = value.split(',');
                            if (value.length) {
                                $.each(value, function(i, v) {
                                    $.each(data, function(i, d) {
                                        if (v === d.value) {
                                            d.selected = true;
                                        }
                                    });
                                });
                            }
                        } else if(isCascader(data)){
                            value = value.split(',');
                            if (value.length) {
                                var eachData = data,
                                    eachFunc = function(v){
                                        $.each(eachData, function(i, d) {
                                            if (v === d.value) {
                                                d.selected = true;
                                                eachData = d.children;
                                                return false;
                                            }
                                        });
                                    };
                                $.each(value, function(i, v) {
                                    eachFunc(v);
                                });
                            }
                        } else {
                            $.each(data, function(i, d) {
                                if (value === d.value) {
                                    d.selected = true;
                                }
                            });
                        }
                        return createDom($(this).data('data', data));
                    };
                    value = $.trim(value);
                    if (target) {
                        setVal.call(target);
                    } else {
                        $.each(this.elements, function(i, e) {
                            setVal.call(e);
                        });
                    }
                } else {
                    var ele = this.elements[0]; //只取第一个元素的值
                    return ele.data('multitarget') ? ele.data('multitarget').val() : ele.val();
                }
            }
        };
        if (!$(config.el).length) {
            return null;
        }
        $(config.el).each(function(i, e) {
            var $this = $(e),
                opt = $.extend({}, def, config || {}, $.isPlainObject($this.data('options')) ? $this.data('options') : {}),
                selectData = [],
                selectChoose;

            if ($this.data('select-init')) {
                return true;
            }
            if (typeof opt.format !== 'function') {
                opt.format = def.format;
            }
            if ($this.get(0).tagName.indexOf('ELE') === -1) {
                $this.html('<select style="display:none"></select>');
                $this = $this.children('select');
            } else {
                $this.hide();
            }
            if (!opt.name) {
                if ($this.attr('name')) {
                    opt.name = $this.attr('name');
                } else {
                    opt.name = 'select-' + base.getUUID();
                }
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
                        selected: !$(e).prop('disabled') && $(e).prop('selected')
                    });
                });
            }
            if (opt.val) {
                //设置初始值
                if (opt.multi) {
                    var usersetval = $.trim(opt.val).split(',');
                    if (usersetval.length) {
                        $.each(selectData, function(i, d) {
                            if (d.selected) {
                                d.selected = false;
                            }
                        });
                        $.each(usersetval, function(i, v) {
                            $.each(selectData, function(i, d) {
                                if (v === d.value) {
                                    d.selected = true;
                                }
                            });
                        });
                    }
                } else {
                    $.each(selectData, function(i, d) {
                        if ($.trim(opt.val) === d.value) {
                            d.selected = true;
                        } else {
                            d.selected = false;
                        }
                    });
                }
            } else {
                opt.val = [];
                $.each(selectData, function(i, d) {
                    if (d.selected) {
                        opt.val.push(d.value);
                    }
                });
                opt.val = opt.val.join(',');
            }
            if (opt.multi) {
                var multiTarget = $('<input type="hidden" name="' + opt.name + '" />');
                $this.removeAttr('name').after(multiTarget).data('multitarget', multiTarget);
                multiTarget = null;
            } else {
                $this.attr('name', opt.name);
            }
            $this.prop('readonly', opt.readonly).prop('disabled', opt.disabled).data('select-init', true).data('opt', opt);
            returnObject.elements.push($this);
            //selectChoose
            var chooseClass = ["select-ui-choose", "form-control"];
            var hasChildren = isCascader(selectData);

            if ($.trim(opt.hook)) {
                chooseClass.push($.trim(opt.hook));
            }
            if (opt.readonly) {
                chooseClass.push('readonly');
            }
            if (opt.disabled) {
                chooseClass.push('disabled');
            }
            selectChoose = $('<span class="' + chooseClass.join(" ") + '">' +
                    (opt.filterable && !hasChildren ? '<input type="text" class="_txt" />' : '<span class="_txt"></span>') +
                    '<span class="_arrow"><i class="arr"></i></span>' +
                    '</span>')
                .addClass($this.attr('class'))
                .insertAfter($this)
                .on(opt.act, function(e) {
                    e.stopPropagation();
                    var thischoose = $(this);
                    var selectChooseOS = thischoose.offset();
                    var selectOptionsCss = {
                        "left": selectChooseOS.left,
                        "width": "auto"
                    };
                    if ($this.prop('disabled') || $this.prop('readonly')) {
                        return null;
                    }
                    if (thischoose.hasClass('on')) {
                        return hideOption();
                    }
                    //多选点击取消
                    if (e.type === 'click' && ($(e.target).is('.label') || $(e.target).parents('.label').length)) {
                        var deleteval,
                            data = $this.data('data');
                        if ($(e.target).is('.label')) {
                            deleteval = $.trim($(e.target).data('val'));
                        } else {
                            deleteval = $(e.target).parents('.label').data('val');
                        }
                        $.each(data, function(i, d) {
                            if (d.value === $.trim(deleteval)) {
                                d.selected = false;
                                return false;
                            }
                        });
                        return createDom($this.data('data', data));
                    }
                    //展开selectOptions

                    if (!hasChildren) {
                        var selectChooseBorder = parseInt(thischoose.css('border-left-width')) + parseInt(thischoose.css('border-right-width'));
                        selectOptionsCss.width = thischoose.outerWidth() - selectChooseBorder;
                    }
                    thischoose.addClass('on').find('input._txt').focus();
                    if (!selectOptions.data('choosetarget') || !selectOptions.data('choosetarget').is(thischoose)) {
                        //刷新DOM
                        createDom($this);
                        if (opt.posi !== "top" && opt.posi !== "bottom") {
                            if ($(window).height() + $(window).scrollTop() - selectChooseOS.top - parseInt(thischoose.height()) < parseInt(selectOptions.height())) {
                                opt.posi = "top";
                            } else {
                                opt.posi = "bottom";
                            }
                            $this.data('opt', opt);
                        }
                        selectOptions.attr('class', 'select-ui-options select-ui-options-' + opt.posi + (hasChildren ? ' select-ui-cascader' : '') + (opt.hook && opt.hook.split ? ' ' + opt.hook : '')).css(selectOptionsCss);
                    } else if ($this.data('filterchange')) {
                        //搜索导致DOM变化
                        createDom($this);
                    }
                    if (opt.posi === "bottom") {
                        thischoose.removeClass(chooseHookTop)
                            .addClass(chooseHookBottom);
                        selectOptionsCss.top = selectChooseOS.top + thischoose.outerHeight();
                    } else {
                        thischoose.removeClass(chooseHookBottom)
                            .addClass(chooseHookTop);
                        selectOptionsCss.top = selectChooseOS.top - selectOptions.outerHeight();
                    }
                    selectOptions.data('choosetarget', thischoose).css({
                        "top": selectOptionsCss.top,
                        "z-index": base.getIndex()
                    });
                    setTimeout(function() {
                        selectOptions.addClass('on');
                    }, 0);
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
                });
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
                                    if (selectOptions.data('cellheight') * (keyMoveTarget.index() - 1) < selectOptions.scrollTop()) {
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
                                    if (selectOptions.data('cellheight') * (keyMoveTarget.index() + 2) > selectOptions.scrollTop() + parseInt(selectOptions.height())) {
                                        //console.log('down scroll');
                                        selectOptions.scrollTop(selectOptions.data('cellheight') * (keyMoveTarget.index() + 2) - parseInt(selectOptions.height()));
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
                        if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13) {
                            e.preventDefault();
                            selectData = $this.data('data');
                            var filterKey = $.trim($(this).val());
                            if (filterKey) {
                                if ($this.data('lasttext').indexOf(filterKey) === -1) {
                                    var _sort = 0,
                                        _filterData = [];
                                    for (; _sort < selectData.length; _sort++) {
                                        if (selectData[_sort].option.indexOf(filterKey) > -1) {
                                            _filterData.push(selectData[_sort]);
                                        }
                                    }
                                    if (_filterData.length) {
                                        createDom($this, _filterData);
                                    }
                                }
                            } else {
                                createDom($this, selectData);
                            }
                        }
                    });
            }
            //初始化
            createDom($this.data('data', selectData).data('data-back', selectData), false, false, true);
        });
        //返回对象
        return returnObject;
    };

    $.fn.select = function(config) {
        return Select($.extend(config, {
            el: $(this)
        }));
    };
    //自动初始化
    $('.flowui-select').select();

    module.exports = Select;
});