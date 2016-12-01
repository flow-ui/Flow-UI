/**
 * index
 */
define(function(require) {
	var $ = require('jquery');
	var base = require('base');
	var com = require('./common_pjax');
	return function(){
		com.init();
		//my js
		require('box');
		$.box.msg('hello p2!',{
			color:'info'
		})



	}

})