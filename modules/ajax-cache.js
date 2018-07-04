/*
 * name: ajax-cache.js
 * version: v0.0.2
 * update: 快照相同时为数据扩种snapshootEqual=true
 * date: 2018-07-04
 */
define('ajax-cache', function(require, exports, module) {
	"use strict";
	var $ = require('jquery') || window.jQuery;

	function isEqual(o, x) {
		if (!o || !x) {
			return false;
		}
		var p;
		for (p in o) {
			if (typeof(x[p]) == 'undefined') {
				return false;
			}
		}
		for (p in o) {
			if (o[p]) {
				switch (typeof(o[p])) {
					case 'object':
						if (!isEqual(o[p], x[p])) {
							return false;
						}
						break;
					case 'function':
						if (typeof(x[p]) == 'undefined' ||
							(p != 'equals' && o[p].toString() != x[p].toString()))
							return false;
						break;
					default:
						if (o[p] != x[p]) {
							return false;
						}
				}
			} else {
				if (x[p])
					return false;
			}
		}
		for (p in x) {
			if (typeof(o[p]) == 'undefined') {
				return false;
			}
		}
		return true;
	};

	var ajaxLocalCacheQueue = {};

	$.ajaxSetup({
		beforeSend: function(xhr, setting) {
			if (window.localStorage && setting.localCache !== void(0)) {
				var cacheKey,
					cacheNameSep = ['|', '^', '@', '+', '$'],
					cacheNamePrefix = '_ajaxcache',
					cacheName,
					cacheDeadline,
					cacheVal;
				if (typeof setting.success !== 'function') {
					return console.warn('setting.success error!');
				}
				//获取url
				if (setting.type.toUpperCase() === 'POST') {
					cacheKey = setting.url + '?' + setting.data;
				} else {
					cacheKey = setting.url;
				}
				//请求队列
				if (ajaxLocalCacheQueue[cacheKey]) {
					ajaxLocalCacheQueue[cacheKey].push(setting.success);
					if (setting.localCache !== 'snapshoot') {
						xhr.ignoreError = true;
						return xhr.abort();
					}
				}
				//间隔符容错
				$.each(cacheNameSep, function(i, sep) {
					if (cacheKey.indexOf(sep) === -1) {
						cacheNameSep = sep;
						return false;
					}
				});
				if (!cacheNameSep.split) {
					return console.log('url(' + cacheKey + ')包含异常字符无法缓存');
				}
				//查找缓存
				$.each(localStorage, function(key, val) {
					if (key.indexOf([cacheNamePrefix, cacheKey].join(cacheNameSep)+cacheNameSep) === 0) {
						cacheName = key;
						cacheDeadline = key.split(cacheNameSep)[2];
						cacheVal = val;
						return false;
					}
				});
				if (cacheVal && setting.dataType === 'json') {
					cacheVal = $.parseJSON(cacheVal);
				}
				if (setting.localCache && (setting.localCache === 'snapshoot' || !isNaN(setting.localCache))) {
					var nowDate = new Date().getTime();
					if (cacheDeadline && (cacheDeadline > nowDate)) {
						//console.log('使用缓存 '+cacheDeadline+'>'+nowDate);
						setting.success(cacheVal);
						return false;
					} else {
						if (cacheDeadline && cacheDeadline <= nowDate) {
							//console.log('缓存过期');
							localStorage.removeItem(cacheName);
						}
						//使用快照
						if (cacheDeadline === 'snapshoot') {
							var snapshootData = cacheVal;
							if ($.isPlainObject(cacheVal)) {
								snapshootData = $.extend(true, {}, cacheVal, {
									snapshoot: true
								});
							}
							setting.success(snapshootData);
						}
						//console.log('建立缓存');
						ajaxLocalCacheQueue[cacheKey] = [setting.success];
						setting.success = function(res) {
							//数据校验
							if (setting.localCache === 'snapshoot' && isEqual(res, cacheVal)) {
								res.snapshootEqual = true;
							}
							var newDeadline = setting.localCache === 'snapshoot' ? 'snapshoot' : (new Date().getTime() + setting.localCache),
								newCacheName = [cacheNamePrefix, cacheKey, newDeadline].join(cacheNameSep);
							$.each(ajaxLocalCacheQueue[cacheKey], function(i, cb) {
								typeof cb === 'function' && cb(res);
							});
							delete ajaxLocalCacheQueue[cacheKey];
							//缓存数据
							if ($.isPlainObject(res) || $.isArray(res)) {
								if (window.JSON) {
									res = JSON.stringify(res);
								}
							}
							localStorage.setItem(newCacheName, res);
							newDeadline = null;
							newCacheName = null;
						};
					}
					nowDate = null;
				} else if (cacheName) {
					//清除缓存
					localStorage.removeItem(cacheName);
					console.log('缓存数据[' + cacheName + ']已清除');
				}
			}
		}
	});
});