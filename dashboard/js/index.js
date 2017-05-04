/**
 * index
 */
define(function(require) {
	var $ = require('jquery');
	var com = require('./common');

	//header
	var Dropdown = require('dropdown');
	Dropdown({
		el: '#accountDropdown',
		items: [{
			item: '个人设置',
			data: 'demo1'
		}, {
			item: '数据统计',
			data: 'demo1'
		}, {
			item: '立即更新',
			data: 'demo1'
		}],
		onclick: function(item) {
			console.log(item);
		}
	});
	//menu
	require('spin');
	var routeTo = function(menuKey) {
		var loading = $main.empty().spin();
		var node = $('#g-menu').find('li.menu-item[data-menu-key="'+menuKey+'"]');
		if(!node.length){
			return console.warn('找不到data-menu-key:', menuKey);
		}
		var page = node.data('page');
		if (!page) return null;
		$.ajax({
			url: page + '.html',
			dataType: 'html',
			success: function(res) {
				if (window.sessionStorage) {
					window.sessionStorage.setItem('dashboard-route', menuKey);
				}
				var menuMap = [],
					breadHtml;
				if (node.parents('.menu-submenu').length) {
					menuMap.push('<a href="javascript:;" class="bread-link">' + node.parents('.menu-submenu').find('.menu-item-title').html() + '</a>');
				}
				menuMap.push('<span class="bread-link">' + node.html() + '</span>');
				breadHtml = $(menuMap.join('<span class="bread-sep">\/</span>'));
				breadHtml.find('.ion').remove();
				$bread.html(breadHtml);
				//page
				$main.html(res);
				require.async('./' + page + '.js?v=' + parseInt(Math.random() * 1e6));
				loading && loading.hide();
			}
		});
	};
	var $main = $('#main');
	var $bread = $('#mybread');
	var Menu = require('menu');
	var mymenu = Menu({
		el: '#g-menu',
		mode: 'vertical',
		onClick: function(key, $item, isCurrent) {
			//实现点击当前栏目重载
			mymenu.active($item.data('menu-key'));
		},
		onSelect: function(key, $item){
			if ($item.find('a').length) {
				window.location.href = $item.find('a').attr('href');
			} else if ($item.data('menu-key')) {
				routeTo($item.data('menu-key'));
			}
		}
	});
	if (window.sessionStorage && window.sessionStorage.getItem('dashboard-route')) {
		mymenu.active(parseInt(window.sessionStorage.getItem('dashboard-route')));
	} else {
		$('#g-menu').find('li.menu-item').eq(0).trigger('click');
	}


});