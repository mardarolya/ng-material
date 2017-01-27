/// <reference path="../../script/api.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ToDoApp;
(function (ToDoApp) {
    var Task;
    (function (Task_1) {
        'use strict';
        var task = angular.module("ToDoApp.Task", ["ui.router"]);
        var Task = (function (_super) {
            __extends(Task, _super);
            function Task($state, $stateParams, generalFunc, API) {
                var _this = _super.call(this, generalFunc, API) || this;
                _this.isShowTask = $stateParams.state == "Show";
                _this.idTask = $stateParams.taskId;
                _this.idProject = $stateParams.projectId;
                _this.success = $state.params.success;
                if (_this.idTask == 0) {
                    _this.panelHeader = "Create new task";
                }
                else {
                    _this.api.fetchTask(_this.idTask, function (data) {
                        _this.taskName = data.Task.title;
                        _this.taskDescription = data.Task.description;
                        _this.panelBody = data.Task.description;
                        _this.panelHeader = data.Task.title;
                    });
                }
                return _this;
            }
            ;
            Task.prototype.goToEditTask = function () {
                this.isShowTask = false;
                this.panelHeader = "Edit task";
            };
            Task.prototype.saveTask = function () {
                var _this = this;
                if (this.taskName && this.taskName != "" && this.taskName.charCodeAt() != 127) {
                    if (this.idTask == 0) {
                        this.api.addTask({ session: "", Project: { id: this.idProject }, Task: { title: this.taskName, description: this.taskDescription } }, function () {
                            _this.success();
                            _this.close();
                        });
                    }
                    else {
                        this.api.editTask({ session: "", Project: { id: this.idProject }, Task: { id: this.idTask, title: this.taskName, description: this.taskDescription } }, function () {
                            _this.success("edit");
                            _this.close();
                        });
                    }
                }
            };
            Task.prototype.dlTask = function (ev) {
                var _this = this;
                this.func.showConfirm({ event: ev, title: "Would you like to delete this task?", okButton: "Delete" }, function () {
                    _this.api.deleteTask(_this.idTask, function () {
                        _this.success("del");
                        _this.close();
                    });
                });
            };
            return Task;
        }(ToDoApp.General.mainController));
        task.controller("task", Task);
    })(Task = ToDoApp.Task || (ToDoApp.Task = {}));
})(ToDoApp || (ToDoApp = {}));
