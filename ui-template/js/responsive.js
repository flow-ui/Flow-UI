/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');
	//
	com.getOrient(function(orient) {
		$('#fangxiang').val(orient);
	});

	com.getType(function(type) {
		$('#mark').val(type);
	});

});