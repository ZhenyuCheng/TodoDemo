//  NEJ.define([
//      'base/klass',
//      'base/element',
//      'ui/layer/layer'
//  ], function (_k, _e, _i0, _p, _o, _f, _r) {
//      var _proMyLayer,
//          _seed_css = _e._$pushCSSText('.#<uispace> {position: absolute; background: #fff;}');
//      _p._$$MyLayer = _k._$klass();
//      _proMyLayer = _p._$$MyLayer._$extend(_i0._$$Layer);

//      _proMyLayer.__initXGui = function () {
//          this.__seed_css = _seed_css;
//      };

//      _proMyLayer.__initNode = function () {
//          this.__super();
//          // this.__ncnt作为放置卡片内容的容器
//          this.__ncnt = this.__body;
//      };
//      // 最后项目中实例化wrapper的实例
//     //  var _ly = _p._$$MyLayerCard._$allocate({
//     //      parent: document.body,
//     //      // 隐藏浮层时，是否销毁
//     //      destroyable: false,
//     //      oncontentready: function (_html) {
//     //          // 设置浮层内容的回调
//     //      }
//     //  });
//      return _p;
//  });
NEJ.define([
    'base/klass',
    'base/util',
    'base/element',
    'base/event',
    'ui/layer/wrapper/card',
    'util/template/tpl',
    'util/template/jst',
    'text!./detail.css',
    'text!./detail.html',
    'text!./detail.tags.html',
    'pro/module/todo.ajax/todoAjax'
], function (_k, _u, _e, _v, _i0, _tpl, _jst, _css, _html, _html2, _opreation, _p, _o, _f, _r) {
    var _pro,
        _seed_html,
        _seed_jst = _jst._$add(_html);

    // 构造
    _p._$$MyCard = _k._$klass();
    _pro = _p._$$MyCard._$extend(_i0._$$CardWrapper);

    // UI
    _pro.__initXGui = (function () {
        var _seed_css = _e._$pushCSSText(_css);
        return function () {
            this.__seed_css = _seed_css;
            this.__seed_html = _seed_html;
        };
    })();

    _pro.__initNode = function () {
        this.__super();
        var _list = _e._$getByClassName(this.__body, 'j-flag');
        this._ninfoList = _e._$getByClassName(_list[0], 'info-flag');
        this._ntags = _list[1];
        this._nsave = _list[2];
        var _that = this;
        _v._$addEvent(
            this._ntags,
            'mouseover click mouseout',
            this.__tagAction._$bind(this)
        );
        _v._$addEvent(
            this._ninfoList[0],
            'enter blur',
            this.__infoAction._$bind(this)
        );
        _v._$addEvent(
            this._ninfoList[1],
            'change',
            this.__infoAction._$bind(this)
        );
        _v._$addEvent(
            this._ninfoList[2],
            'enter blur',
            this.__infoAction._$bind(this)
        );
        _v._$addEvent(
            this._nsave,
            'click',
            this.__infoSave._$bind(this)
        );
    };

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
     * 重置控件
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__reset = function (_options) {
        this.__super(_options);
        // 设置item list
        this._data = _options.itemData;
        this.__doRefresh(_options.itemData);
    };

    /**
     * 刷新
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__doRefresh = function (_data) {
        // 基本信息赋值
        this._ninfoList[0].value = _data.description;
        this._ninfoList[1].value = _data.state;
        this._ninfoList[2].value = _data.remark || '';
        this.__doRefreshTags(_data);
    };

    /** Tag 区域
     * 刷新
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__doRefreshTags = function (_data) {
        // tag区域
        var _tags_jst = _jst._$add(_html2);
        var _tags = _data.tag;
        var _tags_html = _jst._$get(_tags_jst, {
            tag: _tags || []
        });
        this._ntags.innerHTML = _tags_html;
        this._naddTag = _e._$getByClassName(this.__body, 'tag-add');
        //var test = _e._$getByClassName(this.__body, 'tag-test')[0];
        _v._$addEvent(
            this._naddTag[1],
            'blur enter',
            this.__tagAdd._$bind(this)
        );
        // 拖动排序
        var _that = this;
        this._sort = Sortable.create(this._ntags, {
            filter: ".tag-add",
            onUpdate: function (evt) {
                var _item = evt.item; // the current dragged HTMLElement
                /**
                 * 构建用于发送ajax的临时数据
                 */
                var _temp = _that._data.tag.concat();
                var _tp = _temp[evt.oldIndex];
                _temp[evt.oldIndex] = _temp[evt.newIndex];
                _temp[evt.newIndex] = _tp;

                // 发送ajax 然后决定是否要刷新 
                var obj = _u._$merge({}, _that._data, {
                    tag: _temp
                });
                delNullOfObj(obj);
                _opreation.updateTodo(obj, function (_dataRes) {
                    if (_dataRes.code === 0) {
                        /**
                         * 同步到本地缓存数据
                         */
                        _that._data.tag = _temp;
                    } else {
                        alert(_dataRes.msg);
                    }
                    _that.__doRefreshTags(_that._data);
                    _that._$dispatchEvent('onrefershitem', _that._data);
                }, function (err) {
                    _that.__doRefreshTags(_that._data);
                    _that._$dispatchEvent('onrefershitem', _that._data);
                    alert(err);
                });

                //_that._$dispatchEvent('onrefershitem', _data);
            }
        });
    }


    /** Tag 区域
     * 存储
     * @protected
     * @method
     * @return {Void}
     */

    _pro.__infoSave = function (_event) {
        var _that = this;
        _v._$stop(_event);
        var _node = _event.target;
        if (!_node) return;
        /**
         * 构建用于ajax更新的数据
         */
        var obj = _u._$merge({}, _that._data);
        obj.description = this._ninfoList[0].value;
        obj.remark = this._ninfoList[2].value;
        delNullOfObj(obj);

        _opreation.updateTodo(obj, function (_dataRes) {
            if (_dataRes.code === 0) {
                _u._$fetch(_that._data, obj);
                _that._$dispatchEvent('onrefershitem', _that._data);
                _e._$addClassName(_that.__body, 'detail-view-out');
                setTimeout(function () {
                    _that._$recycle();
                    _e._$delClassName(_that.__body, 'detail-view-out');
                }, 400);
            } else {
                alert(_dataRes.msg);
            }
        }, function (err) {
            // _that._$dispatchEvent('onrefershitem', _that._data);
            alert(err);
        });


        //
    }

    function delNullOfObj(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const _item = obj[key];
                if (_item === undefined || _item === null)
                    delete obj[key];
            }
        }
    }

    /**
     * 基础信息的修改确认事件
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__infoAction = function (_event) {
        var _that = this;
        _v._$stop(_event);
        var _node = _v._$getElement(_event, 'd:action');
        if (!_node) return;
        switch (_event.type) {
            //case 'blur'
            case 'keypress':
                /**
                 * 构建用于ajax更新的数据
                 */
                var obj = _u._$merge({}, _that._data);
                if (_e._$dataset(_node, 'action') === 'editdescription') {
                    // 刷新Item
                    obj.description = _node.value;
                } else if (_e._$dataset(_node, 'action') === 'editremark') {
                    obj.remark = _node.value;
                }
                delNullOfObj(obj);
                _opreation.updateTodo(obj, function (_dataRes) {
                    if (_dataRes.code === 0) {
                        _u._$fetch(_that._data, obj);
                    } else {
                        alert(_dataRes.msg);
                    }
                    _that._$dispatchEvent('onrefershitem', _that._data);
                }, function (err) {
                    _that._$dispatchEvent('onrefershitem', _that._data);
                    alert(err);
                });

                _node.blur();
                break;
            case 'blur':
                //this.__doRefresh(_that._data);
                break;
            case 'change':
                if (_e._$dataset(_node, 'action') === 'editstate') {
                    // 刷新item

                    /**
                     * 构建用于ajax更新的数据
                     */
                    var obj = _u._$merge({}, _that._data);
                    obj.state = _node.value;
                    delNullOfObj(obj);
                    _opreation.updateTodo(obj, function (_dataRes) {
                        if (_dataRes.code === 0) {
                            _u._$fetch(_that._data, obj);
                        } else {
                            alert(_dataRes.msg);
                        }
                        _that._$dispatchEvent('onrefershitem', _that._data);
                    }, function (err) {
                        _that._$dispatchEvent('onrefershitem', _that._data);
                        alert(err);
                    });
                }
                break;
            default:
                break;
        }
    }

    /**
     * 添加Tag
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__tagAdd = function (_event) {
        // 发送ajax
        _e._$delClassName(this._naddTag[0], 'tag-input');
        _e._$delClassName(this._naddTag[1], 'tag-inputing');
        var _node = _event.target;
        var _flag = false;
        var _that = this;
        /**
         * 是否存在相同的tag
         */
        this._data.tag.forEach(element => {
            if (element.name === _node.value) {
                _flag = true;
            }
        });
        if (!_flag && _node.value !== '') {
            var _tagTemp = {
                name: _node.value,
            };

            /**
             * 构建用于发送ajax的临时数据
             */
            var _temp = _that._data.tag.concat();
            _temp.push(_tagTemp);
            // 发送ajax 然后决定是否要刷新 
            var obj = _u._$merge({}, _that._data, {
                tag: _temp
            });
            delNullOfObj(obj);
            _opreation.updateTodo(obj, function (_dataRes) {
                if (_dataRes.code === 0) {
                    /**
                     * 同步到本地缓存数据
                     */
                    _that._data.tag = _temp;
                } else {
                    alert(_dataRes.msg);
                }
                _that.__doRefreshTags(_that._data);
                _that._$dispatchEvent('onrefershitem', _that._data);
            }, function (err) {
                _that.__doRefreshTags(_that._data);
                _that._$dispatchEvent('onrefershitem', _that._data);
                alert(err);
            });
        }

    };

    /**
     * 删除Tag以及相关TagUI变化
     * @protected
     * @method
     * @return {Void}
     */
    _pro.__tagAction = function (_event) {
        var _that = this;
        _v._$stop(_event);
        var _node = _v._$getElement(_event, 'd:action');
        if (!_node) return;
        switch (_event.type) {
            case 'mouseover':
                this._currentTag = _node.innerText;
                if (_e._$dataset(_node, 'action') === 'addtag') {
                    _node.innerText = '点击添加';
                } else if (_e._$dataset(_node, 'action') === 'delete') {

                    var w = _node.clientWidth;
                    _e._$setStyle(_node, 'width', w + 'px');
                    _node.innerText = '删除';
                }
                break;
            case 'mouseout':
                if (_e._$dataset(_node, 'action') === 'addtag' || _e._$dataset(_node, 'action') === 'delete') {
                    _e._$setStyle(_node, 'width', 'auto');
                    _node.innerText = this._currentTag;
                }
                break;
            case 'click':
                // 从当期条目删除或者添加tag 
                if (_e._$dataset(_node, 'action') === 'addtag') {
                    // 显示添加框  添加框失去焦点的时候发送ajax，隐藏编辑框 刷新UI
                    _e._$addClassName(this._naddTag[1], 'tag-inputing');
                    _e._$addClassName(this._naddTag[0], 'tag-input');
                    this._naddTag[1].focus();
                } else if (_e._$dataset(_node, 'action') === 'inputing') {
                    this._naddTag[1].focus();
                } else {
                    var _tagName = _e._$dataset(_node, 'name');

                    /**
                     * 构建用于发送ajax的临时数据
                     */
                    var _temp = _that._data.tag.concat();
                    _temp.forEach((element, index) => {
                        if (element.name == _tagName) {
                            _temp.splice(index, 1);
                        }
                    });
                    // 发送ajax 然后决定是否要刷新 
                    var obj = _u._$merge({}, _that._data, {
                        tag: _temp
                    });
                    delNullOfObj(obj);
                    _opreation.updateTodo(obj, function (_dataRes) {
                        if (_dataRes.code === 0) {
                            /**
                             * 同步到本地缓存数据
                             */
                            _that._data.tag = _temp;
                        } else {
                            alert(_dataRes.msg);
                        }
                        _that.__doRefreshTags(_that._data);
                        _that._$dispatchEvent('onrefershitem', _that._data);
                    }, function (err) {
                        _that.__doRefreshTags(_that._data);
                        _that._$dispatchEvent('onrefershitem', _that._data);
                        alert(err);
                    });
                    //刷新UI      
                }
                break;
            default:
                break;
        }
    }
    // /**
    //  * 绑定触发对象
    //  */
    // _p._$$MyCard._$attach('abc',{
    //     parent:document.body,
    //     align:'right bottom',
    //     fixed:!0,
    //     onbeforeclick:function(opt){
    //         var pos = _e._$align(
    //                 _e._$getPageBox(),
    //                 {width:222,height:60},
    //                 'right bottom'
    //         );
    //         opt.top = pos.top;
    //         opt.left = pos.left;
    //     }
    // });

    // /**
    //  * 分配显示卡片
    //  * 调整卡片位置
    //  */
    // var card = _p._$$MyCard._$allocate({
    //     parent: document.body
    // });
    // _v._$addEvent(
    //     document.body, 'click',
    //     function (ev) {
    //         _v._$stop(ev);
    //         card._$showByReference({
    //             event: ev,
    //             fitable: !0,
    //             align: 'bottom right',
    //             target: _e._$get('abc')
    //         });
    //     }
    // );
    return _p;
});