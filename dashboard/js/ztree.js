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

	require('zTree');
	var zNodes = [{
		name: "test1",
		open: true,
		children: [{
			name: "test1_1"
		}, {
			name: "test1_2"
		}]
	}, {
		name: "test2",
		open: true,
		children: [{
			name: "test2_1"
		}, {
			name: "test2_2"
		}]
	}];

	$.fn.zTree.init($("#tree1"), {}, zNodes);

	$.fn.zTree.init($("#tree2"), {
		check:{
			enable: true
		}
	}, zNodes);

	$.fn.zTree.init($("#tree3"), {
		view:{
			showIcon: false,
			showLine: false
		}
	}, zNodes);

	$.fn.zTree.init($("#tree4"), {
		check:{
			enable: true,
			chkStyle: 'radio'
		}
	}, zNodes);

});