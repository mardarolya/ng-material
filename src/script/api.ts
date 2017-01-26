
declare var angular: any;
//корневой файл с общими функциями и апи
module ToDoApp.General {
    "use strict";

    interface addProject {
    	session: string,
		Project: {
			title: string
		}
    }

    interface editProject {
		session: string,
		Project: {
			   id: number,
			title: string
		}
	}

	interface addTask {
		session: string,
        Project: {
            id: number
        },
        Task: {
            title: string
            description: string
        }
	}

	interface editTask{
        session: string,
        Project: {
            id: number
        },
        Task: {
            id: number,
            title: string,
            description: string
        }
    }

    interface doneTask{
        session: string,
        Task: {
            id: number
        }
    }

    export interface confirmParams {
        event: any;
        title: string;
        okButton: string;
    }

    export interface generalFunctions {
        showConfirm(confirmParams: confirmParams, success: (() => void)) : void,
        close(namePanel?: string): void;
        open(namePanel?: string): void;
    }

    export interface apiWork {
        isSessionAlive(success: (() => void)) : void,
        getUserInfo(success: ((data: any) => void)) : void,
        getProgects(success: ((data: any) => void)) : void,
        getProjectTasks(idProject: number, offset: number, success: ((data: any) => void)) : void,
        fetchProject(idProject: number, success: ((data) => void)) : void,
        addProject(body: addProject, success: (() => void)) : void,
        editProject(body: editProject, success: (() => void)) : void,
        deleteProject(idProject: number, success: (() => void)) : void,
        addTask(body: addTask, success: (() => void)) : void,
        editTask(body: editTask, success: (() => void)) : void,
        deleteTask(idTask: number, success: (() => void)) : void,
        doneTask(body: doneTask, success: (() => void)) : void,
        fetchTask(idTask: number, success: ((data) => void)) : void
    }

    // общи функции
    export class generalFunc {
        // окно согласиться/отменить
        private static showConfirm($mdDialog: any, confirmParams: confirmParams, success: (() => void)) {
            let mdDialog = $mdDialog;
            let confirm = mdDialog.confirm()
                .title(confirmParams.title)
                .textContent('')
                .ariaLabel(confirmParams.okButton)
                .targetEvent(confirmParams.event)
                .ok(confirmParams.okButton)
                .cancel('Cancel');

            return mdDialog.show(confirm).then(() => {
                    success();
                }, () => {});
        }
        // закрыть панель, по умолчанию - правую    
        private static close($mdSidenav: any, namePanel: string="rightPanel") {
           let mdSidenav = $mdSidenav;
           return mdSidenav(namePanel).close(); 
        }
        //открыть панель
        private static open($mdSidenav: any, namePanel: string="rightPanel") {
           let mdSidenav = $mdSidenav;
           return mdSidenav(namePanel).open(); 
        }
        // работа кнопки ESC 
        public static ngEsc() {
            return (scope, element, attrs) => {
                    element.bind("keydown keypress keyup", function (event) {
                        if(event.which === 27) {
                            scope.$apply(function (){
                                scope.$eval(attrs.ngEsc);
                            });

                            event.preventDefault();
                        }
                    });
                }
        }
        //собираем все методы
        public static generalFunc($mdDialog: any, $mdSidenav: any) {
            return {
                showConfirm(confirmParams: confirmParams, success: (() => void)) {
                    generalFunc.showConfirm($mdDialog, confirmParams, success);
                },
                close(namePanel?: string){
                    generalFunc.close($mdSidenav, namePanel);
                },
                open(namePanel?: string) {
                    generalFunc.open($mdSidenav, namePanel);
                }
            }
        }
    }

