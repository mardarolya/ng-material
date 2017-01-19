
declare var angular: any;

module ToDoApp {
    'use strict';
    // var toDo = angular.module("ToDoApp", ["ngMaterial", "ui.router"]);
	var toDoApp = angular
		.module("ToDoApp", ["ngMaterial", "ui.router", 
		                    "ToDoApp.StartPage",
		                    "ToDoApp.Project",
		                    "ToDoApp.Task"])
		.config(function ($stateProvider, $urlRouterProvider) {
			    $stateProvider
			    	.state('StartPage', {
			      			url: "/StartPage",
			      			templateUrl: "view/start-page/start-page.html",
			      			controller:"startPageApp",
	    					controllerAs: "c"
			    	})
			    	.state('StartPage.Project', {
			      			url: "/Project?:projectId",
			      			templateUrl: "view/project/project.html",
			      			controller:"project",
	    					controllerAs: "c"
	    					
			    	})
			    	.state('StartPage.Task', {
			      			url: "/Task?:taskId:projectId:state",
			      			templateUrl: "view/task/task.html",
			      			controller:"task",
	    					controllerAs: "c"
			    	});
			  $urlRouterProvider.otherwise('/StartPage');
			});
}