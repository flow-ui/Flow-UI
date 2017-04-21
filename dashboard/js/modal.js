/**
 * blank
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');
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
	if (cur) {
		mymenu.active(cur);
	}


	var Box = require('box');

	$('.boxDom').on('click', function() {
		Box.open($('.demo'));
	});

	$('.boxAlert').on('click', function() {
		Box.alert('hello box!', function() {
			alert('alert的回调');
		});
	});

	$('.boxMsg').on('click', function() {
		Box.msg('注意，这是一条测试信息！', {
			delay: 3000
		});
	});

	$('.boxConfirm').on('click', function() {
		Box.confirm('hello box!', function() {
			alert('确定回调');
		}, function() {
			alert('取消回调');
		});
	});

	$('.boxAjax').on('click', function() {
		Box.ajax(seajs.root + '/test/ajax.php', {
			param: "param1" //Ajax参数
		});
	});

	$('.boxIfram').on('click', function() {
		var myifr = Box.ifram('/test/iframCloseTest.html', {
			name: "closeTestIfram", //ifram name，默认空（不是弹窗标题）
			width: 320, //iframe宽，默认640
			height: 240 //iframe高，默认480
		});
	});

	$('.modal').on('click', function() {
		Box.open('<i class="ion rotation"></i>', {
			layout: false,
			bgclose: false,
			delay: 3e3
		});
	});

	$('.extclass').on('click', function() {
		Box.open('通过附加自定义class修改了弹窗样式', {
			hook: "text-success"
		});
	});

	$('.boximg').on('click', function() {
		var imgBox = Box.img('http://7xnt8z.com1.z0.glb.clouddn.com/view0.jpg', {
			onshow: function($this) {
				$this.on('click', function() {
					Box.hide(imgBox);
				});
			}
		});
	});


});