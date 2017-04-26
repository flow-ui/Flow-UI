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
	var $main = $('#main');
	var $bread = $('#mybread');
	var Menu = require('menu');
	var mymenu = Menu({
		el: '#g-menu',
		mode: 'vertical',
		onSelect: function(key, $item) {
			if($item.find('a').length){
				window.location.href = $item.find('a').attr('href');
			}else if($item.data('page')){
				var loading = $main.empty().spin();
				$.ajax({
					url: $item.data('page') + '.html',
					dataType: 'html',
					success: function(res){
						//bread
						var menuMap = [], breadHtml;
						if($item.parents('.menu-submenu').length){
							menuMap.push('<a href="javascript:;" class="bread-link">'+$item.parents('.menu-submenu').find('.menu-item-title').html()+'</a>');
						}
						menuMap.push('<span class="bread-link">'+$item.html()+'</span>');
						breadHtml = $(menuMap.join('<span class="bread-sep">\/</span>'));
						breadHtml.find('.ion').remove();
						$bread.html(breadHtml);
						//page
						$main.html(res);
						require.async('./' + $item.data('page') + '.js?v=' + parseInt(Math.random() * 1e6) );
						loading && loading.hide();
					}
				});
			}
		}
	});
	$('#g-menu').find('li.menu-item').eq(0).trigger('click');

});