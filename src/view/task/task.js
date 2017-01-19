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
            function Task($http, $state, $stateParams, $mdSidenav) {
                var _this = _super.call(this, $http) || this;
                _this.mdSidenav = $mdSidenav;
                _this.isShowTask = $stateParams.state == "Show";
                _this.idTask = $stateParams.taskId;
                _this.idProject = $stateParams.projectId;
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
            Task.prototype.dlTask = function () {
                var _this = this;
                this.deleteTask(this.idTask, function () {
                    localStorage.setItem("reloadProject", "true");
                    _this.close();
                });
            };
            Task.prototype.close = function () {
                this.mdSidenav('rightPanel').close();
            };
            Task.prototype.saveTask = function () {
                var _this = this;
                if (this.taskName && this.taskName != ""
                    && this.taskDescription && this.taskDescription != "") {
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
                        });
                    }
                }
            };
            return Task;
        }(ToDoApp.Api.ApiWork));
        task.controller("task", Task);
    })(Task = ToDoApp.Task || (ToDoApp.Task = {}));
})(ToDoApp || (ToDoApp = {}));
