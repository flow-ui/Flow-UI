/*
 * name: appcan
 * version: 0.1.1
 * updata: run()方法支持popover
 * data: 2016-04-26
 */
define('appcan', function(require, exports, module) {
    "use strict";
    var $ = require('jquery');
    var isUexReady = false;
    var readyQueue = [];
    var execReadyQueue = function() {
        var i = 0, 
            len = readyQueue.length;
        for (; i < len; i++) {
            readyQueue[i]();
        };
        readyQueue.length = 0
    };
    //appcan ready
    var ready = function(callback) {
        callback = $.isFunction(callback) ? callback : function() {};
        readyQueue.push(callback);
        if (isUexReady) {
            return execReadyQueue();
        }
        if ("uexWindow" in window) {
            isUexReady = true;
            return execReadyQueue();
        } else {
            if (readyQueue.length > 1) {
                return null
            }
            if ($.isFunction(window.uexOnload)) {
                readyQueue.unshift(window.uexOnload)
            }
            window.uexOnload = function(type) {
                if (!type) {
                    isUexReady = true;
                    execReadyQueue()
                }
            }
        }
    };
    //app端执行代码
    var etpl = require('etpl');
    var run = function(winName, func, data) {
        var win,
            pop,
            func,
            code,
            render,
            result,
            data = data || {},
            etplEngine = new etpl.Engine();
        etplEngine.config({
            variableOpen: '/*',
            variableClose: '*/'
        });
        if ($.isFunction(func)) {
            if(winName.split){
                if(winName.indexOf(',')){
                    win = winName.split(',')[0];
                    pop = winName.split(',')[1];
                }else{
                    win = winName
                }
            }else{
                win = "";
            };
            func = func;
        } else if ($.isFunction(winName)) {
            win = "";
            func = winName;
        } else {
            return console.warn('run()参数不合法');
        };
        code = $.trim(func.toString()).replace(/^function \(\) {/, '').replace(/}$/, '').replace(/(^\s+)|(\s+$)/g, '');
        render = etplEngine.compile(code);
        result = render($.extend({
            href: window.location.href
        },data));
        ready(function() {
            if(pop){
                uexWindow.evaluatePopoverScript(win,pop,result)
            }else{
               uexWindow.evaluateScript(win, 0, result);
               uexWindow.evaluatePopoverScript('',win,result);
            }
        });
    };
    //回报页面信息
    run('shell', function() {
        catchUrl('/*href*/');
    });
    //页面卸载
    window.onbeforeunload = function(e) {
        run('shell', function() {
            stateChange();
        });
    };
    //页面完成
    $(document).ready(function() {
        run('shell', function() {
            loadDone();
        });
    });

    module.exports = {
        ready: ready,
        run: run
    };
});