    // апи
    export class apiFunc{
    	private static way: string = "https://api-test-task.decodeapps.io";
        // жива ли сессиия
       	private static isSessionAlive($http, success: (() => void)) {
            let session = apiFunc.getCookie("mySession");
    		if (session && session != "") {
    			$http.get(this.way + '/session?session=' + session)
                    .then((data: any) => {
                        success();
                    },
                    (error) => {
                       this.createSession($http, success);
                    });  
    		} else {
    			this.createSession($http, success);
    		}
    	}
        // создать сессию
    	private static createSession($http, success: (() => void)) {
    		$http.post(this.way + '/signup', {"New item":""})
            	.then((data: any) => {
                	apiFunc.setCookie("mySession", data.data.session, null);
                    success();
            	},
            	(error: any) =>{
              		console.log(error);
            	});		
    	}
        // забрать куки
    	private static getCookie(name: string) {
            var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
        // установить куки
        private static setCookie(name: string, value: any, options: any) {
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

            for (let propName in options) {
                updatedCookie += "; " + propName;
                var propValue = options[propName];
                if (propValue !== true) {
                    updatedCookie += "=" + propValue;
                }
            }
            document.cookie = updatedCookie;
        }
        // получить информацию по пользователю
        private static getUserInfo($http, success: ((data: any) => void)) {
            let session = apiFunc.getCookie("mySession");
        	$http.get(this.way + '/account?session='+session)
                .then(
                    (data: any) => {
                      success(data.data);
                    },
                    (error:any) => {
                      console.log(error);
                    });  
        }
        // получить проекты
        private static getProgects($http, success: ((data: any) => void)) {
            let session = apiFunc.getCookie("mySession");
            $http.get(this.way + '/projects?session=' + session)
                .then(
                    (data: any) => {
                    	 success(data.data);
                    },                     
                    (error: any) => {
                        console.log(error);
                    });  
        }
        // получить таски проекта
        private static getProjectTasks($http, idProject: number, offset: number, success: ((data: any) => void)) {
        	let pageSize = 20;
            if (offset < 0) {
              pageSize = offset + 20;
              offset = 0;  
            }
            let session = apiFunc.getCookie("mySession");
            $http.get(this.way + '/tasks?session=' + session 
        		                   + '&project_id=' + idProject 
        		                   + '&paging_size='+ pageSize +'&paging_offset=' + offset)
            .then((data: any) => {
            	success(data.data);
            },
            	(error: any) => {
            		console.log(error);
            	});
        }
        // получить информацию по проекту
        private static fetchProject($http, idProject: number, success: ((data) => void)) {
        	let session = apiFunc.getCookie("mySession"); 
            $http.get(this.way + '/projects/project?session=' + session + "&project_id=" + idProject)
                .then(
                    (data: any) => {
                    	 success(data.data);
                    },                     
                    (error: any) => {
                        console.log(error);
                    });  
        }
        // добавить проект
        private static addProject($http, body: addProject, success: (() => void)){
        	body.session = apiFunc.getCookie("mySession");
        	$http.post(this.way + "/projects/project", body)
                    .then((data: any) => {
                        success();
                    },
                    (error: any) => {
                        console.log(error);
                });
        }
        // править проект
        private static editProject($http, body: editProject, success: (() => void)) {
        	body.session = apiFunc.getCookie("mySession");
        	$http.post(this.way + '/projects/project', body)
                .then((data) => {
                    success();
                },
                (error) => {
                    console.log(error);
                });
        }
        // удалить проект
        private static deleteProject($http, idProject: number, success: (() => void)) {
        	if (idProject != 0) {
                $http.delete(this.way + '/projects/project?session=' + apiFunc.getCookie("mySession") + '&project_id=' + idProject)
                    .then(() => {
                        success();
                    },                     
                    (error) => {
                        console.log(error);
                });  
            }
        }
        // добавить таску
        private static addTask($http, body: addTask, success: (() => void)) {
        	body.session = apiFunc.getCookie("mySession");
        	$http.post(this.way + "/tasks/task", body)
                    .then((data:any) => {
                        success();
                    },
                    (error: any) => {
                        console.log(error);
                    });
        }
        // править таску
        private static editTask($http, body: editTask, success: (() => void)){
        	body.session = apiFunc.getCookie("mySession");
        	$http.post(this.way + "/tasks/task", body)
                    .then((data: any) => {
                        success();
                },
                (error: any) => {
                  console.log(error);
                });
        }
        // удалить таску
        private static deleteTask($http, idTask: number, success: (() => void)){
        	if (idTask != 0) {
                $http.delete(this.way + '/tasks/task?session=' + apiFunc.getCookie("mySession") + '&task_id=' + idTask)
                .then(() => {
                    success();
                },                     
                (error: any) => {
                    console.log(error);
                });  
            }
        }
        // выполнить таску
        private static doneTask($http, body: doneTask, success: (() => void)){
        	body.session = apiFunc.getCookie("mySession");
        	$http.post(this.way + "/tasks/task/complite", body)
                .then((data: any) => {
                   success();
                },
                (error: any) => {
                  console.log(error);
                });
        }
        // получить информацию по таске
        private static fetchTask($http, idTask: number, success: ((data) => void)){
 			$http.get(this.way + '/tasks/task?session=' + apiFunc.getCookie("mySession") + "&task_id=" + idTask)
                .then(
                    (data: any) => {
                    	 success(data.data);
                    },                     
                    (error: any) => {
                        console.log(error);
                    });  
        }

        public static apiFunc($http: any) {
            return {
                isSessionAlive(success: (() => void)) {
                    apiFunc.isSessionAlive($http, success);
                },
                getUserInfo(success: ((data: any) => void)) {
                    apiFunc.getUserInfo($http, success);
                },
                getProgects(success: ((data: any) => void)) {
                    apiFunc.getProgects($http, success);
                },
                getProjectTasks(idProject: number, offset: number, success: ((data: any) => void)) {
                    apiFunc.getProjectTasks($http, idProject, offset, success);
                },
                fetchProject(idProject: number, success: ((data) => void)) {
                    apiFunc.fetchProject($http, idProject, success);
                },
                addProject(body: addProject, success: (() => void)) {
                    apiFunc.addProject($http, body, success);
                },
                editProject(body: editProject, success: (() => void)) {
                    apiFunc.editProject($http, body, success); 
                },
                deleteProject(idProject: number, success: (() => void)) {
                    apiFunc.deleteProject($http, idProject, success);
                },
                addTask(body: addTask, success: (() => void)) {
                    apiFunc.addTask($http, body, success);
                },
                editTask(body: editTask, success: (() => void)) {
                    apiFunc.editTask($http, body, success);
                },
                deleteTask(idTask: number, success: (() => void)) {
                    apiFunc.deleteTask($http, idTask, success);
                },
                doneTask(body: doneTask, success: (() => void)) {
                    apiFunc.doneTask($http, body, success);
                },
                fetchTask(idTask: number, success: ((data) => void)) {
                    apiFunc.fetchTask($http, idTask, success);
                } 
            }
        }
    }

    //корневой контроллер
    export class mainController {
        public func: generalFunctions;
        public api: apiWork;

        constructor(generalFunc, API){
            this.func = generalFunc;
            this.api = API;
        }

        public close() {
            this.func.close();
        }

        public open() {
            this.func.open();
        }

    }
}