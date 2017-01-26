/// <reference path="../../script/api.ts" />

declare var angular: any;

module ToDoApp.StartPage {
    'use strict'; 

    var startPage = angular.module("ToDoApp.StartPage", ["ui.router"]);

    class StartPage extends ToDoApp.General.mainController {
        public currentUser: string;
        public projects: any;
        public currentProjectId: number;
        public tasks: any;
        public loaded: boolean;
        public mdSidenav: any;
        public searchTask: string;
        public showSearch: boolean;
        private state: any;
        private mdDialog: any;
        private timeout: any;
        public offset: number=0;
        private timerId: any;

    	constructor($state, $scope, generalFunc, API){
        super(generalFunc, API);

        this.projects = [];
        this.tasks = [];
        this.currentProjectId = 0;
        this.loaded = false;
        this.state = $state;
        this.searchTask = "";
        this.showSearch = true;

        this.api.isSessionAlive(() => {
          this.api.getUserInfo((data: any) => {
            this.currentUser = data.Account.username;
            let photo = document.querySelector(".with-frame img");
            photo.src = data.Account.image_url;  
            this.getProj();
          });
        });
           
        // $scope.$watch(
        //   () => {return this.mdSidenav("rightPanel").isOpen()},
        //   (newValue, oldValue) => {
        //     if (oldValue == true && newValue == false) {
        //         let reloadProject = localStorage.getItem("reloadProject");
        //         if (reloadProject && reloadProject == "true") {
        //             this.getProj();
        //             localStorage.removeItem("reloadProject");
        //         }
        //     }
        // });
    	}

      public getProj(){
        this.api.getProgects(
          (data: any) => {
            this.projects = data.projects;
            console.log(this.projects);
            if (this.currentProjectId == 0) {
              this.currentProjectId = this.projects[0].Project.id;
            };
            this.loaded = true;
            this.getTasks(this.currentProjectId);
          });
      }

      public getTasks(projectID: number) {
        this.currentProjectId = projectID;
        this.setActive();
        let taskCount;
        for(let i=0, max=this.projects.length; i < max; i++) {
          if (this.projects[i].Project.id == this.currentProjectId) {
            taskCount = this.projects[i].Project.task_count;
            break;
          }
        }
        this.offset = 0;
        if (taskCount > 20) {
          this.offset = taskCount - 20;
          // this.paginator();
        }  
        this.api.getProjectTasks(this.currentProjectId, this.offset, (data: any) => {
            if (!document.querySelector(".item-project .active")) {
                this.setActive();
            }
            this.tasks = [];
            this.taskList(data);
        });
      }

        // public paginator(){
        //   clearTimeout(this.timerId);
        //   var timer = this.timerId;
        //   this.timerId = setTimeout(function tick() {
        //     let lastBlock = document.querySelector(".task-conteiner .task:last-child md-card-content:last-child");
        //     let coord = lastBlock.getBoundingClientRect();
        //     let documentHeight = document.documentElement.clientHeight;
        //     let r = documentHeight - coord.top;
        //     if (r > 0 && r < 450) {
        //       // загрузить партию
        //       this.offset-= 20;
        //       this.getProjectTasks(this.currentProjectId, this.offset, (data: any) => {
        //         this.taskList(data);
        //         if (this.offset < 0) {
        //           clearTimeout(this.timerId);
        //         } else {
        //           this.timerId = setTimeout(tick, 1000);
        //         }
        //       });
        //     } else {
        //       this.timerId = setTimeout(tick, 1000);
        //     }
        //   }, 1000);
        // }

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
          let tasksForWork = data.tasks;
          let dtParts = [];

          for(let i = tasksForWork.length -1 , min = 0; i >= min; i--) {
              dtParts = ((tasksForWork[i].Task.created_at).split(" ")[0]).split("-");
              let date = new Date(parseInt(dtParts[0]), parseInt(dtParts[1])-1, parseInt(dtParts[2])); 
              let done = false;

              for (let k = 0, maxk = this.tasks.length; k < maxk; k ++) {
                  if ((this.tasks[k].date.dateNum).toString() == date.toString()) {
                      this.tasks[k].names.push({name: tasksForWork[i].Task.title,
                                                description: tasksForWork[i].Task.description,
                                                id: tasksForWork[i].Task.id});
                      done = true;                            
                      break;
                  } 
              }

              if (done == false) {
                  this.tasks.push({date: {dateNum: date,
                                          display: ""}, names: [{name: tasksForWork[i].Task.title,
                                                        description: tasksForWork[i].Task.description,
                                                        id: tasksForWork[i].Task.id}]});
              }
          }

