NEJ.define([
    'base/element',
    'base/util',
    'pro/module/todo.ajax/todoAjax',
    'regular!./regular.html',
    'text!./index.css',
    'pro/module/regular.item/item',
    'pro/module/regular.detail/detail',
], function (_e, _u, _opreation, tpl, _css, TodoItem, Detail) {

    _e._$pushCSSText(_css); //激活CSS样式
    _e._$dumpCSSText();
    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    var dom = Regular.dom;

    Regular.event('enter', function (elem, fire) {
        function update(ev) {
            if (ev.which == ENTER_KEY) {
                ev.preventDefault();
                fire(ev);
            }
        }
        dom.on(elem, 'keypress', update);
        return function destroy() {
            dom.off(elem, 'keypress', update);
        }
    });

    Regular.event('esc', function (elem, fire) {
        function update(ev) {
            if (ev.which == ESCAPE_KEY) {
                ev.preventDefault();
                fire(ev);
            }
        }
        dom.on(elem, 'keydown', update);
        return function destroy() {
            dom.off(elem, 'keydown', update);
        }
    });



    var TodoApp = Regular.extend({
        template: tpl,
        init: function () {
            this.$on("filter", function ($event, tag) {
                // your logic here
                filter.tag.push(tag);
            });
        },
        hidemask: function ($event) {
            $event.stopPropagation();
            this.refreshList();
        },
        // add new todo
        addTodo: function (newTodoTitle) {
            newTodoTitle = newTodoTitle.trim();
            var data = this.data,
                _that = this;
            if (newTodoTitle) {
                var _dataPost = {
                    state: 'active',
                    description: newTodoTitle,
                    tag: [],
                    remark: '',
                    createTime: Date.now(),
                    updateTime: Date.now(),
                }
                // 这里应发送ajax，传输_data,返回值赋给 _pro._itemData
                _opreation.createTodo(_dataPost, function (_data) {
                    if (_data.code === 0) {
                        data.todos.unshift(_data.result);
                        data.newTodoTitle = '';
                        _that.$update('todos', data.todos)
                    } else {
                        alert(_data.msg);
                    }
                }, function (err) {
                    alert(err);
                });
            }
        },
        // clear completed todos
        clearCompleted: function () {
            var data = this.data,
                _dataFliter = [],
                ids = [],
                _that = this;
            data.todos.forEach(element => {
                if (element.state === 'completed') {
                    ids.push(element.id);
                } else {
                    _dataFliter.push(element);
                }
            });
            _opreation.delTodo(ids, function (_data) {
                if (_data.code === 0) {
                    data.todos = _dataFliter;
                    _that.$update('todos', data.todos)
                } else {
                    alert(_data.msg);
                }
            }, function (err) {
                alert(err);
            });
            // 设置all状态为selected
            // 设置selected标签为All
        },

        refreshList: function () {
            var data = this.data,
                _that = this;
            _opreation.getAllList(function (_data) {
                if (_data.code === 0) {
                    data.todos = _data.result;
                } else {
                    alert(_data.msg);
                }
                _that.$update('todos', data.todos)
            }, function (err) {
                _that.$update('todos', data.todos)
                alert(err);
            });
        },
        // remove todo
        removeTodo: function (todo) {
            var data = this.data,
                _that = this;
            _opreation.delTodoById(todo.id, function (_result) {
                if (_result.code === 0) {
                    var index = data.todos.indexOf(todo);
                    data.todos.splice(index, 1);
                    _that.$update('todos', data.todos)
                } else {
                    alert(_result.msg);
                }
            }, function (err) {
                alert(err);
            });

        },
        // filter
        todoFilter: function (type) {
            var type = type || this.data.filter;
            if (!type || !type.state || (type.state === 'all' && type.tag.length === 0)) {
                return this.data.todos;
            } else {
                var temp = this.data.todos.filter(function (todo) {
                    if (type.state !== 'all' && type.state !== todo.state) return false;
                    let flag = true;
                    let tagname = todo.tag.map(function (ele) {
                        return ele.name;
                    })
                    type.tag.forEach(element => {
                        if (tagname.indexOf(element) === -1) {
                            flag = false;
                        }
                    });
                    return flag;
                });
                return temp;
            }
        },
        // edit
        edit: function (todo) {
            this.data.editing = false;
            this.data.todoEditing = todo;
        },
        computed: {
            allCompleted: {
                get: function (data) {
                    return data.todos.length === this.todoFilter({
                        state: 'completed',
                        tag: []
                    }).length;
                },
                set: function (sign, data) {
                    // 发送ajax
                    let _that = this,
                        _temp = sign ? 'completed' : 'active';
                    data.todos.forEach((element, index) => {
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
                                data.todos[index] = obj;
                            } else {
                                alert(_data.msg);
                            }
                            _that.$update('todos', data.todos)
                        }, function (err) {
                            _that.$update('todos', data.todos)
                            alert(err);
                        });
                    });
                }
            },
            filterSelected: {
                get: function (data) {
                    if (data.filter) {
                        let text = '';
                        if (data.filter.tag.length > 0) {
                            data.filter.tag.forEach(function (ele) {
                                text += ele + ':';
                            });
                        } else {
                            text = data.filter.state;
                        }
                        return text;
                    } else {
                        return '';
                    }
                }
            }
        }
    });

    return TodoApp;
});