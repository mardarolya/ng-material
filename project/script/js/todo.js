var ToDoApp;
(function (ToDoApp) {
    'use strict';
    var toDo = angular.module("ToDoApp", ["ngMaterial"]);
    var ToDoController = (function () {
        function ToDoController($http) {
            this.showRightPanel = false;
            this.http = $http;
            this.loading = true;
            this.way = "https://api-test-task.decodeapps.io";
            this.projects = [];
            this.currentId = 0;
            this.tasks = [];
            this.panelHeader = "";
            this.panelBody = "";
            this.pageName = "";
            this.showRightPanel = false;
            this.isOpenTask = false;
            this.isAddProject = false;
            this.isEditProject = false;
            this.isAddTask = false;
            this.currentTask = 0;
            this.newProject = "";
            this.newTaskName = "";
            this.newTaskDescription = "";
            this.searchTask = "";
            this.letsGo();
        }
        ToDoController.prototype.getCookie = function (name) {
            var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        };
        ToDoController.prototype.setCookie = function (name, value, options) {
            options = options || {};
            var expires = options.expires;
            if (typeof expires == "number" && expires) {
                var d = new Date();
                d.setTime(d.getTime() + expires * 1000);
                expires = options.expires = d;
            }
            if (expires && expires.toUTCString) {
                options.expires = expires.toUTCString();
            }
            value = encodeURIComponent(value);
            var updatedCookie = name + "=" + value;
            for (var propName in options) {
                updatedCookie += "; " + propName;
                var propValue = options[propName];
                if (propValue !== true) {
                    updatedCookie += "=" + propValue;
                }
            }
            document.cookie = updatedCookie;
        };
        ToDoController.prototype.letsGo = function () {
            var _this = this;
            this.currentSession = this.getCookie("mySession");
            if (this.currentSession) {
                this.http.get(this.way + '/session?session=' + this.currentSession)
                    .then(function (data) {
                    _this.getInfo(_this.currentSession);
                }, function (error) {
                    _this.postUser();
                });
            }
            else {
                this.postUser();
            }
        };
        ToDoController.prototype.postUser = function () {
            var _this = this;
            this.http.post(this.way + '/signup', { "New item": "" })
                .then(function (data) {
                _this.setCookie("mySession", data.data.session);
                _this.getInfo(data.data.session);
            }, function (error) {
                console.log(error);
            });
        };
        ToDoController.prototype.getInfo = function (session) {
            var _this = this;
            this.currentSession = session;
            this.http.get(this.way + '/account?session=' + session)
                .then(function (data) {
                _this.currentUser = data.data.Account.username;
                var photo = document.querySelector(".with-frame img");
                photo.src = data.data.Account.image_url;
                _this.getProgects(session);
            }, function (error) {
                console.log(error);
            });
        };
        ToDoController.prototype.getProgects = function (session) {
            var _this = this;
            this.http.get(this.way + '/projects?session=' + session)
                .then(function (data) {
                _this.projects = data.data.projects;
                _this.loading = false;
                if (_this.currentId == 0) {
                    _this.currentId = _this.projects[0].Project.id;
                }
                _this.getProjectTasks(_this.currentId);
            }, function (error) {
                console.log(error);
            });
        };
        ToDoController.prototype.getProjectTasks = function (id) {
            var _this = this;
            this.currentId = id;
            this.http.get(this.way + '/tasks?session=' + this.currentSession + '&project_id=' + id + '&paging_size=20&paging_offset=0')
                .then(function (data) {
                var tasks = data.data.tasks;
                var dtParts = [];
                _this.tasks = [];
                for (var i = 0, max = tasks.length; i < max; i++) {
                    dtParts = ((tasks[i].Task.created_at).split(" ")[0]).split("-");
                    var date = dtParts[2] + "." + dtParts[1] + "." + dtParts[0];
                    var done = false;
                    for (var k = 0, maxk = _this.tasks.length; k < maxk; k++) {
                        if (_this.tasks[k].date == date) {
                            _this.tasks[k].names.push({ name: tasks[i].Task.title,
                                description: tasks[i].Task.description,
                                id: tasks[i].Task.id });
                            done = true;
                            break;
                        }
                    }
                    if (done == false) {
                        _this.tasks.push({ date: date, names: [{ name: tasks[i].Task.title,
                                    description: tasks[i].Task.description,
                                    id: tasks[i].Task.id }] });
                    }
                }
                for (var j = 0, maxj = _this.tasks.length; j < maxj; j++) {
                    dtParts = _this.tasks[j].date.split(".");
                    var dt = new Date(), dtTask = new Date(parseInt(dtParts[2]), parseInt(dtParts[1]) - 1, parseInt(dtParts[0])), d = dt.getDate(), m = dt.getMonth(), y = dt.getFullYear(), nameWeekDay = "";
                    if (d == parseInt(dtParts[0]) && m == (parseInt(dtParts[1]) - 1) && y == parseInt(dtParts[2])) {
                        _this.tasks[j].date = "Today";
                    }
                    else if ((d == parseInt(dtParts[0]) + 1) && m == (parseInt(dtParts[1]) - 1) && y == parseInt(dtParts[2])) {
                        _this.tasks[j].date = "Tomorrow";
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
                        _this.tasks[j].date = nameWeekDay + " (" + _this.tasks[j].date + ")";
                    }
                }
                var oldEl = document.querySelector(".item-project .active");
                if (oldEl) {
                    oldEl.classList.remove("active");
                }
                var newEl = document.querySelector(".item-project #id_" + _this.currentId);
                if (newEl) {
                    newEl.classList.add("active");
                }
            }, function (error) {
                console.log(error);
            });
        };
        ToDoController.prototype.showPanel = function (page, head, body, id) {
            this.panelHeader = head;
            this.panelBody = body;
            this.pageName = page;
            if (page == "taskView") {
                this.isOpenTask = true;
                this.showRightPanel = true;
                this.currentTask = parseInt(id);
            }
            if (page == "project") {
                this.isAddProject = true;
                this.showRightPanel = true;
            }
            if (page == "projectEdit") {
                this.isEditProject = true;
                this.showRightPanel = true;
                for (var i = 0, max = this.projects.length; i < max; i++) {
                    if (this.projects[i].Project.id == this.currentId) {
                        this.newProject = this.projects[i].Project.title;
                        break;
                    }
                }
            }
            if (page == "taskCreate") {
                this.isAddTask = true;
                this.showRightPanel = true;
            }
            if (page == "taskEdit") {
                this.isAddTask = true;
                this.showRightPanel = true;
                this.isOpenTask = false;
                this.newTaskName = head;
                this.newTaskDescription = body;
                this.panelHeader = "Edit task";
                this.panelBody = "";
            }
        };
        ToDoController.prototype.closePanel = function () {
            this.showRightPanel = false;
            this.isOpenTask = false;
            this.isAddProject = false;
            this.isAddTask = false;
            this.isEditProject = false;
            this.panelHeader = "";
            this.panelBody = "";
            this.newProject = "";
            this.pageName = "";
            this.newTaskName = "";
            this.newTaskDescription = "";
            this.currentTask = 0;
        };
        ToDoController.prototype.okPanel = function () {
            var _this = this;
            if (this.pageName == "project") {
                // $scope.projects.push({name: this.newProject, tasks: 0});
                this.http.post(this.way + "/projects/project", { "session": this.currentSession, "Project": { "title": this.newProject } })
                    .then(function (data) {
                    _this.getProgects(_this.currentSession);
                }, function (error) {
                    console.log(error);
                });
            }
            if (this.pageName == "projectEdit") {
                var body = { "session": this.currentSession,
                    "Project": {
                        "id": this.currentId,
                        "title": this.newProject
                    }
                };
                this.http.post(this.way + '/projects/project', body)
                    .then(function (data) {
                    _this.getProgects(_this.currentSession);
                }, function (error) {
                    console.log(error);
                });
            }
            if (this.pageName == "taskCreate") {
                // $scope.tasks[$scope.tasks.length-1].names.push({name: this.newTaskName, description: this.newTaskDescription});
                var body = {
                    "session": this.currentSession,
                    "Project": {
                        "id": this.currentId
                    },
                    "Task": {
                        "title": this.newTaskName,
                        "description": this.newTaskDescription
                    }
                };
                this.http.post(this.way + "/tasks/task", body)
                    .then(function (data) {
                    _this.getProgects(_this.currentSession);
                }, function (error) {
                    console.log(error);
                });
            }
            if (this.pageName == "taskEdit") {
                // $scope.tasks[$scope.tasks.length-1].names.push({name: this.newTaskName, description: this.newTaskDescription});
                var body = {
                    "session": this.currentSession,
                    "Project": {
                        "id": this.currentId
                    },
                    "Task": {
                        "id": this.currentTask,
                        "title": this.newTaskName,
                        "description": this.newTaskDescription
                    }
                };
                this.http.post(this.way + "/tasks/task", body)
                    .then(function (data) {
                    _this.getProgects(_this.currentSession);
                }, function (error) {
                    console.log(error);
                });
            }
            this.closePanel();
        };
        ToDoController.prototype.taskDone = function (id) {
            var _this = this;
            var body = {
                "session": this.currentSession,
                "Task": {
                    "id": id
                }
            };
            this.http.post(this.way + "/tasks/task/complite", body)
                .then(function (data) {
                _this.getProgects(_this.currentSession);
            }, function (error) {
                console.log(error);
            });
        };
        ToDoController.prototype.taskDelete = function () {
            var _this = this;
            if (this.currentTask != 0) {
                this.http["delete"](this.way + '/tasks/task?session=' + this.currentSession + '&task_id=' + this.currentTask)
                    .then(function () {
                    _this.closePanel();
                    _this.getProgects(_this.currentSession);
                }, function (error) {
                    console.log(error);
                });
            }
        };
        ToDoController.prototype.deleteProject = function () {
            var _this = this;
            if (this.currentId != 0) {
                this.http["delete"](this.way + '/projects/project?session=' + this.currentSession + '&project_id=' + this.currentId)
                    .then(function () {
                    _this.closePanel();
                    _this.currentId = 0;
                    _this.getProgects(_this.currentSession);
                }, function (error) {
                    console.log(error);
                });
            }
        };
        return ToDoController;
    }());
    toDo.controller("todoController", ToDoController);
})(ToDoApp || (ToDoApp = {}));
