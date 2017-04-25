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


	var echarts = require('echarts');

	var myChart1 = echarts.init(document.getElementById('cahrt-1'));
	myChart1.setOption({
		color: ['#3398DB'],
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			axisTick: {
				alignWithLabel: true
			}
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '直接访问',
			type: 'bar',
			barWidth: '60%',
			data: [10, 52, 200, 334, 390, 330, 220]
		}]
	});

	var myChart2 = echarts.init(document.getElementById('cahrt-2'));
	myChart2.setOption({
		title: {
			text: '某站点用户访问来源',
			subtext: '纯属虚构',
			x: 'center'
		},
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
		},
		series: [{
			name: '访问来源',
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [{
				value: 335,
				name: '直接访问'
			}, {
				value: 310,
				name: '邮件营销'
			}, {
				value: 234,
				name: '联盟广告'
			}, {
				value: 135,
				name: '视频广告'
			}, {
				value: 1548,
				name: '搜索引擎'
			}],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	});

	var myChart3 = echarts.init(document.getElementById('cahrt-3'));
	myChart3.setOption({
		title: {
			text: '折线图堆叠'
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			name: '邮件营销',
			type: 'line',
			stack: '总量',
			data: [120, 132, 101, 134, 90, 230, 210]
		}, {
			name: '联盟广告',
			type: 'line',
			stack: '总量',
			data: [220, 182, 191, 234, 290, 330, 310]
		}, {
			name: '视频广告',
			type: 'line',
			stack: '总量',
			data: [150, 232, 201, 154, 190, 330, 410]
		}, {
			name: '直接访问',
			type: 'line',
			stack: '总量',
			data: [320, 332, 301, 334, 390, 330, 320]
		}, {
			name: '搜索引擎',
			type: 'line',
			stack: '总量',
			data: [820, 932, 901, 934, 1290, 1330, 1320]
		}]
	});

	var myChart4 = echarts.init(document.getElementById('cahrt-4'));
	myChart4.setOption({
		title: {
			text: '基础雷达图'
		},
		tooltip: {},
		legend: {
			data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
		},
		radar: {
			// shape: 'circle',
			indicator: [{
				name: '销售（sales）',
				max: 6500
			}, {
				name: '管理（Administration）',
				max: 16000
			}, {
				name: '信息技术（Information Techology）',
				max: 30000
			}, {
				name: '客服（Customer Support）',
				max: 38000
			}, {
				name: '研发（Development）',
				max: 52000
			}, {
				name: '市场（Marketing）',
				max: 25000
			}]
		},
		series: [{
			name: '预算 vs 开销（Budget vs spending）',
			type: 'radar',
			// areaStyle: {normal: {}},
			data: [{
				value: [4300, 10000, 28000, 35000, 50000, 19000],
				name: '预算分配（Allocated Budget）'
			}, {
				value: [5000, 14000, 28000, 31000, 42000, 21000],
				name: '实际开销（Actual Spending）'
			}]
		}]
	});

	var myChart5 = echarts.init(document.getElementById('cahrt-5'));
	myChart5.setOption({
		tooltip: {
			formatter: "{a} <br/>{b} : {c}%"
		},
		toolbox: {
			feature: {
				restore: {},
				saveAsImage: {}
			}
		},
		series: [{
			name: '业务指标',
			type: 'gauge',
			detail: {
				formatter: '{value}%'
			},
			data: [{
				value: 50,
				name: '完成率'
			}]
		}]
	});
	



});