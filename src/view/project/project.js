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
            function Project($http, $state, $stateParams, $mdSidenav) {
                var _this = _super.call(this, $http) || this;
                _this.idProject = $stateParams.projectId;
                _this.mdSidenav = $mdSidenav;
                _this.state = $state;
                if (_this.idProject == 0) {
                    _this.panelHeader = "Create new project";
                }
                else {
                    _this.panelHeader = "Edit project";
                    _this.fetchProject(_this.idProject, function (data) {
                        _this.nameProject = data.Project.title;
                    });
                }
                return _this;
            }
            Project.prototype.saveProject = function () {
                var _this = this;
                if (this.nameProject && this.nameProject != "") {
                    if (this.idProject == 0) {
                        this.addProject({ session: "", Project: { title: this.nameProject } }, function () {
                            localStorage.setItem("reloadProject", "true");
                            _this.close();
                        });
                    }
                    else {
                        this.editProject({ session: "", Project: { id: this.idProject, title: this.nameProject } }, function () {
                            localStorage.setItem("reloadProject", "true");
                            _this.close();
                        });
                    }
                }
            };
            Project.prototype.close = function () {
                this.mdSidenav('rightPanel').close();
            };
            return Project;
        }(ToDoApp.Api.ApiWork));
        project.controller("project", Project);
    })(Project = ToDoApp.Project || (ToDoApp.Project = {}));
})(ToDoApp || (ToDoApp = {}));
