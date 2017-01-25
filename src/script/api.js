var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ToDoApp;
(function (ToDoApp) {
    var Api;
    (function (Api) {
        'use strict';
        var generalFunc = (function () {
            function generalFunc($mdSidenav, $mdDialog) {
                this.mdSidenav = $mdSidenav;
                this.mdDialog = $mdDialog;
            }
            generalFunc.prototype.showConfirm = function (event, title, okButtonTitle, success) {
                var confirm = this.mdDialog.confirm()
                    .title(title)
                    .textContent('')
                    .ariaLabel(okButtonTitle)
                    .targetEvent(event)
                    .ok(okButtonTitle)
                    .cancel('Cancel');
                this.mdDialog.show(confirm).then(function () {
                    success();
                }, function () { });
            };
            generalFunc.prototype.close = function () {
                this.mdSidenav("rightPanel").close();
            };
            return generalFunc;
        }());
        var ApiWork = (function (_super) {
            __extends(ApiWork, _super);
            function ApiWork($http, $mdSidenav, $mdDialog) {
                var _this = _super.call(this, $mdSidenav, $mdDialog) || this;
                _this.http = $http;
                _this.way = "https://api-test-task.decodeapps.io";
                _this.session = _this.getCookie("mySession");
                return _this;
            }
            ApiWork.prototype.isSessionAlive = function (success) {
                var _this = this;
                if (this.session && this.session != "") {
                    this.http.get(this.way + '/session?session=' + this.session)
                        .then(function (data) {
                        success();
                    }, function (error) {
                        _this.createSession(success);
                    });
                }
                else {
                    this.createSession(success);
                }
            };
            ApiWork.prototype.createSession = function (success) {
                var _this = this;
                this.http.post(this.way + '/signup', { "New item": "" })
                    .then(function (data) {
                    _this.session = data.data.session;
                    _this.setCookie("mySession", data.data.session, null);
                    success();
                }, function (error) {
                    console.log(error);
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
                    console.log(error);
                });
            };
            ApiWork.prototype.getProgects = function (success) {
                this.http.get(this.way + '/projects?session=' + this.session)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log(error);
                });
            };
            ApiWork.prototype.getProjectTasks = function (idProject, offset, success) {
                var pageSize = 20;
                if (offset < 0) {
                    pageSize = offset + 20;
                    offset = 0;
                }
                this.http.get(this.way + '/tasks?session=' + this.session
                    + '&project_id=' + idProject
                    + '&paging_size=' + pageSize + '&paging_offset=' + offset)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log(error);
                });
            };
            ApiWork.prototype.fetchProject = function (idProject, success) {
                this.http.get(this.way + '/projects/project?session=' + this.session + "&project_id=" + idProject)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log(error);
                });
            };
            ApiWork.prototype.addProject = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + "/projects/project", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            ApiWork.prototype.editProject = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + '/projects/project', body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            ApiWork.prototype.deleteProject = function (idProject, success) {
                if (idProject != 0) {
                    this.http["delete"](this.way + '/projects/project?session=' + this.session + '&project_id=' + idProject)
                        .then(function () {
                        success();
                    }, function (error) {
                        console.log(error);
                    });
                }
            };
            ApiWork.prototype.addTask = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + "/tasks/task", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            ApiWork.prototype.editTask = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + "/tasks/task", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            ApiWork.prototype.deleteTask = function (idTask, success) {
                if (idTask != 0) {
                    this.http["delete"](this.way + '/tasks/task?session=' + this.session + '&task_id=' + idTask)
                        .then(function () {
                        success();
                    }, function (error) {
                        console.log(error);
                    });
                }
            };
            ApiWork.prototype.doneTask = function (body, success) {
                body.session = this.session;
                this.http.post(this.way + "/tasks/task/complite", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            ApiWork.prototype.fetchTask = function (idTask, success) {
                this.http.get(this.way + '/tasks/task?session=' + this.session + "&task_id=" + idTask)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log(error);
                });
            };
            return ApiWork;
        }(generalFunc));
        Api.ApiWork = ApiWork;
    })(Api = ToDoApp.Api || (ToDoApp.Api = {}));
})(ToDoApp || (ToDoApp = {}));
