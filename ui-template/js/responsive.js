/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');
	var base = require('base');
	//
	base.getOrient(function(orient) {
		$('#fangxiang').val(orient);
	});

	base.getType(function(type) {
		$('#mark').val(type);
	});

});