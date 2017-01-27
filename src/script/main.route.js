/// <reference path="api.ts" />
var ToDoApp;
(function (ToDoApp) {
    'use strict';
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
            controller: "startPage",
            controllerAs: "c"
        })
            .state('StartPage.Project', {
            url: "/Project?:projectId",
            templateUrl: "view/project/project.html",
            controller: "project",
            controllerAs: "c",
            params: { success: function () { } }
        })
            .state('StartPage.Task', {
            url: "/Task?:taskId:projectId:state",
            templateUrl: "view/task/task.html",
            controller: "task",
            controllerAs: "c",
            params: { success: function () { } }
        });
        $urlRouterProvider.otherwise('/StartPage');
    })
        .service("generalFunc", ["$mdDialog", "$mdSidenav", ToDoApp.General.generalFunc.generalFunc])
        .service("API", ["$http", ToDoApp.General.apiFunc.apiFunc])
        .directive('ngEsc', ToDoApp.General.generalFunc.ngEsc)
        .directive('ngScroll', ToDoApp.General.generalFunc.ngScroll);
    ;
})(ToDoApp || (ToDoApp = {}));
