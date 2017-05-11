/*
 * name: checks.js
 * version: v0.0.1
 * update: build
 * date: 2017-12-28
 */
define('checks', function(require, exports, module) {
    "use strict";
    var $ = window.$ || require('jquery'),
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
                        opt.onChange(opt.type === 'checkbox' ? opt.checked : opt.checked[0]);
                    }
                }
            }
        },
        Checks = function(config) {
            var opt = $.extend({}, def, config || {}),
                $this = $(opt.el).eq(0);
            if (!$this.length || $this.data('checks-opt')) {
                return null;
            }
            if (opt.type !== 'checkbox') {
                opt.type = 'radio';
            }
            if ($.isArray(opt.data)) {
                if (!$.isArray(opt.checked)) {
                    opt.checked = [];
                }
                if (!$.isArray(opt.disabled)) {
                    opt.disabled = [];
                }
                extendStatus(opt.data, {
                    checked: opt.checked,
                    disabled: opt.disabled
                });
            } else {
                opt.data = [];
                opt.checked = [];
                opt.disabled = [];
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
                    opt.data.push({
                        value: _val,
                        name: _name,
                        label: _label,
                        checked: _checked,
                        disabled: _disabled
                    });
                    if (_checked) {
                        opt.checked.push(_val);
                    }
                    if (_disabled) {
                        opt.disabled.push(_disabled);
                    }
                });
            }
            //统一处理
            $.each(opt.data, function(i, e) {
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
                        $.each(opt.checked, function(i, chk) {
                            if (chk === _val) {
                                isIn = true;
                                return false;
                            }
                        });
                        if (!isIn) {
                            opt.checked.push(_val);
                        }
                    } else {
                        opt.checked = [_val];
                    }
                } else {
                    $.each(opt.checked, function(i, chk) {
                        if (chk === _val) {
                            opt.checked.splice(i, 1);
                            return false;
                        }
                    });
                }
                render($this, opt.data, {
                    checked: opt.checked
                }, 'fromControl');

            }).data('checks-opt', opt);

            //init
            render($this, opt.data);
            if (typeof opt.onReady === 'function') {
                opt.onReady(opt.type === 'checkbox' ? opt.checked : opt.checked[0]);
            }

            return {
                checked: function(value) {
                    if (value === void(0)) {
                        return opt.type === 'checkbox' ? opt.checked : opt.checked[0];
                    } else {
                        if (opt.type === 'checkbox' && $.isArray(value)) {
                            opt.checked = value;
                        } else if (opt.type === 'radio') {
                            if (!value) {
                                opt.checked = [];
                            } else {
                                opt.checked = [value];
                            }
                        }
                        render($this, opt.data, {
                            checked: opt.checked
                        });
                    }
                },
                disabled: function(value) {
                    if (value === void(0)) {
                        return opt.disabled;
                    } else if ($.isArray(value)) {
                        opt.disabled = value;
                        render($this, opt.data, {
                            disabled: opt.disabled
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