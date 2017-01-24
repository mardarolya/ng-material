/// <reference path="../../script/api.ts" />

declare var angular: any;

module ToDoApp.Task {
    'use strict'; 

    var task = angular.module("ToDoApp.Task", ["ui.router"]);

    class Task extends ToDoApp.Api.ApiWork {
    	public mdSidenav: any;
		public isShowTask: boolean;
		public panelHeader: string;
		public panelBody: string;
		public taskName: string;
		public taskDescription: string;

		private idTask: number;
		private idProject: number;
		private mdDialog: any;

    	constructor($http, $state, $stateParams, $mdSidenav, $mdDialog){
    		super($http, $mdSidenav, $mdDialog);

    		this.mdSidenav = $mdSidenav;

    		this.isShowTask = $stateParams.state == "Show";
    		this.idTask = $stateParams.taskId;
    		this.idProject = $stateParams.projectId;
    		this.mdDialog = $mdDialog; 

    		if (this.idTask == 0) {
    			this.panelHeader = "Create new task";    			
    		} else {
    			this.fetchTask(this.idTask, (data) => {
    				this.taskName = data.Task.title;
    				this.taskDescription = data.Task.description;
    				this.panelBody = data.Task.description;
  					this.panelHeader = data.Task.title;
    			});
    		}

    	}  

    	public goToEditTask() {
    		this.isShowTask = false;
    		this.panelHeader = "Edit task";
    	}  	

    	public saveTask(){
    		if (this.taskName && this.taskName != "" && this.taskName.charCodeAt() != 127) {
    			if (this.idTask == 0) {
	    			this.addTask({session: "", Project: {id: this.idProject}, Task: {title: this.taskName, description: this.taskDescription}}, () => {
	    				localStorage.setItem("reloadProject", "true");
	    				this.close();	
	    			});
	    		} else {
	    			this.editTask({session: "",  Project: {id: this.idProject}, Task: {id: this.idTask, title: this.taskName, description: this.taskDescription}}, () => {
	    				localStorage.setItem("reloadProject", "true");
	    				this.close();
	    			});
	    		}	
    		}  		
    	}

    	public dlTask(ev) {
    		this.showConfirm(ev, "Would you like to delete this task?", "Delete", () => {
	    			this.deleteTask(this.idTask, () => {
	    			localStorage.setItem("reloadProject", "true");
	    			this.close();
    			})
    		})
    	}
    }

    task.controller("task", Task);
}