/// <reference path="../../script/api.ts" />

declare var angular: any;

module ToDoApp.Project {
    'use strict'; 

    var project = angular.module("ToDoApp.Project", ["ui.router"]);

    class Project extends ToDoApp.Api.ApiWork {
    	constructor($http){
    		super($http);
    		console.log("i am here");
    	}

    }

    project.controller("project", Project);
}