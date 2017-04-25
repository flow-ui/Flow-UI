/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com=require('./common');
	//
	var base = require('base');
	var mymenu = com.mymenu;
	var cur = parseInt(base.url.get('active'));
	if(cur){
		mymenu.active(cur);
	}
	

	var Notice = require('notice');

    $('.notice-primary').on('click',function(){
        Notice({
            title: '这是标题' + parseInt(Math.random() * 1e6),
            desc: '这里是描述',
            color: 'primary',
            delay: 3000
        });
    });
    $('.notice-auxiliary').on('click',function(){
        Notice({
            title: '这是标题' + parseInt(Math.random() * 1e6),
            desc: '这里是描述',
            color: 'auxiliary',
            delay: 3000
        });
    });
    $('.notice-success').on('click',function(){
        Notice({
            title: '这是标题' + parseInt(Math.random() * 1e6),
            desc: '这里是描述',
            color: 'success',
            delay: 3000
        });
    });
    $('.notice-info').on('click',function(){
        Notice({
            title: '这是标题' + parseInt(Math.random() * 1e6),
            desc: '这里是描述',
            color: 'info',
            delay: 3000
        });
    });
    $('.notice-warning').on('click',function(){
        Notice({
            title: '这是标题' + parseInt(Math.random() * 1e6),
            desc: '这里是描述',
            color: 'warning',
            delay: 3000
        });
    });
    $('.notice-danger').on('click',function(){
        Notice({
            title: '这是标题' + parseInt(Math.random() * 1e6),
            desc: '这里是描述',
            color: 'danger',
            delay: 3000
        });
    });

	
});