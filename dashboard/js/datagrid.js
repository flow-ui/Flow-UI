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


	var Table = require('table');
	var demoData = [{
		key1: "data1",
		key2: "data2",
		key3: "data3"
	}, {
		key1: "data1",
		key2: "data2",
		key3: "data3"
	}, {
		key1: "data1",
		key2: "data2",
		key3: "data3"
	}, {
		key1: "data1",
		key2: "data2",
		key3: "data3"
	}];
	var demoColumn = [{
		title: "第一列",
		key: 'key1'
	}, {
		title: "第二列",
		key: 'key2'
	}, {
		title: "第三列",
		key: 'key3'
	}];

	Table({
		el: '.grid1',
		data: demoData,
		column: demoColumn
	});

	demoColumn[0].width = 100;
	Table({
		el: '.grid2',
		data: demoData,
		column: demoColumn,
		bordered: true
	});

	Table({
		el: '.grid3',
		data: demoData,
		column: demoColumn,
		bordered: true,
		multi: true,
		index: true
	});

	demoColumn = demoColumn.concat([
		{
			title: "第四列",
			key: 'key4'
		}, {
			title: "第五列",
			key: 'key5'
		}, {
			title: "第六列",
			key: 'key6'
		}
	]);
	$.each(demoColumn, function(i, e){
		e.width = 150;
	});

	Table({
		el: '.grid4',
		data: demoData,
		column: demoColumn,
		bordered: true
	});

	Table({
		el: '.grid5',
		data: demoData,
		column: demoColumn,
		bordered: true,
		multi: true,
		index: 'fixed'
	});

});