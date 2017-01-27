/// <reference path="../../script/api.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ToDoApp;
(function (ToDoApp) {
    var StartPage;
    (function (StartPage_1) {
        'use strict';
        var startPage = angular.module("ToDoApp.StartPage", ["ui.router"]);
        var StartPage = (function (_super) {
            __extends(StartPage, _super);
            function StartPage($state, $scope, generalFunc, API) {
                var _this = _super.call(this, generalFunc, API) || this;
                _this.offset = 0;
                _this.projects = [];
                _this.tasks = [];
                _this.currentProjectId = 0;
                _this.loaded = false;
                _this.state = $state;
                _this.searchTask = "";
                _this.showSearch = true;
                _this.showSearchTask = false;
                _this.api.isSessionAlive(function () {
                    _this.api.getUserInfo(function (data) {
                        _this.currentUser = data.Account.username;
                        var photo = document.querySelector(".with-frame img");
                        photo.src = data.Account.image_url;
                        _this.getProj();
                    });
                });
                return _this;
            }
            StartPage.prototype.getProj = function () {
                var _this = this;
                this.api.getProgects(function (data) {
                    _this.projects = data.projects;
                    if (_this.currentProjectId == 0) {
                        _this.currentProjectId = _this.projects[0].Project.id;
                    }
                    ;
                    _this.loaded = true;
                    _this.getTasks(_this.currentProjectId);
                });
            };
            StartPage.prototype.getTasks = function (projectID) {
                var _this = this;
                this.currentProjectId = projectID;
                this.setActive();
                var taskCount;
                for (var i = 0, max = this.projects.length; i < max; i++) {
                    if (this.projects[i].Project.id == this.currentProjectId) {
                        taskCount = this.projects[i].Project.task_count;
                        break;
                    }
                }
                this.offset = 0;
                if (taskCount > 20) {
                    this.offset = taskCount - 20;
                }
                this.api.getProjectTasks(this.currentProjectId, this.offset, function (data) {
                    if (!document.querySelector(".item-project .active")) {
                        _this.setActive();
                    }
                    _this.tasks = [];
                    _this.taskList(data);
                });
            };
            StartPage.prototype.setActive = function () {
                var oldEl = document.querySelector(".item-project .active");
                if (oldEl) {
                    oldEl.classList.remove("active");
                }
                var newEl = document.querySelector(".item-project #id_" + this.currentProjectId);
                if (newEl) {
                    newEl.classList.add("active");
                }
            };
            StartPage.prototype.taskList = function (data) {
                var tasksForWork = data.tasks;
                var dtParts = [];
                for (var i = tasksForWork.length - 1, min = 0; i >= min; i--) {
                    dtParts = ((tasksForWork[i].Task.created_at).split(" ")[0]).split("-");
                    var date = new Date(parseInt(dtParts[0]), parseInt(dtParts[1]) - 1, parseInt(dtParts[2]));
                    var done = false;
                    for (var k = 0, maxk = this.tasks.length; k < maxk; k++) {
                        if ((this.tasks[k].date.dateNum).toString() == date.toString()) {
                            this.tasks[k].names.push({ name: tasksForWork[i].Task.title,
                                description: tasksForWork[i].Task.description,
                                id: tasksForWork[i].Task.id });
                            done = true;
                            break;
                        }
                    }
                    if (done == false) {
                        this.tasks.push({ date: { dateNum: date,
                                display: "" }, names: [{ name: tasksForWork[i].Task.title,
                                    description: tasksForWork[i].Task.description,
                                    id: tasksForWork[i].Task.id }] });
                    }
                }
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                this.tasks.forEach(function (item, i, arr) {
                    var diffDate = today - item.date.dateNum;
                    if (diffDate == 0) {
                        item.date.display = "Today";
                    }
                    else if (diffDate == 86400000) {
                        item.date.display = "Yesterday";
                    }
                    else if (diffDate == -86400000) {
                        item.date.display = "Tomorrow";
                    }
                    else {
                        var weekDay = item.date.dateNum.getDay();
                        var dt, mn;
                        (item.date.dateNum.getDate() <= 9) ? dt = "0" + item.date.dateNum.getDate() : dt = item.date.dateNum.getDate();
                        ((item.date.dateNum.getMonth() + 1) <= 9) ? mn = "0" + (item.date.dateNum.getMonth() + 1) : mn = item.date.dateNum.getMonth() + 1;
                        if (dt < 9) { }
                        var formatDate = dt + "." + mn + "." + item.date.dateNum.getFullYear();
                        switch (weekDay) {
                            case 0:
                                item.date.display = "Sunday (" + formatDate + ")";
                                break;
                            case 1:
                                item.date.display = "Monday (" + formatDate + ")";
                                break;
                            case 2:
                                item.date.display = "Tuesday (" + formatDate + ")";
                                break;
                            case 3:
                                item.date.display = "Wednesday (" + formatDate + ")";
                                break;
                            case 4:
                                item.date.display = "Thursday (" + formatDate + ")";
                                break;
                            case 5:
                                item.date.display = "Friday (" + formatDate + ")";
                                break;
                            case 6:
                                item.date.display = "Saturday (" + formatDate + ")";
                                break;
                            default:
                                item.date.display = "";
                        }
                    }
                });
            };
            StartPage.prototype.openForAddProject = function () {
                var _this = this;
                this.open();
                var success = function (id) {
                    _this.currentProjectId = id;
                    _this.getProj();
                };
                this.state.go("StartPage.Project", { projectId: 0, success: success }, { reload: "StartPage.Project" });
            };
            StartPage.prototype.openForEditProject = function () {
                var _this = this;
                this.open();
                var success = function () {
                    _this.getProj();
                };
                this.state.go("StartPage.Project", { projectId: this.currentProjectId, success: success }, { reload: "StartPage.Project" });
            };
            StartPage.prototype.openForAddTask = function () {
                var _this = this;
                this.open();
                var success = function () {
                    for (var i = 0, max = _this.projects.length; i < max; i++) {
                        if (_this.projects[i].Project.id == _this.currentProjectId) {
                            _this.projects[i].Project.task_count = (parseInt(_this.projects[i].Project.task_count) + 1).toString();
                            break;
                        }
                    }
                    _this.getTasks(_this.currentProjectId);
                };
                this.state.go("StartPage.Task", { taskId: 0, projectId: this.currentProjectId, state: "Add", success: success }, { reload: "StartPage.Task" });
            };
            StartPage.prototype.openForShowTask = function (idTask) {
                var _this = this;
                this.open();
                var success = function (action) {
                    if (action == "del") {
                        _this.getProj();
                    }
                    if (action == "edit") {
                        _this.getTasks(_this.currentProjectId);
                    }
                };
                this.state.go("StartPage.Task", { taskId: idTask, projectId: this.currentProjectId, state: "Show", success: success }, { reload: "StartPage.Task" });
            };
            StartPage.prototype.taskDone = function (idTask) {
                var _this = this;
                this.api.doneTask({ session: "", Task: { id: idTask } }, function () {
                    outer: for (var i = 0, max = _this.tasks.length; i < max; i++) {
                        for (var j = 0, maxj = _this.tasks[i].names.length; j < maxj; j++) {
                            if (_this.tasks[i].names[j].id == idTask) {
                                _this.tasks[i].names.splice(j, 1);
                                if (_this.tasks[i].names.length == 0) {
                                    _this.tasks.splice(i, 1);
                                }
                                break outer;
                            }
                        }
                    }
                    for (var i = 0, max = _this.projects.length; i < max; i++) {
                        if (_this.projects[i].Project.id == _this.currentProjectId) {
                            _this.projects[i].Project.task_count = (parseInt(_this.projects[i].Project.task_count) - 1).toString();
                            break;
                        }
                    }
                });
            };
            StartPage.prototype.delProject = function (ev) {
                var _this = this;
                this.func.showConfirm({ event: ev, title: "Would you like to delete this project?", okButton: "Delete" }, function () {
                    _this.api.deleteProject(_this.currentProjectId, function () {
                        for (var i = 0, max = _this.projects.length; i < max; i++) {
                            if (_this.projects[i].Project.id == _this.currentProjectId) {
                                _this.projects.splice(i, 1);
                                _this.currentProjectId = _this.projects[i].Project.id;
                                break;
                            }
                        }
                        _this.getTasks(_this.currentProjectId);
                    });
                });
            };
            StartPage.prototype.goToSearch = function () {
                var _this = this;
                if (this.showSearchTask == false) {
                    this.showSearchTask = true;
                }
                setTimeout(function () {
                    _this.setFocus();
                }, 300);
            };
            StartPage.prototype.setFocus = function () {
                var inp = document.querySelector(".search-task");
                if (inp != document.activeElement) {
                    inp.focus();
                }
            };
            StartPage.prototype.blurSearchTask = function () {
                if (this.searchTask == "" || this.searchTask.charCodeAt() == 127) {
                    this.showSearchTask = false;
                }
                this.searchTaskByName();
            };
            StartPage.prototype.cleanSearch = function () {
                this.searchTask = "";
                this.setFocus();
                this.searchTaskByName();
            };
            StartPage.prototype.scrollTasks = function () {
                var _this = this;
                var scrollable = document.querySelector(".task-conteiner");
                var endPos = scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop;
                if (endPos <= 100) {
                    if (this.offset > 0) {
                        this.offset -= 20;
                        var search = "";
                        if (this.showSearchTask && this.searchTask != "" && this.searchTask.charCodeAt() != 127) {
                            search = this.searchTask;
                        }
                        this.api.getProjectTasks(this.currentProjectId, this.offset, function (data) {
                            _this.taskList(data);
                        }, search);
                    }
                }
            };
            StartPage.prototype.searchTaskByName = function () {
                var _this = this;
                setTimeout(function () {
                    if (_this.showSearchTask && _this.searchTask != "" && _this.searchTask.charCodeAt() != 127) {
                        _this.offset = 0;
                        _this.api.getProjectTasks(_this.currentProjectId, _this.offset, function (data) {
                            _this.tasks = [];
                            _this.taskList(data);
                        }, _this.searchTask);
                    }
                    else {
                        _this.getTasks(_this.currentProjectId);
                    }
                }, 1000);
            };
            return StartPage;
        }(ToDoApp.General.mainController));
        startPage.controller("startPage", StartPage);
    })(StartPage = ToDoApp.StartPage || (ToDoApp.StartPage = {}));
})(ToDoApp || (ToDoApp = {}));
