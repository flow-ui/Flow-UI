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


	require('collapse');
	var tabDatas = [{
		title: 'tab1',
		cont: 'tab1 cont'
	}, {
		title: 'tab2',
		cont: 'tab2 cont'
	}, {
		title: 'tab3',
		cont: 'tab3 cont'
	}];
	var colors = ['primary', 'success', 'info', 'warning', 'danger'];
	$('.demo').collapse();
	$('.demo2').collapse({
		data: tabDatas
	});
	$('.demo3').collapse({
		data: tabDatas,
		single: false
	});
	$.each(tabDatas, function(i, e){
		tabDatas[i].color = colors[i];
	});
	$('.demo4').collapse({
		data: tabDatas
	});


});