          var today = new Date();
          today.setHours(0, 0, 0, 0);

          this.tasks.forEach(function(item, i, arr) {
             let diffDate = today - item.date.dateNum;
             if (diffDate == 0) {
               item.date.display = "Today"
             } else if (diffDate == 86400000) {
               item.date.display = "Yesterday"
             } else if (diffDate == -86400000) {
               item.date.display = "Tomorrow"
             } else {
               var weekDay = item.date.dateNum.getDay();
               var dt, mn;
               (item.date.dateNum.getDate() <= 9)? dt = "0"+item.date.dateNum.getDate() : dt = item.date.dateNum.getDate();
               ((item.date.dateNum.getMonth() + 1) <= 9)? mn = "0"+(item.date.dateNum.getMonth() + 1) : mn = item.date.dateNum.getMonth() +1;
               if (dt < 9) {}
               var formatDate = dt + "." + mn + "." + item.date.dateNum.getFullYear();
               switch(weekDay) {
                case 0: 
                  item.date.display = "Sunday (" + formatDate + ")"
                  break
                case 1: 
                  item.date.display = "Monday (" + formatDate + ")"
                  break
                case 2: 
                  item.date.display = "Tuesday (" + formatDate + ")"
                  break
                case 3: 
                  item.date.display = "Wednesday (" + formatDate + ")"
                  break
                case 4: 
                  item.date.display = "Thursday (" + formatDate + ")"
                  break
                case 5: 
                  item.date.display = "Friday (" + formatDate + ")"
                  break
                case 6: 
                  item.date.display = "Saturday (" + formatDate + ")"
                  break 
                default: 
                  item.date.display = "";   
              }
             }
          });                
      }
      
      public openForAddProject(){
        this.open();
        this.state.go("StartPage.Project", { projectId: 0 }, {reload : "StartPage.Project"});
      }

      public openForEditProject(){
        this.open();
        this.state.go("StartPage.Project", { projectId: this.currentProjectId }, {reload : "StartPage.Project"});
      }

      public openForAddTask(){
        this.open();
        this.state.go("StartPage.Task", { taskId: 0, projectId: this.currentProjectId, state: "Add" }, {reload : "StartPage.Task"});
      }

      public openForShowTask(idTask: number){
        this.open();
        this.state.go("StartPage.Task", { taskId: idTask, projectId: this.currentProjectId, state: "Show" }, {reload : "StartPage.Task"});
      }

      public taskDone(idTask: number){
          this.api.doneTask({session: "", Task: {id: idTask}}, () => {
            outer: 
            for(let i = 0, max = this.tasks.length; i < max; i ++) {
              for (let j = 0, maxj = this.tasks[i].names.length; j < maxj; j ++) {
                if (this.tasks[i].names[j].id == idTask) {
                  this.tasks[i].names.splice(j, 1);
                  if (this.tasks[i].names.length == 0) {
                    this.tasks.splice(i, 1);
                  }
                  break outer;
                }
              }
            }

            for(let i = 0, max = this.projects.length; i < max; i ++) {
              if (this.projects[i].Project.id == this.currentProjectId) {
                this.projects[i].Project.task_count = (parseInt(this.projects[i].Project.task_count) - 1).toString();
                break;
              }
            }  
          });
      }

      public delProject(ev) {
        this.func.showConfirm({event: ev, title: "Would you like to delete this project?", okButton: "Delete"}, () => {
          this.api.deleteProject(this.currentProjectId, () => {
            for(let i = 0, max = this.projects.length; i < max; i ++) {
              if (this.projects[i].Project.id == this.currentProjectId) {
                this.projects.splice(i, 1);
                this.currentProjectId = this.projects[i].Project.id;
                break;
              }
            }
            this.getTasks(this.currentProjectId);
          })
        });
      }

      public goToSearch() {
        let inp = document.querySelector(".search-task");
        inp.focus();
      }
    }

    startPage.controller("startPage", StartPage);
    //          .directive('ngEsc', function () {
    //             return (scope, element, attrs) => {
    //                 element.bind("keydown keypress keyup", function (event) {
    //                     if(event.which === 27) {
    //                         scope.$apply(function (){
    //                             scope.$eval(attrs.ngEsc);
    //                         });

    //                         event.preventDefault();
    //                     }
    //                 });
    //           };
    // });
}