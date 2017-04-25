/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');
	//
	var base = require('base');
	var mymenu = com.mymenu;
	var cur = parseInt(base.url.get('active'));
	if (cur) {
		mymenu.active(cur);
	}

	var color = ['primary', 'auxiliary', 'info', 'success', 'warning', 'danger'];
	require('switch');

	$('.switch-default').each(function(i, e) {
		$(e).switch({
			color: color[i],
			value: true
		});
	});

	$('.switch-radius').each(function(i, e) {
		$(e).switch({
			color: color[i],
			round: true,
			value: true
		});
	});

	$('.switch-lg').switch({
		color: color[0],
		size: 'lg',
		value: true
	});
	$('.switch-normal').switch({
		color: color[0],
		value: true
	});
	$('.switch-sm').switch({
		color: color[0],
		size: 'sm',
		value: true
	});
	$('.switch-round-lg').switch({
		color: color[0],
		size: 'lg',
		value: true,
		round: true
	});
	$('.switch-round-normal').switch({
		color: color[0],
		value: true,
		round: true
	});
	$('.switch-round-sm').switch({
		color: color[0],
		size: 'sm',
		value: true,
		round: true
	});

});