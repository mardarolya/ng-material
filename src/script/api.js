var ToDoApp;
(function (ToDoApp) {
    var Api;
    (function (Api) {
        'use strict';
        var ApiWork = (function () {
            function ApiWork($http) {
                this.http = $http;
                this.way = "https://api-test-task.decodeapps.io";
                this.session = this.getCookie("mySession");
                this.isSessionAlive();
            }
            ApiWork.prototype.isSessionAlive = function () {
                var _this = this;
                if (this.session && this.session != "") {
                    this.http.get(this.way + '/session?session=' + this.session)
                        .then(function (data) { }, function (error) {
                        _this.createSession();
                    });
                }
                else {
                    this.createSession();
                }
            };
            ApiWork.prototype.createSession = function () {
                var _this = this;
                this.http.post(this.way + '/signup', { "New item": "" })
                    .then(function (data) {
                    _this.session = data.data.session;
                    _this.setCookie("mySession", data.data.session, null);
                }, function (error) {
                    console.log("Create session: error:" + error);
                });
            };
            ApiWork.prototype.getCookie = function (name) {
                var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            };
            ApiWork.prototype.setCookie = function (name, value, options) {
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
            ApiWork.prototype.getUserInfo = function (success) {
                this.http.get(this.way + '/account?session=' + this.session)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log("getUserInfo: error: " + error);
                });
            };
            ApiWork.prototype.getProgects = function (success) {
                this.http.get(this.way + '/projects?session=' + this.session)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log("getProgects: error: " + error);
                });
            };
            ApiWork.prototype.getProjectTasks = function (idProject, offset, success) {
                this.http.get(this.way + '/tasks?session=' + this.session
                    + '&project_id=' + idProject
                    + '&paging_size=20&paging_offset=' + offset)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log("getProjectTasks(" + idProject + ", " + offset + "): error: " + error);
                });
            };
            ApiWork.prototype.fetchProject = function (idProject, success) {
                this.http.get(this.way + '/projects/project?session=' + this.session + "&project_id=" + idProject)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log("fetchProject: error: " + error);
                });
            };
            ApiWork.prototype.addProject = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + "/projects/project", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log("addProject: error: " + error);
                });
            };
            ApiWork.prototype.editProject = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + '/projects/project', body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log("editProject: error");
                });
            };
            ApiWork.prototype.deleteProject = function (idProject, success) {
                if (idProject != 0) {
                    this.http["delete"](this.way + '/projects/project?session=' + this.session + '&project_id=' + idProject)
                        .then(function () {
                        success();
                    }, function (error) {
                        console.log("deleteProject: error: " + error);
                    });
                }
            };
            ApiWork.prototype.addTask = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + "/tasks/task", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log("addTask: error:" + error);
                });
            };
            ApiWork.prototype.editTask = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + "/tasks/task", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log("editTask: error:" + error);
                });
            };
            ApiWork.prototype.deleteTask = function (idTask, success) {
                if (idTask != 0) {
                    this.http["delete"](this.way + '/tasks/task?session=' + this.session + '&task_id=' + idTask)
                        .then(function () {
                        success();
                    }, function (error) {
                        console.log("deleteTask: error: " + error);
                    });
                }
            };
            ApiWork.prototype.doneTask = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + "/tasks/task/complite", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log("doneTask: error:" + error);
                });
            };
            ApiWork.prototype.fetchTask = function (idTask, success) {
                this.http.get(this.way + '/tasks/task?session=' + this.session + "&task_id=" + idTask)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log("fetchTask: error: " + error.toString());
                });
            };
            return ApiWork;
        }());
        Api.ApiWork = ApiWork;
    })(Api = ToDoApp.Api || (ToDoApp.Api = {}));
})(ToDoApp || (ToDoApp = {}));
