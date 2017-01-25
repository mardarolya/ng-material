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
            function StartPage($http, $mdSidenav, $state, $scope, $mdDialog, $timeout) {
                var _this = _super.call(this, $http, $mdSidenav, $mdDialog) || this;
                _this.offset = 0;
                _this.mdSidenav = $mdSidenav;
                _this.projects = [];
                _this.tasks = [];
                _this.currentProjectId = 0;
                _this.loaded = false;
                _this.state = $state;
                _this.mdDialog = $mdDialog;
                _this.searchTask = "";
                _this.showSearch = true;
                _this.timeout = $timeout;
                _this.isSessionAlive(function () {
                    _this.getUserInfo(function (data) {
                        _this.currentUser = data.Account.username;
                        var photo = document.querySelector(".with-frame img");
                        photo.src = data.Account.image_url;
                        _this.getProj();
                    });
                });
                $scope.$watch(function () { return _this.mdSidenav("rightPanel").isOpen(); }, function (newValue, oldValue) {
                    if (oldValue == true && newValue == false) {
                        var reloadProject = localStorage.getItem("reloadProject");
                        if (reloadProject && reloadProject == "true") {
                            _this.getProj();
                            localStorage.removeItem("reloadProject");
                        }
                    }
                });
                return _this;
            }
            StartPage.prototype.getProj = function () {
                var _this = this;
                this.getProgects(function (data) {
                    _this.projects = data.projects;
                    if (_this.currentProjectId == 0) {
                        _this.currentProjectId = _this.projects[0].Project.id;
                    }
                    ;
                    _this.loaded = true;
                    _this.showSearch = true;
                    setTimeout(function () {
                        var div = document.querySelector(".conteiner-projects");
                        div.classList.add("default-skin");
                        $(".conteiner-projects").customScrollbar();
                    }, 1500);
                    _this.getTasks(_this.currentProjectId);
                });
            };
            StartPage.prototype.getTasks = function (projectID) {
                var _this = this;
                this.currentProjectId = projectID;
                this.setActive();
                this.showSearch = true;
                var taskCount;
                for (var i = 0, max = this.projects.length; i < max; i++) {
                    if (this.projects[i].Project.id == this.currentProjectId) {
                        taskCount = this.projects[i].Project.task_count;
                        break;
                    }
                }
                if (taskCount > 20) {
                    this.offset = taskCount - 20;
                }
                this.getProjectTasks(this.currentProjectId, this.offset, function (data) {
                    if (!document.querySelector(".item-project .active")) {
                        _this.setActive();
                    }
                    _this.tasks = [];
                    _this.taskList(data);
                });
            };
            StartPage.prototype.paginator = function () {
                var timerId = setTimeout(function tick() {
                    var _this = this;
                    var lastBlock = document.querySelector(".task-conteiner .task:last-child md-card-content:last-child");
                    var coord = lastBlock.getBoundingClientRect();
                    var documentHeight = document.documentElement.clientHeight;
                    var r = documentHeight - coord.top;
                    if (r > 0 && r < 450) {
                        // загрузить партию
                        this.offset -= 20;
                        this.getProjectTasks(this.currentProjectId, this.offset, function (data) {
                            _this.taskList(data);
                            if (_this.offset < 0) {
                                clearTimeout(timerId);
                            }
                            else {
                                timerId = setTimeout(tick, 1000);
                            }
                        });
                    }
                    else {
                        timerId = setTimeout(tick, 1000);
                    }
                }, 1000);
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
                this.mdSidenav("rightPanel").open();
                this.state.go("StartPage.Project", { projectId: 0 }, { reload: "StartPage.Project" });
            };
            StartPage.prototype.openForEditProject = function () {
                this.mdSidenav("rightPanel").open();
                this.state.go("StartPage.Project", { projectId: this.currentProjectId }, { reload: "StartPage.Project" });
            };
            StartPage.prototype.openForAddTask = function () {
                this.mdSidenav("rightPanel").open();
                this.state.go("StartPage.Task", { taskId: 0, projectId: this.currentProjectId, state: "Add" }, { reload: "StartPage.Task" });
            };
            StartPage.prototype.openForShowTask = function (idTask) {
                this.mdSidenav("rightPanel").open();
                this.state.go("StartPage.Task", { taskId: idTask, projectId: this.currentProjectId, state: "Show" }, { reload: "StartPage.Task" });
            };
            StartPage.prototype.taskDone = function (idTask) {
                var _this = this;
                this.doneTask({ session: "", Task: { id: idTask } }, function () {
                    _this.getProj();
                });
            };
            StartPage.prototype.delProject = function (ev) {
                var _this = this;
                this.showConfirm(ev, "Would you like to delete this project?", "Delete", function () {
                    _this.deleteProject(_this.currentProjectId, function () {
                        _this.currentProjectId = 0;
                        _this.getProj();
                    });
                });
            };
            StartPage.prototype.goToSearch = function () {
                var inp = document.querySelector(".search-task");
                inp.focus();
            };
            return StartPage;
        }(ToDoApp.Api.ApiWork));
        startPage.controller("startPage", StartPage)
            .directive('ngEsc', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress keyup", function (event) {
                    if (event.which === 27) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEsc);
                        });
                        event.preventDefault();
                    }
                });
            };
        });
        ;
    })(StartPage = ToDoApp.StartPage || (ToDoApp.StartPage = {}));
})(ToDoApp || (ToDoApp = {}));
