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
            function Task($http, $state, $stateParams, $mdSidenav, $mdDialog) {
                var _this = _super.call(this, $http) || this;
                _this.mdSidenav = $mdSidenav;
                _this.isShowTask = $stateParams.state == "Show";
                _this.idTask = $stateParams.taskId;
                _this.idProject = $stateParams.projectId;
                _this.showError = false;
                _this.mdDialog = $mdDialog;
                if (_this.idTask == 0) {
                    _this.panelHeader = "Create new task";
                }
                else {
                    _this.fetchTask(_this.idTask, function (data) {
                        _this.taskName = data.Task.title;
                        _this.taskDescription = data.Task.description;
                        _this.panelBody = data.Task.description;
                        _this.panelHeader = data.Task.title;
                    });
                }
                return _this;
            }
            Task.prototype.goToEditTask = function () {
                this.isShowTask = false;
                this.panelHeader = "Edit task";
            };
            Task.prototype.close = function () {
                this.mdSidenav('rightPanel').close();
            };
            Task.prototype.saveTask = function () {
                var _this = this;
                if (this.taskName && this.taskName != "" && this.taskName.charCodeAt() != 127) {
                    this.showError = false;
                    if (this.idTask == 0) {
                        this.addTask({ session: "", Project: { id: this.idProject }, Task: { title: this.taskName, description: this.taskDescription } }, function () {
                            localStorage.setItem("reloadProject", "true");
                            _this.close();
                        });
                    }
                    else {
                        this.editTask({ session: "", Project: { id: this.idProject }, Task: { id: this.idTask, title: this.taskName, description: this.taskDescription } }, function () {
                            localStorage.setItem("reloadProject", "true");
                            _this.close();
                            _this.isShowTask = true;
                            ;
                            _this.panelHeader = _this.taskName;
                        });
                    }
                }
                else {
                    this.showError = true;
                }
            };
            Task.prototype.dlTask = function (ev) {
                var _this = this;
                var confirm = this.mdDialog.confirm()
                    .title('Would you like to delete this task?')
                    .textContent('')
                    .ariaLabel('Delete task')
                    .targetEvent(ev)
                    .ok('Delete')
                    .cancel('Cancel');
                this.mdDialog.show(confirm).then(function () {
                    _this.deleteTask(_this.idTask, function () {
                        localStorage.setItem("reloadProject", "true");
                        _this.close();
                    });
                }, function () { });
            };
            return Task;
        }(ToDoApp.Api.ApiWork));
        task.controller("task", Task);
    })(Task = ToDoApp.Task || (ToDoApp.Task = {}));
})(ToDoApp || (ToDoApp = {}));
