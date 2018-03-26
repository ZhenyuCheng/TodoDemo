/*
 * @Author: ChengZhenyu 
 * @Date: 2018-02-12 09:43:00 
 * @Last Modified by: ChengZhenyu
 * @Last Modified time: 2018-02-12 13:02:31
 */
NEJ.define([
    'base/util',
    'util/ajax/xdr'
], function (_u, _j) {
    // 从a.b.com载入数据
    var _pro = {};

    /**
     * 
     * @param {Function} successCallback 
     * @param {Function} errCallback 
     */
    _pro.getAllList = function (successCallback, errCallback) {
        if (successCallback && !_u._$isFunction(successCallback)) {
            let err = '请求成功回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }
        if (errCallback && !_u._$isFunction(errCallback)) {
            let err = '请求失败回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }

        _j._$request(
            '/api/todos', {
                type: 'json',
                method: 'GET',
                onload: function (_result) {
                    // TODO
                    successCallback(_result);
                },
                onerror: function (_error) {
                    // TODO
                    errCallback(_error);
                }
            }
        );
    };

    /**
     * 创建Todo
     * @param {Object} _data 
     * @param {Function} successCallback 
     * @param {Function} errCallback 
     */
    _pro.createTodo = function (_data, successCallback, errCallback) {
        if (!_data.description) {
            let err = '缺少参数description';
            errCallback(err);
            return;
        }
        if (successCallback && !_u._$isFunction(successCallback)) {
            let err = '请求成功回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }
        if (errCallback && !_u._$isFunction(errCallback)) {
            let err = '请求失败回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }

        _j._$request(
            '/api/todos', {
                type: 'json',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                data: JSON.stringify(_data),
                onload: function (_result) {
                    // TODO
                    successCallback(_result);
                },
                onerror: function (_error) {
                    // TODO
                    errCallback(_error);
                }
            }
        );
    };

    /**
     * 删除单个Todo
     * @param {Object} _id 
     * @param {Function} successCallback 
     * @param {Function} errCallback 
     */
    _pro.delTodoById = function (_id, successCallback, errCallback) {
        if (!_id) {
            let err = '缺少参数id';
            errCallback(err);
            return;
        }
        if (successCallback && !_u._$isFunction(successCallback)) {
            let err = '请求成功回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }
        if (errCallback && !_u._$isFunction(errCallback)) {
            let err = '请求失败回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }

        let qUrl = '/api/todos/' + _id;
        _j._$request(
            qUrl, {
                type: 'json',
                method: 'DELETE',
                onload: function (_result) {
                    // TODO
                    successCallback(_result);
                },
                onerror: function (_error) {
                    // TODO
                    errCallback(_error);
                }
            }
        );
    };

    /**
     * 更新单个Todo
     * @param {Object} _data 
     * @param {Function} successCallback 
     * @param {Function} errCallback 
     */
    _pro.updateTodo = function (_data, successCallback, errCallback) {
        if (!_data.id) {
            let err = '缺少参数id';
            errCallback(err);
            return;
        }
        if (successCallback && !_u._$isFunction(successCallback)) {
            let err = '请求成功回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }
        if (errCallback && !_u._$isFunction(errCallback)) {
            let err = '请求失败回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }

        let qUrl = '/api/todos/' + _data.id;
        _j._$request(
            qUrl, {
                type: 'json',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PATCH',
                data: JSON.stringify(_data),
                onload: function (_result) {
                    // TODO
                    successCallback(_result);
                },
                onerror: function (_error) {
                    // TODO
                    errCallback(_error);
                }
            }
        );
    };

    /**
     * 删除多个Todo
     * @param {Object} _data 
     * @param {Function} successCallback 
     * @param {Function} errCallback 
     */
    _pro.delTodo = function (_data, successCallback, errCallback) {
        if (!_u._$isArray(_data)) {
            let err = '输入数据必须是id数组';
            errCallback(err);
            return;
        }
        if (successCallback && !_u._$isFunction(successCallback)) {
            let err = '请求成功回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }
        if (errCallback && !_u._$isFunction(errCallback)) {
            let err = '请求失败回调函数类型必须是 Function！';
            errCallback(err);
            return;
        }

        let qUrl = '/api/todos';
        _j._$request(
            qUrl, {
                type: 'json',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'DELETE',
                data: JSON.stringify({
                    id: _data
                }),
                onload: function (_result) {
                    // TODO
                    successCallback(_result);
                },
                onerror: function (_error) {
                    // TODO
                    errCallback(_error);
                }
            }
        );
    };

    return _pro;
});