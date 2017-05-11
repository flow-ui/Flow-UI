/**
 * checks
 */
define(function(require) {
    var $ = require('jquery');
    var com = require('./common');
    //
    require('checks');
    var testdata = [{
        value: 'yingtao',
        label: '樱桃'
    }, {
        value: 'tianhua',
        label: '甜瓜'
    }, {
        value: 'caomei',
        label: '草莓'
    }];
    $('.radio-dom').checks({
        type: 'radio'
    });

    $('.radio-data').checks({
        type: 'radio',
        data: testdata,
        checked: ['yingtao'],
        disabled: ['caomei']
    });

    $('.checkbox-dom').checks();

    $('.checkbox-data').checks({
        data: testdata,
        checked: ['yingtao'],
        disabled: ['caomei']
    });

    $('.radio-block').checks({
    	type: 'radio',
    	mode: 'block',
    	data: testdata,
        checked: ['yingtao'],
        disabled: ['caomei']
    });

    $('.checkbox-block').checks({
    	mode: 'block',
    	data: testdata,
        checked: ['yingtao'],
        disabled: ['caomei']
    });

});
