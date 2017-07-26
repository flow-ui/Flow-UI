/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');
	//
	
	var color = ['primary', 'auxiliary', 'info', 'success', 'warning', 'danger'];
	require('switch');

	$('.switch-default').each(function(i, e) {
		$(e).switcher({
			color: color[i],
			value: true
		});
	});

	$('.switch-radius').each(function(i, e) {
		$(e).switcher({
			color: color[i],
			round: true,
			value: true
		});
	});

	$('.switch-lg').switcher({
		color: color[0],
		size: 'lg',
		value: true
	});
	$('.switch-normal').switcher({
		color: color[0],
		value: true
	});
	$('.switch-sm').switcher({
		color: color[0],
		size: 'sm',
		value: true
	});
	$('.switch-round-lg').switcher({
		color: color[0],
		size: 'lg',
		value: true,
		round: true
	});
	$('.switch-round-normal').switcher({
		color: color[0],
		value: true,
		round: true
	});
	$('.switch-round-sm').switcher({
		color: color[0],
		size: 'sm',
		value: true,
		round: true
	});

});