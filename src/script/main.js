var ToDoApp;
(function (ToDoApp) {
    'use strict';
    // var toDo = angular.module("ToDoApp", ["ngMaterial", "ui.router"]);
    var toDoApp = angular
        .module("ToDoApp", ["ngMaterial", "ui.router",
        "ToDoApp.StartPage",
        "ToDoApp.Project"])
        .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('StartPage', {
            url: "/StartPage",
            templateUrl: "view/start-page/start-page.html",
            controller: "startPageApp",
            controllerAs: "c"
        })
            .state('StartPage.Project', {
            url: "/Project?projectId",
            templateUrl: "view/project/project.html",
            controller: "project",
            controllerAs: "c"
        });
        // .state('Task', {
        //  			url: "/Task?taskdId",
        //  			templateUrl: "view/task/task.html",
        //  			controller:"task",
        // 		controllerAs: "c"
        // });
        $urlRouterProvider.otherwise('/StartPage');
    });
})(ToDoApp || (ToDoApp = {}));
