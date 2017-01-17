declare var angular: any;

module ToDoApp {
    'use strict';

	var toDo = angular.module("ToDoApp", ["ngMaterial"]);

	class ToDoController {
		public loading: boolean;
        public currentUser: string;  
        public projects: any;  
        public tasks: any;
        public panelHeader: string;
        public panelBody: string;
        public pageName: string;
        public showRightPanel = false; 
        public isOpenTask: boolean;
        public isAddProject: boolean;
        public isEditProject: boolean; 
        public isAddTask: boolean; 
        public newTaskName: string;
        public newTaskDescription: string;
        public searchTask: string;

        protected http: any;
        protected currentSession: string;
        protected way: string;
        protected currentId: number;
        protected currentTask: number;
        protected newProject: string;


    	constructor($http){
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

    	protected letsGo(){
            this.currentSession = this.getCookie("mySession");      
            if (this.currentSession) {
                this.http.get(this.way + '/session?session=' + this.currentSession)
                    .then((data: any) => {
                       this.getInfo(this.currentSession);
                    }, (error) => {
                       this.postUser();
                    });   
              } else {
                this.postUser();
              }
        }

        protected postUser() {
            this.http.post(this.way + '/signup', {"New item":""})
                .then((data: any) => {
                  this.setCookie("mySession", data.data.session);
                  this.getInfo(data.data.session);
                },
                (error: any) =>{
                  console.log(error);
                });
        }

        protected getInfo(session: string) {
            this.currentSession = session; 
            this.http.get(this.way + '/account?session='+session)
                .then(
                    (data:any) => {
                      this.currentUser = data.data.Account.username;
                      var photo = document.querySelector(".with-frame img");
                      photo.src = data.data.Account.image_url;
                      this.getProgects(session);
                    },
                    (error:any) => {
                      console.log(error);
                    });      
        }

        protected getProgects(session:string) {
            this.http.get(this.way + '/projects?session='+session)
                .then(
                    (data: any) => {
                        this.projects = data.data.projects;
                        this.loading = false;
                        if (this.currentId == 0) {
                          this.currentId = this.projects[0].Project.id;
                        }
                        this.getProjectTasks(this.currentId);
                    },                     
                    (error: any) => {
                        console.log(error);
                    });  
        }

        protected getProjectTasks(id: number) {
            this.currentId = id; 
            this.http.get(this.way + '/tasks?session=' + this.currentSession + '&project_id=' + id + '&paging_size=20&paging_offset=0')
            .then((data: any) => {
                var tasks = data.data.tasks;
                var dtParts = [];
                this.tasks = [];
                for(let i = 0, max = tasks.length; i < max; i++) {
                    dtParts = ((tasks[i].Task.created_at).split(" ")[0]).split("-");
                    let date = dtParts[2] + "." + dtParts[1] + "." +dtParts[0];
                    let done = false;
                    for (let k = 0, maxk = this.tasks.length; k < maxk; k ++) {
                        if (this.tasks[k].date == date) {
                            this.tasks[k].names.push({name: tasks[i].Task.title,
                                                      description: tasks[i].Task.description,
                                                      id: tasks[i].Task.id});
                            done = true;                            
                            break;
                        } 
                    }

                    if (done == false) {
                        this.tasks.push({date: date, names: [{name: tasks[i].Task.title,
                                                              description: tasks[i].Task.description,
                                                              id: tasks[i].Task.id}]});
                    }
                }

                for (let j = 0, maxj = this.tasks.length; j < maxj; j ++) {
                    dtParts = this.tasks[j].date.split(".");
                    var dt = new Date(),
                        dtTask = new Date(parseInt(dtParts[2]), parseInt(dtParts[1])-1, parseInt(dtParts[0])),
                        d = dt.getDate(),
                        m = dt.getMonth(),
                        y = dt.getFullYear(),
                        nameWeekDay = "";
                  
                    if (d == parseInt(dtParts[0]) && m == (parseInt(dtParts[1]) - 1) && y == parseInt(dtParts[2])) {
                        this.tasks[j].date = "Today";
                    } else if ((d == parseInt(dtParts[0]) + 1) && m == (parseInt(dtParts[1]) - 1) && y == parseInt(dtParts[2])) {
                        this.tasks[j].date = "Tomorrow";
                    } else {
                        var weekDay = dtTask.getDay();
                        var nameWeekDay = "";
                        switch(weekDay) {
                          case 0: 
                            nameWeekDay = "Sunday"
                            break
                          case 1: 
                            nameWeekDay = "Monday"
                            break
                          case 2: 
                            nameWeekDay = "Tuesday"
                            break
                          case 3: 
                            nameWeekDay = "Wednesday"
                            break
                          case 4: 
                            nameWeekDay = "Thursday"
                            break
                          case 5: 
                            nameWeekDay = "Friday"
                            break
                          case 6: 
                            nameWeekDay = "Saturday"
                            break 
                          default: 
                            nameWeekDay = "";   
                    }
                    this.tasks[j].date = nameWeekDay + " (" + this.tasks[j].date + ")";
                  }
                }
                var oldEl = document.querySelector(".item-project .active");
                if (oldEl) {
                  oldEl.classList.remove("active");  
                }   
                var newEl = document.querySelector(".item-project #id_"+this.currentId);
                if (newEl) {
                  newEl.classList.add("active");  
                } 
            },              
            (error: any) => {
               console.log(error);
            });  
        }

        protected showPanel(page:string, head:string, body:string, id:any) {
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
                for (let i = 0, max = this.projects.length; i < max; i++) {
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
        }

        public closePanel() {
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
        }


        public okPanel(){
            if (this.pageName == "project") {
            // $scope.projects.push({name: this.newProject, tasks: 0});
                this.http.post(this.way + "/projects/project", {"session": this.currentSession, "Project": {"title": this.newProject}})
                    .then((data: any) => {
                        this.getProgects(this.currentSession);
                    },
                    (error: any) => {
                        console.log(error);
                });
            }

            if (this.pageName == "projectEdit") {
                let body = {"session": this.currentSession, 
                    "Project": {
                      "id": this.currentId,
                      "title": this.newProject
                      }
                    };
                this.http.post(this.way + '/projects/project', body)
                    .then((data) => {
                        this.getProgects(this.currentSession);
                },
                (error) => {
                  console.log(error);
                });
            }

            if (this.pageName == "taskCreate") {
             // $scope.tasks[$scope.tasks.length-1].names.push({name: this.newTaskName, description: this.newTaskDescription});
                let body = {
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
                    .then((data:any) => {
                        this.getProgects(this.currentSession);
                    },
                    (error: any) => {
                        console.log(error);
                    });
            }

            if (this.pageName == "taskEdit") {
         // $scope.tasks[$scope.tasks.length-1].names.push({name: this.newTaskName, description: this.newTaskDescription});
                let body = {
                      "session": this.currentSession,
                      "Project": {
                        "id": this.currentId
                      },
                      "Task": {
                        "id" : this.currentTask,
                        "title": this.newTaskName,
                        "description": this.newTaskDescription                      
                      }
                  };
                this.http.post(this.way + "/tasks/task", body)
                    .then((data: any) => {
                        this.getProgects(this.currentSession);
                },
                (error: any) => {
                  console.log(error);
                });
            }
            this.closePanel();
        }

        public taskDone(id: number) {
            let body = {
                "session": this.currentSession,
                "Task": {
                    "id": id
                }
            }
            this.http.post(this.way + "/tasks/task/complite", body)
                .then((data: any) => {
                    this.getProgects(this.currentSession) 
                },
                (error: any) => {
                  console.log(error);
                });
        }

        public taskDelete() {
            if (this.currentTask != 0) {
                this.http.delete(this.way + '/tasks/task?session=' + this.currentSession + '&task_id=' + this.currentTask)
                .then(() => {
                    this.closePanel();
                    this.getProgects(this.currentSession);
                },                     
                (error: any) => {
                    console.log(error);
                });  
            }
        }

        public deleteProject(){
            if (this.currentId != 0) {
                this.http.delete(this.way + '/projects/project?session='+this.currentSession+'&project_id='+this.currentId)
                    .then(() => {
                        this.closePanel();
                        this.currentId = 0;
                        this.getProgects(this.currentSession);
                    },                     
                    (error) => {
                        console.log(error);
                });  
            }
        }
    }

	toDo.controller("todoController", ToDoController);
}