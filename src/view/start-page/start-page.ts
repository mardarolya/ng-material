/// <reference path="../../script/api.ts" />

declare var angular: any;

module ToDoApp.StartPage {
    'use strict'; 

    var startPage = angular.module("ToDoApp.StartPage", ["ui.router"]);

    class StartPageApp extends ToDoApp.Api.ApiWork {
        public currentUser: string;
        public projects: any;
        public currentProjectId: number;
        public tasks: any;
        public loaded: boolean;
        public mdSidenav: any;
        public showNav: boolean;
        private state: any;
        
    	constructor($http, $mdSidenav, $state, $scope){
           super($http); 

           this.mdSidenav = $mdSidenav;
           this.projects = [];
           this.tasks = [];
           this.currentProjectId = 0;
           this.loaded = false;
           this.state = $state;
           this.showNav = false;

           this.getUserInfo((data: any) => {
               this.currentUser = data.Account.username;
               let photo = document.querySelector(".with-frame img");
               photo.src = data.Account.image_url;  
               this.getProj();
           });

           $scope.$watch(
                () => {return this.mdSidenav("rightPanel").isOpen()},
                (newValue, oldValue) => {
                  if (oldValue == true && newValue == false) {
                      let reloadProject = localStorage.getItem("reloadProject");
                      if (reloadProject && reloadProject == "true") {
                          this.getProj();
                          localStorage.removeItem("reloadProject");
                      }
                  }
                  
                });

    	}

        public getProj(){
            this.getProgects((data: any) => {
                    this.projects = data.projects;
                    if (this.currentProjectId == 0) {
                       this.currentProjectId = this.projects[0].Project.id;
                    }
                    this.loaded = true;
                    this.getTasks(this.currentProjectId);
               });
        }

        public getTasks(projectID: number) {
            this.currentProjectId = projectID;
            this.setActive();
            this.getProjectTasks(this.currentProjectId, 0, (data: any) => {
                if (!document.querySelector(".item-project .active")) {
                    this.setActive();
                }
                this.isShowNav()
                this.taskList(data);
            });
        }

        public setActive(){
            let oldEl = document.querySelector(".item-project .active");
            if (oldEl) {
              oldEl.classList.remove("active");  
            }   
            let newEl = document.querySelector(".item-project #id_"+this.currentProjectId);
            if (newEl) {
              newEl.classList.add("active");  
            }
        }

        public taskList(data: any) {
            let tasks = data.tasks;
            let dtParts = [];
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
            }
        }
        
        public openForAddProject(){
            this.mdSidenav("rightPanel").open();
            this.state.go("StartPage.Project", { projectId: 0 });
        }

        public openForEditProject(){
            this.mdSidenav("rightPanel").open();
            this.state.go("StartPage.Project", { projectId: this.currentProjectId });
        }

        public delProject(){
            this.deleteProject(this.currentProjectId, () => {
                this.getProj();
            })
        }

        public openForAddTask(){
            this.mdSidenav("rightPanel").open();
            this.state.go("StartPage.Task", { taskId: 0, projectId: this.currentProjectId, state: "Add" });
        }

        public openForShowTask(idTask: number){
            this.mdSidenav("rightPanel").open();
            this.state.go("StartPage.Task", { taskId: idTask, projectId: this.currentProjectId, state: "Show" });
        }

        public taskDone(idTask: number){
            this.doneTask({session: "", Task: {id: idTask}}, () => {
                this.getProj();
            });
        }

        public close(){
             this.mdSidenav("rightPanel").close();
        }

        public isShowNav(){
            let conteiner = document.querySelector(".conteiner-projects");
            let flowConteiner = document.querySelector(".flow-conteiner");
            this.showNav = conteiner.offsetHeight < flowConteiner.offsetHeight
        }
    }

    startPage.controller("startPageApp", StartPageApp)
             .directive('ngEsc', function () {
                return (scope, element, attrs) => {
                    element.bind("keydown keypress keyup", function (event) {
                        if(event.which === 27) {
                            scope.$apply(function (){
                                scope.$eval(attrs.ngEsc);
                            });

                            event.preventDefault();
                        }
                    });
    };
});;
}