/*
 * todos controller
 * @author Chengzhenyu
 * Auto build by NEI Builder
 */

'use strict';

let BaseController = require('./base');
let db = require('../db/mysqlClient.js')();
let Promise = require('bluebird');
let _ = require('underscore');
let todoTable = db.TodoItem;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

class TodosController extends BaseController {
    /**
     * 获取整个todos列表
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async list(req, res, next) {
        let list = await todoTable.findAll({
            order: [
                ['updatedAt', 'DesC'], //降序
            ],
            logging: false,
        }).then((list) => {
            if (_.isArray(list)) {
                list.forEach(todo => {
                    todo = todo.get({
                        plain: true
                    });
                    if (todo.tag) {
                        todo.tag = todo.tag.split(':');
                        todo.tag.forEach((currentItem, index) => {
                            todo.tag[index] = {
                                id: index,
                                name: decodeURIComponent(currentItem)
                            };
                        });
                    } else {
                        todo.tag = [];
                    }
                });
            } else {
                list = [];
            }
            let resData = {
                code: 0,
                msg: '获取列表成功',
                result: list
            };
            res.status(200).send(resData);
        }).catch((err) => {
            let resData = {
                code: 1,
                msg: '获取列表失败,' + err,
                result: []
            };
            res.status(200).send(resData);
        });
    }

    /**
     * 删除单个todo
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async deleteById(req, res, next) {
        // checkData
        let url = req.originalUrl;
        let todoId = url.split('/').pop();
        if (!todoId) {
            let err = '缺少必要参数id';
            let resData = {
                code: 1,
                msg: '删除失败,' + err,
                result: []
            };
            res.status(200).send(resData);
            return
        }
        let list = await todoTable.destroy({
                where: {
                    id: todoId
                }
            })
            .then(() => {
                let resData = {
                    code: 0,
                    msg: '删除成功',
                    result: []
                };
                res.status(200).send(resData);
            }).catch((err) => {
                let resData = {
                    code: 1,
                    msg: '删除失败,' + err,
                    result: []
                };
                res.status(200).send(resData);
            });
    }

    /**
     * 批量删除todo
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async delete(req, res, next) {
        // checkData
        let todoId = req.body.id;
        if (!todoId || !_.isArray(todoId)) {
            let err = '缺少必要参数id';
            let resData = {
                code: 1,
                msg: '删除失败,' + err,
                result: []
            };
            res.status(200).send(resData);
            return;
        }
        if (todoId.length === 0) {
            let resData = {
                code: 0,
                msg: '删除成功',
                result: []
            };
            res.status(200).send(resData);
            return;
        }
        let list = await todoTable.destroy({
                where: {
                    id: {
                        [Op.or]: todoId
                    }
                }
            })
            .then(() => {
                let resData = {
                    code: 0,
                    msg: '删除成功',
                    result: []
                };
                res.status(200).send(resData);
            }).catch((err) => {
                let resData = {
                    code: 1,
                    msg: '删除失败,' + err,
                    result: []
                };
                res.status(200).send(resData);
            });
    }

    /**
     * 添加todos
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async add(req, res, next) {
        // checkData
        let reqData = req.body;
        if (!reqData.description) {
            let err = '缺少必要参数description';
            let resData = {
                code: 1,
                msg: '添加todo失败,' + err,
                result: []
            };
            res.status(200).send(resData);
        }
        if (reqData.tag && _.isArray(reqData.tag)) {
            reqData.tag.forEach((tag, index) => {
                reqData.tag[index] = encodeURIComponent(tag.name);
            });
            reqData.tag = reqData.tag.join(':');
        }
        let list = await todoTable.findOrCreate({
                where: {
                    description: reqData.description
                },
                defaults: {
                    state: reqData.state || 'active',
                    remark: reqData.remark || '',
                    tag: reqData.tag || ''
                }
            })
            .spread((todo, created) => {
                todo = todo.get({
                    plain: true
                });
                if (todo.tag) {
                    todo.tag = todo.tag.split(':');
                    todo.tag.forEach((currentItem, index) => {
                        todo.tag[index] = {
                            id: index,
                            name: decodeURIComponent(currentItem)
                        };
                    });
                } else {
                    todo.tag = [];
                }
                let resData = {
                    code: created ? 0 : 2,
                    msg: created ? '创建成功' : '已存在',
                    result: todo
                };
                res.status(200).send(resData);
            }).catch((err) => {
                let resData = {
                    code: 1,
                    msg: '添加todo失败,' + err,
                    result: {}
                };
                res.status(200).send(resData);
            });
    }

    /**
     * 更新单个todo
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update(req, res, next) {
        // checkData
        let url = req.originalUrl;
        let todoId = url.split('/').pop();
        if (!todoId) {
            let err = '缺少必要参数id';
            let resData = {
                code: 1,
                msg: '更新失败,' + err,
                result: []
            };
            res.status(200).send(resData);
        }
        let reqData = req.body;
        reqData.id = parseInt(todoId);
        if (reqData.tag && _.isArray(reqData.tag)) {
            reqData.tag.forEach((tag, index) => {
                reqData.tag[index] = encodeURIComponent(tag.name);
            });
            reqData.tag = reqData.tag.join(':');
        }
        let list = await todoTable.upsert(reqData, {
                where: {
                    id: todoId
                }
            })
            .then((todo) => {
                let resData = {
                    code: 0,
                    msg: '更新成功',
                    result: {}
                };
                res.status(200).send(resData);
            }).catch((err) => {
                let resData = {
                    code: 1,
                    msg: '更新失败,' + err,
                    result: {}
                };
                res.status(200).send(resData);
            });
    }
}

module.exports = new TodosController;