/// <reference path="../../script/api.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ToDoApp;
(function (ToDoApp) {
    var StartPage;
    (function (StartPage) {
        'use strict';
        var startPage = angular.module("ToDoApp.StartPage", ["ui.router"]);
        var StartPageApp = (function (_super) {
            __extends(StartPageApp, _super);
            function StartPageApp($http, $mdSidenav, $state, $scope) {
                var _this = _super.call(this, $http) || this;
                _this.mdSidenav = $mdSidenav;
                _this.projects = [];
                _this.tasks = [];
                _this.currentProjectId = 0;
                _this.loaded = false;
                _this.state = $state;
                _this.showNav = false;
                _this.getUserInfo(function (data) {
                    _this.currentUser = data.Account.username;
                    var photo = document.querySelector(".with-frame img");
                    photo.src = data.Account.image_url;
                    _this.getProj();
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
            StartPageApp.prototype.getProj = function () {
                var _this = this;
                this.getProgects(function (data) {
                    _this.projects = data.projects;
                    if (_this.currentProjectId == 0) {
                        _this.currentProjectId = _this.projects[0].Project.id;
                    }
                    _this.loaded = true;
                    _this.isShowNav();
                    _this.getTasks(_this.currentProjectId);
                });
            };
            StartPageApp.prototype.getTasks = function (projectID) {
                var _this = this;
                this.currentProjectId = projectID;
                this.setActive();
                this.getProjectTasks(this.currentProjectId, 0, function (data) {
                    if (!document.querySelector(".item-project .active")) {
                        _this.setActive();
                    }
                    _this.taskList(data);
                });
            };
            StartPageApp.prototype.setActive = function () {
                var oldEl = document.querySelector(".item-project .active");
                if (oldEl) {
                    oldEl.classList.remove("active");
                }
                var newEl = document.querySelector(".item-project #id_" + this.currentProjectId);
                if (newEl) {
                    newEl.classList.add("active");
                }
            };
            StartPageApp.prototype.taskList = function (data) {
                var tasks = data.tasks;
                var dtParts = [];
                this.tasks = [];
                for (var i = 0, max = tasks.length; i < max; i++) {
                    dtParts = ((tasks[i].Task.created_at).split(" ")[0]).split("-");
                    var date = dtParts[2] + "." + dtParts[1] + "." + dtParts[0];
                    var done = false;
                    for (var k = 0, maxk = this.tasks.length; k < maxk; k++) {
                        if (this.tasks[k].date == date) {
                            this.tasks[k].names.push({ name: tasks[i].Task.title,
                                description: tasks[i].Task.description,
                                id: tasks[i].Task.id });
                            done = true;
                            break;
                        }
                    }
                    if (done == false) {
                        this.tasks.push({ date: date, names: [{ name: tasks[i].Task.title,
                                    description: tasks[i].Task.description,
                                    id: tasks[i].Task.id }] });
                    }
                    for (var j = 0, maxj = this.tasks.length; j < maxj; j++) {
                        dtParts = this.tasks[j].date.split(".");
                        var dt = new Date(), dtTask = new Date(parseInt(dtParts[2]), parseInt(dtParts[1]) - 1, parseInt(dtParts[0])), d = dt.getDate(), m = dt.getMonth(), y = dt.getFullYear(), nameWeekDay = "";
                        if (d == parseInt(dtParts[0]) && m == (parseInt(dtParts[1]) - 1) && y == parseInt(dtParts[2])) {
                            this.tasks[j].date = "Today";
                        }
                        else if ((d == parseInt(dtParts[0]) + 1) && m == (parseInt(dtParts[1]) - 1) && y == parseInt(dtParts[2])) {
                            this.tasks[j].date = "Tomorrow";
                        }
                        else {
                            var weekDay = dtTask.getDay();
                            var nameWeekDay = "";
                            switch (weekDay) {
                                case 0:
                                    nameWeekDay = "Sunday";
                                    break;
                                case 1:
                                    nameWeekDay = "Monday";
                                    break;
                                case 2:
                                    nameWeekDay = "Tuesday";
                                    break;
                                case 3:
                                    nameWeekDay = "Wednesday";
                                    break;
                                case 4:
                                    nameWeekDay = "Thursday";
                                    break;
                                case 5:
                                    nameWeekDay = "Friday";
                                    break;
                                case 6:
                                    nameWeekDay = "Saturday";
                                    break;
                                default:
                                    nameWeekDay = "";
                            }
                            this.tasks[j].date = nameWeekDay + " (" + this.tasks[j].date + ")";
                        }
                    }
                }
            };
            StartPageApp.prototype.openForAddProject = function () {
                this.mdSidenav("rightPanel").open();
                this.state.go("StartPage.Project", { projectId: 0 });
            };
            StartPageApp.prototype.openForEditProject = function () {
                this.mdSidenav("rightPanel").open();
                this.state.go("StartPage.Project", { projectId: this.currentProjectId });
            };
            StartPageApp.prototype.delProject = function () {
                var _this = this;
                this.deleteProject(this.currentProjectId, function () {
                    _this.currentProjectId = 0;
                    _this.getProj();
                });
            };
            StartPageApp.prototype.openForAddTask = function () {
                this.mdSidenav("rightPanel").open();
                this.state.go("StartPage.Task", { taskId: 0, projectId: this.currentProjectId, state: "Add" });
            };
            StartPageApp.prototype.openForShowTask = function (idTask) {
                this.mdSidenav("rightPanel").open();
                this.state.go("StartPage.Task", { taskId: idTask, projectId: this.currentProjectId, state: "Show" });
            };
            StartPageApp.prototype.taskDone = function (idTask) {
                var _this = this;
                this.doneTask({ session: "", Task: { id: idTask } }, function () {
                    _this.getProj();
                });
            };
            StartPageApp.prototype.close = function () {
                this.mdSidenav("rightPanel").close();
            };
            StartPageApp.prototype.isShowNav = function () {
                var conteiner = document.querySelector(".conteiner-projects");
                var flowConteiner = document.querySelector(".flow-conteiner");
                this.showNav = conteiner.offsetHeight < flowConteiner.offsetHeight;
            };
            StartPageApp.prototype.upList = function () {
                var parent = document.querySelector(".conteiner-projects");
                var child = document.querySelector(".flow-conteiner");
                var parentBottom = (parent.getBoundingClientRect()).bottom;
                var childBottom = (child.getBoundingClientRect()).bottom;
                if (childBottom > parentBottom) {
                    var childTop = parseInt(child.style.top);
                    child.style.top = (childTop - 40) + "px";
                }
            };
            StartPageApp.prototype.downList = function () {
                var parent = document.querySelector(".conteiner-projects");
                var child = document.querySelector(".flow-conteiner");
                var parentTop = (parent.getBoundingClientRect()).top;
                var childTop = (child.getBoundingClientRect()).top;
                if (childTop < parentTop) {
                    var childTop_1 = parseInt(child.style.top);
                    child.style.top = (childTop_1 + 40) + "px";
                }
            };
            return StartPageApp;
        }(ToDoApp.Api.ApiWork));
        startPage.controller("startPageApp", StartPageApp)
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
