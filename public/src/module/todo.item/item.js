NEJ.define([
    'base/klass',
    'base/util',
    'base/element',
    'base/event',
    'ui/item/list',
    'util/template/tpl',
    'util/template/jst',
    'pro/module/todo.detail/detail',
    'text!./item.css',
    'text!./item.html',
    'text!./item.tags.html',
    'pro/module/todo.ajax/todoAjax'
], function (_k, _u, _e, _v, _i, _tpl, _jst, _detail, _css, _html, _html2, _opreation, _p, _o, _f, _r) {
    var _pro,
        _seed_html,
        _seed_jst = _jst._$add(_html);

    // 列表项构造
    _p._$$TodoItem = _k._$klass();
    _pro = _p._$$TodoItem._$extend(_i._$$ListItem);

    /**
     * 初始化界面
     * 
     * @protected
     * @method
     * @return {function}
     */
    _pro.__initXGui = (function () {
        var _seed_css = _e._$pushCSSText(_css);
        return function () {
            this.__seed_css = _seed_css;
            this.__seed_html = _seed_html;
        };
    })();

    /**
     * 动态构建控件节点模板
     *
     * @protected
     * @method 
     * @return {Void}
     */
    _pro.__initNodeTemplate = (function () {
        return function () {
            var _jst_html = _jst._$get(_seed_jst, {
                tag: []
            });
            _seed_html = _tpl._$addNodeTemplate(_jst_html);
            this.__seed_html = _seed_html;
        };
    })();

    /**
     * 初始化节点结构
     * 
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__initNode = function () {
        this.__super();
        // 0 - 切换状态节点
        // 1 - 事项内容节点
        // 2 - 功能节点，包括标签-编辑-删除
        var _list = _e._$getByClassName(this.__body, 'j-flag');
        this.__nstate = _list[0];
        this.__ndescription = _list[1];

        //标签容器
        this._ntags = _e._$getByClassName(_list[2], 'tags')[0];
        //this._tags=
        //整个item视图
        var _view = _e._$getByClassName(this.__body, 'view')[0];
        // 事件
        _v._$addEvent(
            _view, 'click',
            this.__onAction._$bind(this)
        );
        // _v._$addEvent(this.__ndescription, 'dblclick', function (_event) {
        //     _v._$stop(_event);
        //     alert('双击编辑')
        //     // var _node = _v._$getElement(_event, 'd:action');
        //     //if (!_node) return;
        // });
    };

    /**
     * 刷新 UI
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__doRefresh = function (_data) {
        //验证输入信息
        this.__nstate.checked = _data.state === 'completed';
        this.__ndescription.innerHTML = _data.description;
        if (this.__nstate.checked) {
            _e._$addClassName(this.__ndescription, 'completed');
            _e._$delClassName(this.__nstate, 'toggle');
            _e._$addClassName(this.__nstate, 'toggle-checked');
        } else {
            _e._$delClassName(this.__ndescription, 'completed');
            _e._$addClassName(this.__nstate, 'toggle');
            _e._$delClassName(this.__nstate, 'toggle-checked');
        }
        var _tags_jst = _jst._$add(_html2);
        var _tags_html = _jst._$get(_tags_jst, {
            tag: _u._$isArray(_data.tag) ? _data.tag.slice(0, 3) : []
        });
        this._ntags.innerHTML = _tags_html;
    };

    /**
     * 控件销毁
     * 
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__destroy = function () {
        this.__super();
        //发送ajax请求，删除这条
        //alert('shanchul');
    };

    /**
     * 操作
     * 
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__onAction = function (_event) {
        // 阻止事件冒泡  否则时间冒泡至document，会触发弹层的hide事件
        _v._$stop(_event);
        var _node = _v._$getElement(_event, 'd:action');
        if (!_node) return;
        // 操作
        switch (_e._$dataset(_node, 'action')) {
            case 'close':
                // 删除该事项 
                // 发送 ajax删除该事项
                this._$dispatchEvent('onclose', this);
                break;
            case 'edit':
                // 编辑该事项---弹框
                // 弹框 开放给外部
                //alert('edit');
                this._$dispatchEvent('onedit', this);
                break;
            case 'update':
                // 更新该条
                // 发送ajax 更新该条的状态  只修改state属性；
                var _data = this._$getData();
                var _that = this;
                var _temp = 'completed';
                if (_data.state === 'completed') {
                    _temp = 'active';
                }
                var obj = _u._$merge({}, _data, {
                    state: _temp
                });
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const _item = obj[key];
                        if (_item === undefined || _item === null)
                            delete obj[key];
                    }
                }
                _opreation.updateTodo(obj, function (_dataRes) {
                    if (_dataRes.code === 0) {
                        _data.state = _temp
                    } else {
                        alert(_dataRes.msg);
                    }
                    _that.__doRefresh(_data);
                }, function (err) {
                    _that.__doRefresh(_data);
                    alert(err);
                });
                // 发送ajax根据返回，决定是否刷新
                
                //alert('刷新')
                break;
            case 'select':
                //依据标签筛选
                //更新外部列表 开放给外部
                //alert('select ' + _node.innerText);
                this._$dispatchEvent('onselect', this, _node);
                break;
        }
    };

    // TODO

    return _p;
});