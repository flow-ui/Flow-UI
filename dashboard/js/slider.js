/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com=require('./common');
	//
	var base = require('base');
	var Menu = require('menu');
	var mymenu = Menu({
		el: '#g-menu',
		mode: 'vertical',
		onselect: function(key) {
			console.log(key);
		}
	});
	var cur = parseInt(base.url.get('active'));
	if(cur){
		mymenu.active(cur);
	}
	
	require('slider');
    $('.slider1').slider({
        value: 50
    });
    $('.slider2').slider({
        value: [10,50]
    });
    $('.slider3').slider({
        value: 50,
        tip: false
    });
    $('.slider4').slider({
        value: 50,
        tipRender: function(value){
        	return '进度：' + value + '%';
        }
    });
    $('.slider5').slider({
        value: 50,
        color: 'success'
    });
    $('.slider6').slider({
        value: 50,
        color: 'info'
    });
	
});