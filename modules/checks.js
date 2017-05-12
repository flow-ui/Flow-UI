/*
 * name: checks.js
 * version: v0.0.2
 * update: bug fix
 * date: 2017-05-12
 */
define('checks', function(require, exports, module) {
    "use strict";
    var $ = window.$ || require('jquery'),
        base = require('base'),
        etpl = require('etpl'),
        etplEngine = new etpl.Engine(),
        compiler,
        def = {
            el: null,
            type: 'checkbox',
            name: null,
            data: null,
            checked: null,
            disabled: null,
            mode: 'inline', //inline | block
            onChange: null,
            onReady: null
        },
        template = '<!-- for: ${data} as ${chk} -->\
	<label class="${chk.type} runtime<!-- if: ${chk.mode} === "inline" --> ${chk.type}-inline<!-- /if --><!-- if: ${chk.disabled} --> disabled<!-- /if --><!-- if: ${chk.checked} --> checked<!-- /if -->"><input type="${chk.type}" value="${chk.value}" name="${chk.name}"<!-- if: ${chk.disabled} --> disabled<!-- /if --><!-- if: ${chk.checked} --> checked<!-- /if -->>${chk.label}</label>\
<!-- /for -->',
        extendStatus = function(data, status, fromControl) {
            //fromControl:来自用户操作，无需分析差异
            var isChange = !!fromControl;
            if ($.isPlainObject(status)) {
                $.each(data, function(oi, o) {
                    if ($.isArray(status.checked)) {
                        var checkChange;
                        if (o.checked === true) {
                            if(!status.checked.length){
                                isChange = true;
                            }else{
                                checkChange = true;
                            }
                        }
                        o.checked = false;
                        $.each(status.checked, function(ci, c) {
                            if (o.value === c) {
                                o.checked = true;
                                if (isChange !== true) {
                                    isChange = !checkChange;
                                }
                                return false;
                            }
                        });
                    }
                    if ($.isArray(status.disabled)) {
                        var disabledChange;
                        if (o.disabled === true) {
                            if(!status.disabled.length){
                                isChange = true;
                            }else{
                                disabledChange = true;
                            }
                        }
                        o.disabled = false;
                        $.each(status.disabled, function(di, d) {
                            if (o.value === d) {
                                o.disabled = true;
                                if (isChange !== true) {
                                    isChange = !disabledChange;
                                }
                                return false;
                            }
                        });
                    }
                });
            }else{
                //init
                return true;
            }
            return isChange;
        },
        render = function($this, data, status, fromControl) {
            if ($.isArray(data)) {
                var opt = $this.data('checks-opt');
                var isChange = extendStatus(data, status, fromControl);
                if(isChange){
                    var html = compiler({
                        data: data
                    });
                    $this.html(html);
                    if (typeof opt.onChange === 'function') {
                        opt.onChange(status && $.isArray(status.checked) ? (opt.type === 'checkbox' ? status.checked : status.checked[0]) : (opt.type === 'checkbox' ? [] : ''));
                    }
                }
            }
        },
        Checks = function(config) {
            var opt = $.extend({}, def, config || {}),
                $this = $(opt.el).eq(0),
                localData,
                localChecked,
                localDisabled;
            if (!$this.length || $this.data('checks-opt')) {
                return null;
            }
            if (opt.type !== 'checkbox') {
                opt.type = 'radio';
            }
            if($.isArray(opt.data)){
                localData = base.deepcopy(opt.data);
            }
            if($.isArray(opt.checked)){
                localChecked = base.deepcopy(opt.checked);
            }
            if($.isArray(opt.disabled)){
                localDisabled = base.deepcopy(opt.disabled);
            }
            if ($.isArray(localData)) {
                if (!$.isArray(localChecked)) {
                    localChecked = [];
                }
                if (!$.isArray(localDisabled)) {
                    localDisabled = [];
                }
                extendStatus(localData, {
                    checked: localChecked,
                    disabled: localDisabled
                });
            } else {
                localData = [];
                localChecked = [];
                localDisabled = [];
                //数据收集
                $this.find('input[type="' + opt.type + '"]').each(function(i, e) {
                    var _checked = $(e).prop('checked'),
                        _disabled = $(e).prop('disabled'),
                        _name = $(e).attr('name'),
                        _val = $(e).attr('value'),
                        _label = $(e).attr('label') || '';
                    if (!_val) {
                        _val = _label;
                    }
                    localData.push({
                        value: _val,
                        name: _name,
                        label: _label,
                        checked: _checked,
                        disabled: _disabled
                    });
                    if (_checked) {
                        localChecked.push(_val);
                    }
                    if (_disabled) {
                        localDisabled.push(_disabled);
                    }
                });
            }
            //统一处理
            $.each(localData, function(i, e) {
                e.type = opt.type;
                e.mode = opt.mode;
                if (opt.name && opt.name.split) {
                    e.name = opt.name;
                }
            });

            //绑定事件
            $this.on('change', 'input[type="' + opt.type + '"]', function() {
                var _val = $(this).val();
                if ($(this).prop('checked')) {
                    if (opt.type === 'checkbox') {
                        var isIn;
                        $.each(localChecked, function(i, chk) {
                            if (chk === _val) {
                                isIn = true;
                                return false;
                            }
                        });
                        if (!isIn) {
                            localChecked.push(_val);
                        }
                    } else {
                        localChecked = [_val];
                    }
                } else {
                    $.each(localChecked, function(i, chk) {
                        if (chk === _val) {
                            localChecked.splice(i, 1);
                            return false;
                        }
                    });
                }
                render($this, localData, {
                    checked: localChecked
                }, 'fromControl');

            }).data('checks-opt', opt);

            //init
            render($this, localData);
            if (typeof opt.onReady === 'function') {
                opt.onReady(opt.type === 'checkbox' ? localChecked : localChecked[0]);
            }

            return {
                checked: function(value) {
                    if (value === void(0)) {
                        return opt.type === 'checkbox' ? localChecked : localChecked[0];
                    } else {
                        if (opt.type === 'checkbox' && $.isArray(value)) {
                            localChecked = value;
                        } else if (opt.type === 'radio') {
                            if (!value) {
                                localChecked = [];
                            } else {
                                localChecked = [value];
                            }
                        }
                        render($this, localData, {
                            checked: localChecked
                        });
                    }
                },
                disabled: function(value) {
                    if (value === void(0)) {
                        return localDisabled;
                    } else if ($.isArray(value)) {
                        localDisabled = value;
                        render($this, localData, {
                            disabled: localDisabled
                        });
                    }
                }
            };
        };

    etplEngine.config({
        variableOpen: '${',
        variableClose: '}'
    });
    compiler = etplEngine.compile(template);

    $.fn.checks = function(config) {
        return Checks($.extend({
            el: this
        }, config || {}));
    };
    module.exports = Checks;
});