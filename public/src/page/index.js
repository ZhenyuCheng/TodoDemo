/*
 * ------------------------------------------
 * 项目模块实现文件
 * @version  1.0
 * @author   ChengZhenyu
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'base/util',
    'base/event',
    'base/element',
    'util/dispatcher/module',
    'util/template/tpl',
    'ui/mask/mask',
    'pro/module/todo.item/item',
    'pro/module/todo.detail/detail',
    'pro/module/todo.ajax/todoAjax'
    //'/path/to/project/module.js'
], function (_k, _u, _v, _e, _m, _tpl, _mask, _item, _detail, _opreation, _p) {
    // variable declaration
    var _pro;
    /**
     * 项目模块对象
     * @class   {_$$Module}
     * @extends {_$$Module}
     * @param   {Object} 可选配置参数 
     */
    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_m._$$ModuleAbstract);
    /**
     * 构建模块，主要处理以下业务逻辑
     * - 构建模块结构
     * - 缓存后续需要使用的节点
     * - 初始化需要使用的组件的配置信息
     * @return {Void}
     */
    _pro.__doBuild = function () {
        this.__super();
        // TODO
        this.__body = _e._$html2node(_tpl._$getTextTemplate('module-id-l0'));
        //document.body.appendChild(this.__body);
        var _list = _e._$getByClassName(this.__body, 'j-flag');
        this._maskInstance = _mask._$$Mask._$allocate({
            parent: document.body,
            content: '<div style="width:100%;height:100%;margin:0 auto;background-color:#000;background: rgba(0, 0, 0, 0.5);" id="mask-id"></div>'
        });
        this._maskInstance._$hide();


        this.__export = {
            tab: _list[0],
            parent: _list[1]
        };

    };
    /**
     * 显示模块，主要处理以下业务逻辑
     * - 添加事件
     * - 分配组件
     * - 处理输入信息
     * @param  {Object} 输入参数
     * @return {Void}
     */
    _pro.__onShow = function (_options) {
        // 绑定事件
        var _list = _e._$getByClassName(this.__body, 'j-flag');
        this._naddItem = _list[0];
        this._ntoggleAll = _list[1];
        this._nfooter = _list[2];
        this._nfooterList = _e._$getByClassName(this._nfooter, 'i-flag');
        var _that = this;
        _v._$addEvent(
            this._naddItem,
            'enter',
            this.__itemAdd._$bind(this)
        );
        _v._$addEvent(
            this._ntoggleAll,
            'click',
            this.__toggleAll._$bind(this)
        );
        _v._$addEvent(
            this._nfooter,
            'click',
            this.__footerAction._$bind(this)
        );
        this.__super(_options);
    };


    /**
     * 底部栏的动作
     * -状态筛选
     * -清除完成
     * @param  {Object} 输入参数
     * @return {Void}
     */
    _pro.__footerAction = function (_event) {
        var _that = this;
        _v._$stop(_event);
        var _node = _v._$getElement(_event, 'd:action');
        if (!_node) return;
        this._nfooterList.forEach(element => {
            _e._$delClassName(element, 'selected');
        });
        switch (_e._$dataset(_node, 'action')) {
            //case 'blur'
            case 'showAll':
                _e._$addClassName(_node, 'selected');
                this._nfooterList[4].innerText = 'All';
                this.__refreshList(this._itemData);
                break;
            case 'showActive':
                var _data = this._itemData.filter(function (element) {
                    return element.state !== 'completed';
                });
                _e._$addClassName(_node, 'selected');
                this._nfooterList[4].innerText = 'Active';
                this.__refreshList(_data);
                break;
            case 'showCompleted':
                var _data = this._itemData.filter(function (element) {
                    return element.state === 'completed';
                });
                _e._$addClassName(_node, 'selected');
                this._nfooterList[4].innerText = 'Completed';
                this.__refreshList(_data);
                break;
            case 'clearCompleted':
                var _dataFliter = [],
                    ids = [];
                this._itemData.forEach(element => {
                    if (element.state === 'completed') {
                        ids.push(element.id);
                    } else {
                        _dataFliter.push(element);
                    }
                });
                _e._$addClassName(this._nfooterList[1], 'selected');
                this._nfooterList[4].innerText = 'All';
                // 发送ajax
                _opreation.delTodo(ids, function (_data) {
                    if (_data.code === 0) {
                        _that._itemData = _dataFliter;
                    } else {
                        alert(_data.msg);
                    }
                    _that.__refreshList(_that._itemData);
                }, function (err) {
                    _that.__refreshList(_that._itemData);
                    alert(err);
                });
                break;
            default:
                break;
        }
    };

    /**
     * 切换所有item的状态
     * @param  {Object} 输入参数
     * @return {Void}
     */
    _pro.__toggleAll = function (_event) {
        var _node = _event.target;
        var _temp = 'completed';
        if (!_node.checked) {
            _temp = 'active';
        }
        var _that = this;
        this._itemData.forEach((element, index) => {
            let obj = _u._$merge({}, element, {
                state: _temp
            });
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const _item = obj[key];
                    if (_item === undefined || _item === null)
                        delete obj[key];
                }
            }
            _opreation.updateTodo(obj, function (_data) {
                if (_data.code === 0) {
                    _that._itemData[index] = obj;
                } else {
                    alert(_data.msg);
                }
                _that.__refreshList(_that._itemData);
            }, function (err) {
                _that.__refreshList(_that._itemData);
                alert(err);
            });
        });
        // 这里应发送ajax，传输_pro._itemData,返回值赋给 _pro._itemData
        //this.__refreshList(this._itemData);
    };

    /**
     * 添加item
     * @param  {Object} 输入参数
     * @return {Void}
     */
    _pro.__itemAdd = function (_event) {
        if (this._naddItem.value === '') return;
        var _node = _event.target;
        var _dataPost = {
            state: 'active',
            description: this._naddItem.value,
            tag: [],
            remark: '',
            createTime: Date.now(),
            updateTime: Date.now(),
        }
        var _that = this;
        // 这里应发送ajax，传输_data,返回值赋给 _pro._itemData
        _opreation.createTodo(_dataPost, function (_data) {
            if (_data.code === 0) {
                _that._itemData.unshift(_data.result);
                _node.value = '';
            } else {
                alert(_data.msg);
            }
            _that.__refreshList(_that._itemData);
        }, function (err) {
            _that.__refreshList(_that._itemData);
            alert(err);
        });
    };




    /**
     * item组件测试数据
     */
    _pro._itemData = [];
    /**
     * 刷新模块，主要处理以下业务逻辑
     * - 分配组件，分配之前需验证
     * - 处理输入信息
     * - 同步状态
     * - 载入数据
     * @return {Void}
     */
    _pro.__onRefresh = function (_options) {
        this.__super(_options);
        // ajax获取列表
        var _that = this;
        _opreation.getAllList(function (_data) {
            if (_data.code === 0) {
                _that._itemData = _data.result;
            } else {
                _that._itemData = [];
                alert(_data.msg);
            }
            _that.__refreshList(_that._itemData);
        }, function (err) {
            _that._itemData = [];
            _that.__refreshList(_that._itemData);
            alert(err);
        });

        //分配列表
    };

    _pro.__refreshList = function (_data) {
        if (this._itemData.length === 0) {
            _e._$addClassName(this._nfooter, 'footer-none');
        } else {
            _e._$delClassName(this._nfooter, 'footer-none');
        }
        var _that = this;
        this._nfooterList[0].innerText = _data.length;
        if (this._list && _u._$isArray(this._list)) {
            this._list.forEach(element => {
                element._$recycle();
            });
        }
        this._list = _tpl._$getItemTemplate(
            _data, _item._$$TodoItem, {
                parent: 'list-box',
                onclose: function (_itemObj) {
                    // 删除
                    _opreation.delTodoById(_itemObj.__data.id, function (_result) {
                        if (_result.code === 0) {
                            _that._itemData.splice(_itemObj.index, 1);
                            _that._nfooterList[0].innerText = _data.length;
                            _itemObj.__destroy();
                        } else {
                            alert(_result.msg);
                        }
                    }, function (err) {
                        alert(err);
                    });


                    //_pro.__refreshList(_data);
                },
                onedit: function (_itemObj) {
                    _that._maskInstance._$show();
                    var card = _detail._$$MyCard._$allocate({
                        parent: 'mask-id',
                        destroyable: true,
                        nohack: true,
                        itemData: _itemObj._$getData(),
                        oncontentready: function (_detailNode) {
                            // 设置浮层内容的回调
                            // _detailNode为浮层内容节点
                            // 根据数据：_itemObj._$getData() 以及node设置浮层todo item的具体事项

                            //alert(card.__seed_html)
                        },
                        onbeforerecycle: function () {
                            // 回收前触发的回调
                            _that._maskInstance._$hide();
                        },
                        onrefershitem: function (_data) {
                            _itemObj.__doRefresh(_data);
                        }
                    });
                    // card._$showByReference({
                    //     align: 'bottom right',
                    //     target: document.body
                    // });
                    //card._$show();
                },
                onselect: function (_itemObj, _ntag) {
                    // TODO
                    // 依据标签筛选列表
                    var _selected = _ntag.innerText.trim();
                    var _temp = _data.filter(function (element) {
                        var _flag = false;
                        if (!element.tag) return _flag;
                        element.tag.forEach(tag => {
                            if (tag.name === _selected) {
                                _flag = true;
                                //break;
                            }
                        });
                        return _flag;
                    });
                    var _tempSelected = _that._nfooterList[4].innerText.trim();
                    if (_tempSelected === '' || _tempSelected === 'All' || _tempSelected === 'Active' ||
                        _tempSelected === 'Completed') {
                        _tempSelected = _selected;
                    } else {
                        var selectedList = _tempSelected.split(':');
                        if (selectedList.indexOf(_selected) === -1) {
                            _tempSelected += ':' + _selected;
                        }
                    }
                    _that._nfooterList[4].innerText = _tempSelected;
                    _that.__refreshList(_temp);
                },
            }
        );
    }

    /**
     * 隐藏模块，主要处理以下业务逻辑
     * - 回收事件
     * - 回收组件
     * - 尽量保证恢复到构建时的状态
     * @return {Void}
     */
    _pro.__onHide = function () {
        this.__super();
        // TODO
    };
    /**
     * 模块重置逻辑
     * @private
     * @param  {Object} options - 输入参数信息
     * @return {Void}
     */
    _pro.__reset = function (options) {
        this.__super(options);
        // TODO something if necessary

        this._$dispatchEvent('onshow', options);

        //this.__onShow(_options);
        //_v._$dispatchEvent(_pro,'onshow');
    };
    _pro.__doParseParent = function (_options) {
        return document.body;
    }
    // notify dispatcher
    _m._$regist(
        'layout-rej', _p._$$Module
    );

    return _p;
});