/// <reference path="../../script/api.ts" />

declare var angular: any;

module ToDoApp.Project {
    "use strict"; 

    var project = angular.module("ToDoApp.Project", ["ui.router"]);

    class Project extends ToDoApp.General.mainController {
		public nameProject: string;
		public panelHeader: string;

		private idProject: number;
		private mdSidenav: any;
		private state: any;
        private success: ((id?: any) => {});

    	constructor($state, $stateParams, $mdSidenav, generalFunc, API){
    		super(generalFunc, API);

    		this.idProject = $stateParams.projectId;
    		this.mdSidenav = $mdSidenav;
            this.success = $state.params.success;
    		this.state = $state;

    		if (this.idProject == 0) {
    			this.panelHeader = "Create new project";
    		} else {
    			this.panelHeader = "Edit project";
    			this.api.fetchProject(this.idProject, (data)=>{
    				this.nameProject = data.Project.title;
    			})

    		}
    	}

    	public saveProject(){
    		if (this.nameProject && this.nameProject != "" && this.nameProject.charCodeAt() != 127) {
    			if (this.idProject == 0) {
	    			this.api.addProject({session: "", Project: {title: this.nameProject}}, (data: any) => {
                        this.success(data.Project.id);
	    				this.close();	
	    			});
	    		} else {
	    			this.api.editProject({session: "", Project: {id: this.idProject, title: this.nameProject}}, () => {
	    				this.success();
	    				this.close();
	    			});
	    		}	
    		}    		
    	}

    }

    project.controller("project", Project);
}