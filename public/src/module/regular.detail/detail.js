NEJ.define([
    'base/element',
    'base/util',
    'pro/module/todo.ajax/todoAjax',
    'regular!./detail.html',
    'text!./detail.css',
], function (_e, _u, _opreation, tpl, _css) {

    _e._$pushCSSText(_css); //激活CSS样式
    _e._$dumpCSSText();
    var TodoDetail = Regular.extend({
        name: 'todoDetail',
        template: tpl,
        // edit todo
        init: function () {
            var data = this.data,
                _that = this;
            Sortable.create(this.$refs.tagContainer, {
                filter: ".tag-add",
                onUpdate: function (evt) {
                    var tag = data.todo.tag,
                        _tp = tag[evt.oldIndex];
                    tag[evt.oldIndex] = tag[evt.newIndex];
                    tag[evt.newIndex] = _tp;
                    _that.savechange('tag');
                }
            });
        },
        deleteTag: function (tagDetail) {
            var data = this.data,
                _that = this;
            data.todo.tag.forEach((element, index) => {
                if (element.name == tagDetail.name) {
                    data.todo.tag.splice(index, 1);
                }
            });
            _that.savechange('tag');
        },
        showAddTagInput: function ($event) {
            //  var node = $event.target.nextSibling;
            this.$update('showAddTag', true);
            this.$refs.addTag.focus();

        },
        addTag: function () {
            var _flag = false,
                tempTag = this.data.tempTag;
            this.data.todo.tag.forEach(element => {
                if (element.name === tempTag) {
                    _flag = true;
                }
            });
            if (!_flag && tempTag !== '') {
                this.data.todo.tag.push({
                    name: tempTag,
                });
                this.savechange('tag');
            }
            this.data.tempTag='';
            this.data.showAddTag = false;
        },
        fixDelete: function (tagDetail, $event) {
            var _node = $event.target;
            tagDetail.w = _node.clientWidth;
            tagDetail.show = '删除'
        },
        hidemask: function ($event) {
            // 打开模态框
            this.$emit('click', $event);
        },
        savechange: function (flag) {
            var data = this.data,
                _that = this;
            for (const key in data.todo) {
                if (data.todo.hasOwnProperty(key)) {
                    const _item = data.todo[key];
                    if (_item === undefined || _item === null)
                        delete data.todo[key];
                }
            }
            _opreation.updateTodo(data.todo, function (_data) {
                if (_data.code !== 0) {
                    alert(_data.msg);
                }
                _that.$emit('refresh');
                if (flag === 'save') {
                    data.editing = true;
                }
            }, function (err) {
                alert(err);
                _that.$emit('refresh');
                if (flag === 'save') {
                    data.editing = true;
                }
            });

        },
    });

    return TodoDetail;
});