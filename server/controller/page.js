/*
 * page controller
 * @author 
 * Auto build by NEI Builder
 */

'use strict';

let BaseController = require('./base');

class PageController extends BaseController {
    index(req, res, next) {
        res.render('index', {
            title: 'NEJ-Todo',
            description: ''
        });
    }
    regular(req, res, next) {
        res.render('regular', {
            title: 'Regular-Todo',
            description: ''
        });
    }
}

module.exports = new PageController;