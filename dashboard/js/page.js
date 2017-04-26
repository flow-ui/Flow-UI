/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');
	//
	

	require('page');
	$('.page2').page({
		current: 1,
		showNum: 5,
		total: 10,
		onChange: function(page) {
			console.log(page);
		}
	});

	$('.page3').page({
		total: 10,
		size: 'sm'
	});
	$('.page4').page({
		total: 10,
		size: 'lg'
	});


});