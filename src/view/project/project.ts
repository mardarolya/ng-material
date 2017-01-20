/// <reference path="../../script/api.ts" />

declare var angular: any;

module ToDoApp.Project {
    'use strict'; 

    var project = angular.module("ToDoApp.Project", ["ui.router"]);

    class Project extends ToDoApp.Api.ApiWork {
		public nameProject: string;
		public panelHeader: string;

		private idProject: number;
		private mdSidenav: any;
		private state: any;

    	constructor($http, $state, $stateParams, $mdSidenav){
    		super($http);

    		this.idProject = $stateParams.projectId;
    		this.mdSidenav = $mdSidenav;
    		this.state = $state;

    		if (this.idProject == 0) {
    			this.panelHeader = "Create new project";
    		} else {
    			this.panelHeader = "Edit project";
    			this.fetchProject(this.idProject, (data)=>{
    				this.nameProject = data.Project.title;
    			})

    		}
    	}

    	public saveProject(){
    		if (this.nameProject && this.nameProject != "" && this.nameProject.charCodeAt() != 127) {
    			if (this.idProject == 0) {
	    			this.addProject({session: "", Project: {title: this.nameProject}}, () => {
	    				localStorage.setItem("reloadProject", "true");
	    				this.close();	
	    			});
	    		} else {
	    			this.editProject({session: "", Project: {id: this.idProject, title: this.nameProject}}, () => {
	    				localStorage.setItem("reloadProject", "true");
	    				this.close();
	    			});
	    		}	
    		}    		
    	}

    	public close() {
    		this.mdSidenav('rightPanel').close()
    	}
    }

    project.controller("project", Project);
}