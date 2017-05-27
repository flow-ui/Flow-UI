/*
 * name: store.js
 * version: v0.0.1
 * update: build
 * date: 2017-05-27
 */
define('store', function(require, exports, module) {
	"use strict";
	seajs.importStyle(' ', module.uri);
	var $ = require('jquery'),
		base = require('base'),
		def = {
			state: {},
			queue: {},
			type: 'get',
			url: '',
			dataType: 'json',
			data: {}
		},
		Store = function() {
			this.state = def.state;
			this.queue = def.queue;
		};
	base.ajaxSetup($);

	Store.prototype.clear = function(key) {
		if (key === void 0) {
			this.state = def.state = {};
			this.queue = def.queue = {};
		} else if (key.split) {
			delete this.state[key];
			delete this.queue[key];
		}
	};
	Store.prototype.init = function(config) {
		if ($.isPlainObject(config)) {
			$.extend(def, config);
		}
	};
	Store.prototype.add = function(config) {
		if ($.isPlainObject(config)) {
			if (config.key && config.key.split) {
				if (!config.type || !config.type.split) {
					config.type = def.type;
				}
				if (!config.dataType || !config.dataType.split) {
					config.dataType = def.dataType;
				}
				if (!config.url || !config.url.split) {
					config.url = def.url;
				}
				config.data = $.extend({}, def.data, config.data || {});
				if (config.url) {
					this.queue[config.key] = config;
				} else {
					console.warn('add(): url未定义');
				}
			} else {
				console.warn('add(): key未定义');
			}
		}
	};
	Store.prototype.update = function(keyArray, callback) {
		var that = this,
			queueLength = 0,
			got = 0,
			oneDone = function() {
				got++;
				if (got >= queueLength) {
					typeof callback === 'function' && callback(that.state);
				}
			};
		if (typeof keyArray === 'function') {
			callback = keyArray;
			keyArray = null;
		}

		if ($.isArray(keyArray)) {
			queueLength = keyArray.length;
			if (!queueLength) {
				return oneDone();
			}

			$.each(keyArray, function(i, key) {
				if ($.isPlainObject(that.queue[key])) {

					$.ajax(that.queue[key]).done(function(res) {
						that.state[key] = res;
						oneDone();
					}).fail(function(jqXHR, textStatus) {
						console.warn("store.js: " + textStatus);
						oneDone();
					});
				}
			});
		} else {
			$.each(that.queue, function() {
				queueLength++;
			});
			if (!queueLength) {
				return oneDone();
			}
			$.each(that.queue, function(key, q) {
				$.ajax(q).done(function(res) {
					that.state[key] = res;
					oneDone();
				}).fail(function(jqXHR, textStatus) {
					console.warn("store.js: " + textStatus);
					oneDone();
				});
			});
		}
	};
	Store.prototype.ready = function(keyArray, callback) {
		var that = this,
			queueLength = 0,
			got = 0,
			oneDone = function() {
				got++;
				if (got >= queueLength) {
					callback(that.state);
				}
			};
		if (typeof keyArray === 'function') {
			callback = keyArray;
			keyArray = null;
		}
		if (typeof callback === 'function') {
			if ($.isArray(keyArray)) {
				queueLength = keyArray.length;
				if (!queueLength) {
					return oneDone();
				}
				$.each(keyArray, function(i, key) {
					if ($.isPlainObject(that.queue[key])) {
						if (that.state[key]) {
							oneDone();
						} else {
							that.update([key], oneDone);
						}
					}
				});
			} else {
				$.each(that.queue, function() {
					queueLength++;
				});
				if (!queueLength) {
					return oneDone();
				}
				$.each(that.queue, function(key, q) {
					if (that.state[q.key]) {
						oneDone();
					} else {
						that.update([q.key], oneDone);
					}
				});
			}

		}
	};

	module.exports = new Store;

});