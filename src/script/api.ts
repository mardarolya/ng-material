
declare var angular: any;

module ToDoApp.Api {
    'use strict';

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

    export class ApiWork {
    	private way:     string;
    	private http:    any;
    	private session: string;

    	constructor($http){
    		this.http = $http;
    		this.way = "https://api-test-task.decodeapps.io";
    		this.session = this.getCookie("mySession");
    		this.isSessionAlive();
    	}

    	private isSessionAlive() {
    		if (this.session && this.session != "") {
    			this.http.get(this.way + '/session?session=' + this.session)
                    .then((data: any) => {},
                    (error) => {
                       this.createSession();
                    });  
    		} else {
    			this.createSession();
    		}
    	}

    	private createSession() {
    		this.http.post(this.way + '/signup', {"New item":""})
            	.then((data: any) => {
            		this.session = data.data.session;	
                	this.setCookie("mySession", data.data.session, null);
            	},
            	(error: any) =>{
              		console.log("Create session: error:" + error);
            	});		
    	}

    	private getCookie(name: string) {
            var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        private setCookie(name: string, value: any, options: any) {
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

        public getUserInfo(success: ((data: any) => void)) {
        	this.http.get(this.way + '/account?session='+this.session)
                .then(
                    (data: any) => {
                      success(data.data);
                    },
                    (error:any) => {
                      console.log("getUserInfo: error: " + error);
                    });  
        }

        public getProgects(success: ((data: any) => void)) {
            this.http.get(this.way + '/projects?session=' + this.session)
                .then(
                    (data: any) => {
                    	 success(data.data);
                    },                     
                    (error: any) => {
                        console.log("getProgects: error: " + error);
                    });  
        }

        public getProjectTasks(idProject: number, offset: number, success: ((data: any) => void)) {
        	this.http.get(this.way + '/tasks?session=' + this.session 
        		                   + '&project_id=' + idProject 
        		                   + '&paging_size=20&paging_offset=' + offset)
            .then((data: any) => {
            	success(data.data);
            },
            	(error: any) => {
            		console.log("getProjectTasks(" + idProject + ", " + offset + "): error: " + error);
            	});
        }

        public fetchProject(idProject: number, success: ((data) => void)) {
        	 this.http.get(this.way + '/projects/project?session=' + this.session + "&project_id=" + idProject)
                .then(
                    (data: any) => {
                    	 success(data.data);
                    },                     
                    (error: any) => {
                        console.log("fetchProject: error: " + error);
                    });  
        }

        public addProject(body: addProject, success: (() => void)){
        	body.session = this.session;
        	this.http.post(this.way + "/projects/project", body)
                    .then((data: any) => {
                        success();
                    },
                    (error: any) => {
                        console.log("addProject: error: " + error);
                });
        }

        public editProject(body: editProject, success: (() => void)) {
        	body.session = this.session;
        	this.http.post(this.way + '/projects/project', body)
                .then((data) => {
                    success();
                },
                (error) => {
                    console.log("editProject: error");
                });
        }

        public deleteProject(idProject: number, success: (() => void)) {
        	if (idProject != 0) {
                this.http.delete(this.way + '/projects/project?session=' + this.session + '&project_id=' + idProject)
                    .then(() => {
                        success();
                    },                     
                    (error) => {
                        console.log("deleteProject: error: " + error);
                });  
            }
        }

        public addTask(body: addTask, success: (() => void)) {
        	body.session = this.session;
        	this.http.post(this.way + "/tasks/task", body)
                    .then((data:any) => {
                        success();
                    },
                    (error: any) => {
                        console.log("addTask: error:" + error);
                    });
        }

        public editTask(body: editTask, success: (() => void)){
        	body.session = this.session;
        	this.http.post(this.way + "/tasks/task", body)
                    .then((data: any) => {
                        success();
                },
                (error: any) => {
                  console.log("editTask: error:" + error);
                });
        }

        public deleteTask(idTask: number, success: (() => void)){
        	if (idTask != 0) {
                this.http.delete(this.way + '/tasks/task?session=' + this.session + '&task_id=' + idTask)
                .then(() => {
                    success();
                },                     
                (error: any) => {
                    console.log("deleteTask: error: " + error);
                });  
            }
        }

        public doneTask(body: doneTask, success: (() => void)){
        	body.session = this.session;
        	this.http.post(this.way + "/tasks/task/complite", body)
                .then((data: any) => {
                   success();
                },
                (error: any) => {
                  console.log("doneTask: error:" + error);
                });
        }

        public fetchTask(idTask: number, success: ((data) => void)){
 			this.http.get(this.way + '/tasks/task?session=' + this.session + "&task_id=" + idTask)
                .then(
                    (data: any) => {
                    	 success(data.data);
                    },                     
                    (error: any) => {
                        console.log("fetchTask: error: " + error.toString());
                    });  
        }
    }
}