/// <reference path="../../script/api.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ToDoApp;
(function (ToDoApp) {
    var Project;
    (function (Project_1) {
        'use strict';
        var project = angular.module("ToDoApp.Project", ["ui.router"]);
        var Project = (function (_super) {
            __extends(Project, _super);
            function Project($http) {
                var _this = _super.call(this, $http) || this;
                console.log("i am here");
                return _this;
            }
            return Project;
        }(ToDoApp.Api.ApiWork));
        project.controller("project", Project);
    })(Project = ToDoApp.Project || (ToDoApp.Project = {}));
})(ToDoApp || (ToDoApp = {}));
