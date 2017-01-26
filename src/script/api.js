//корневой файл с общими функциями и апи
var ToDoApp;
(function (ToDoApp) {
    var General;
    (function (General) {
        "use strict";
        // общи функции
        var generalFunc = (function () {
            function generalFunc() {
            }
            // окно согласиться/отменить
            generalFunc.showConfirm = function ($mdDialog, confirmParams, success) {
                var mdDialog = $mdDialog;
                var confirm = mdDialog.confirm()
                    .title(confirmParams.title)
                    .textContent('')
                    .ariaLabel(confirmParams.okButton)
                    .targetEvent(confirmParams.event)
                    .ok(confirmParams.okButton)
                    .cancel('Cancel');
                return mdDialog.show(confirm).then(function () {
                    success();
                }, function () { });
            };
            // закрыть панель, по умолчанию - правую    
            generalFunc.close = function ($mdSidenav, namePanel) {
                if (namePanel === void 0) { namePanel = "rightPanel"; }
                var mdSidenav = $mdSidenav;
                return mdSidenav(namePanel).close();
            };
            //открыть панель
            generalFunc.open = function ($mdSidenav, namePanel) {
                if (namePanel === void 0) { namePanel = "rightPanel"; }
                var mdSidenav = $mdSidenav;
                return mdSidenav(namePanel).open();
            };
            // работа кнопки ESC 
            generalFunc.ngEsc = function () {
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
            };
            //собираем все методы
            generalFunc.generalFunc = function ($mdDialog, $mdSidenav) {
                return {
                    showConfirm: function (confirmParams, success) {
                        generalFunc.showConfirm($mdDialog, confirmParams, success);
                    },
                    close: function (namePanel) {
                        generalFunc.close($mdSidenav, namePanel);
                    },
                    open: function (namePanel) {
                        generalFunc.open($mdSidenav, namePanel);
                    }
                };
            };
            return generalFunc;
        }());
        General.generalFunc = generalFunc;
        // апи
        var apiFunc = (function () {
            function apiFunc() {
            }
            // жива ли сессиия
            apiFunc.isSessionAlive = function ($http, success) {
                var _this = this;
                var session = apiFunc.getCookie("mySession");
                if (session && session != "") {
                    $http.get(this.way + '/session?session=' + session)
                        .then(function (data) {
                        success();
                    }, function (error) {
                        _this.createSession($http, success);
                    });
                }
                else {
                    this.createSession($http, success);
                }
            };
            // создать сессию
            apiFunc.createSession = function ($http, success) {
                $http.post(this.way + '/signup', { "New item": "" })
                    .then(function (data) {
                    apiFunc.setCookie("mySession", data.data.session, null);
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            // забрать куки
            apiFunc.getCookie = function (name) {
                var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            };
            // установить куки
            apiFunc.setCookie = function (name, value, options) {
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
            // получить информацию по пользователю
            apiFunc.getUserInfo = function ($http, success) {
                var session = apiFunc.getCookie("mySession");
                $http.get(this.way + '/account?session=' + session)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log(error);
                });
            };
            // получить проекты
            apiFunc.getProgects = function ($http, success) {
                var session = apiFunc.getCookie("mySession");
                $http.get(this.way + '/projects?session=' + session)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log(error);
                });
            };
            // получить таски проекта
            apiFunc.getProjectTasks = function ($http, idProject, offset, success) {
                var pageSize = 20;
                if (offset < 0) {
                    pageSize = offset + 20;
                    offset = 0;
                }
                var session = apiFunc.getCookie("mySession");
                $http.get(this.way + '/tasks?session=' + session
                    + '&project_id=' + idProject
                    + '&paging_size=' + pageSize + '&paging_offset=' + offset)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log(error);
                });
            };
            // получить информацию по проекту
            apiFunc.fetchProject = function ($http, idProject, success) {
                var session = apiFunc.getCookie("mySession");
                $http.get(this.way + '/projects/project?session=' + session + "&project_id=" + idProject)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log(error);
                });
            };
            // добавить проект
            apiFunc.addProject = function ($http, body, success) {
                body.session = apiFunc.getCookie("mySession");
                $http.post(this.way + "/projects/project", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            // править проект
            apiFunc.editProject = function ($http, body, success) {
                body.session = apiFunc.getCookie("mySession");
                $http.post(this.way + '/projects/project', body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            // удалить проект
            apiFunc.deleteProject = function ($http, idProject, success) {
                if (idProject != 0) {
                    $http["delete"](this.way + '/projects/project?session=' + apiFunc.getCookie("mySession") + '&project_id=' + idProject)
                        .then(function () {
                        success();
                    }, function (error) {
                        console.log(error);
                    });
                }
            };
            // добавить таску
            apiFunc.addTask = function ($http, body, success) {
                body.session = apiFunc.getCookie("mySession");
                $http.post(this.way + "/tasks/task", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            // править таску
            apiFunc.editTask = function ($http, body, success) {
                body.session = apiFunc.getCookie("mySession");
                $http.post(this.way + "/tasks/task", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            // удалить таску
            apiFunc.deleteTask = function ($http, idTask, success) {
                if (idTask != 0) {
                    $http["delete"](this.way + '/tasks/task?session=' + apiFunc.getCookie("mySession") + '&task_id=' + idTask)
                        .then(function () {
                        success();
                    }, function (error) {
                        console.log(error);
                    });
                }
            };
            // выполнить таску
            apiFunc.doneTask = function ($http, body, success) {
                body.session = apiFunc.getCookie("mySession");
                $http.post(this.way + "/tasks/task/complite", body)
                    .then(function (data) {
                    success();
                }, function (error) {
                    console.log(error);
                });
            };
            // получить информацию по таске
            apiFunc.fetchTask = function ($http, idTask, success) {
                $http.get(this.way + '/tasks/task?session=' + apiFunc.getCookie("mySession") + "&task_id=" + idTask)
                    .then(function (data) {
                    success(data.data);
                }, function (error) {
                    console.log(error);
                });
            };
            apiFunc.apiFunc = function ($http) {
                return {
                    isSessionAlive: function (success) {
                        apiFunc.isSessionAlive($http, success);
                    },
                    getUserInfo: function (success) {
                        apiFunc.getUserInfo($http, success);
                    },
                    getProgects: function (success) {
                        apiFunc.getProgects($http, success);
                    },
                    getProjectTasks: function (idProject, offset, success) {
                        apiFunc.getProjectTasks($http, idProject, offset, success);
                    },
                    fetchProject: function (idProject, success) {
                        apiFunc.fetchProject($http, idProject, success);
                    },
                    addProject: function (body, success) {
                        apiFunc.addProject($http, body, success);
                    },
                    editProject: function (body, success) {
                        apiFunc.editProject($http, body, success);
                    },
                    deleteProject: function (idProject, success) {
                        apiFunc.deleteProject($http, idProject, success);
                    },
                    addTask: function (body, success) {
                        apiFunc.addTask($http, body, success);
                    },
                    editTask: function (body, success) {
                        apiFunc.editTask($http, body, success);
                    },
                    deleteTask: function (idTask, success) {
                        apiFunc.deleteTask($http, idTask, success);
                    },
                    doneTask: function (body, success) {
                        apiFunc.doneTask($http, body, success);
                    },
                    fetchTask: function (idTask, success) {
                        apiFunc.fetchTask($http, idTask, success);
                    }
                };
            };
            return apiFunc;
        }());
        apiFunc.way = "https://api-test-task.decodeapps.io";
        General.apiFunc = apiFunc;
        //корневой контроллер
        var mainController = (function () {
            function mainController(generalFunc, API) {
                this.func = generalFunc;
                this.api = API;
            }
            mainController.prototype.close = function () {
                this.func.close();
            };
            mainController.prototype.open = function () {
                this.func.open();
            };
            return mainController;
        }());
        General.mainController = mainController;
    })(General = ToDoApp.General || (ToDoApp.General = {}));
})(ToDoApp || (ToDoApp = {}));
