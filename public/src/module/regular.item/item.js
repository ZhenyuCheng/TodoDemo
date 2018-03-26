NEJ.define([
    'base/element',
    'base/util',
    'pro/module/todo.ajax/todoAjax',
    'regular!./item.html',
    'text!./item.css',
], function (_e, _u, _opreation, tpl, _css) {

    _e._$pushCSSText(_css); //激活CSS样式
    _e._$dumpCSSText();
    var TodoItem = Regular.extend({
        name: 'todoItem',
        template: tpl,

        computed: {
            completed: {
                get: function (data) {
                    return data.todo.state === 'completed';
                },
                set: function (value, data) {
                    var _that = this;
                    var _temp = 'completed';
                    if (!value) {
                        _temp = 'active';
                    }
                    var obj = _u._$merge({}, data.todo, {
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
                            data.todo.state = _temp
                        } else {
                            alert(_dataRes.msg);
                        }
                        _that.$update('todo', data.todo)
                    }, function (err) {
                        _that.$update('todo', data.todo)
                        alert(err);
                    });
                }
            },
            tags3:{
                get:function (data) { 
                    return data.todo.tag.slice(0,3);
                 }
            }
        },
        // edit todo
        editTodo: function () {
            // 打开模态框
            this.$emit('edit');
        },
        filterByTag: function (tag) {
            // 根据tag筛选
            if (!this.data.filter) {
                this.data.filter = {
                    state: 'all',
                    tag: []
                }
            }
            if (this.data.filter.tag.indexOf(tag.name) === -1) {
                this.data.filter.tag.push(tag.name);
            }
        },
        remove: function () {
            this.$emit('remove');
        },
        toggle: function () {
            this.data.todo.completed = !this.data.todo.completed;
            //this.$emit('toggle');
        }
    });

    return TodoItem;
});