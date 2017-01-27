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
        "use strict";
        var project = angular.module("ToDoApp.Project", ["ui.router"]);
        var Project = (function (_super) {
            __extends(Project, _super);
            function Project($state, $stateParams, $mdSidenav, generalFunc, API) {
                var _this = _super.call(this, generalFunc, API) || this;
                _this.idProject = $stateParams.projectId;
                _this.mdSidenav = $mdSidenav;
                _this.success = $state.params.success;
                _this.state = $state;
                if (_this.idProject == 0) {
                    _this.panelHeader = "Create new project";
                }
                else {
                    _this.panelHeader = "Edit project";
                    _this.api.fetchProject(_this.idProject, function (data) {
                        _this.nameProject = data.Project.title;
                    });
                }
                return _this;
            }
            Project.prototype.saveProject = function () {
                var _this = this;
                if (this.nameProject && this.nameProject != "" && this.nameProject.charCodeAt() != 127) {
                    if (this.idProject == 0) {
                        this.api.addProject({ session: "", Project: { title: this.nameProject } }, function (data) {
                            _this.success(data.Project.id);
                            _this.close();
                        });
                    }
                    else {
                        this.api.editProject({ session: "", Project: { id: this.idProject, title: this.nameProject } }, function () {
                            _this.success();
                            _this.close();
                        });
                    }
                }
            };
            return Project;
        }(ToDoApp.General.mainController));
        project.controller("project", Project);
    })(Project = ToDoApp.Project || (ToDoApp.Project = {}));
})(ToDoApp || (ToDoApp = {}));
