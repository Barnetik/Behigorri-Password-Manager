(function() {
    var app = angular.module('Behigorri', ['ngTagsInput', 'btford.markdown']);

    app.factory('SessionTimeoutInterceptor', function() {
        var requestInterceptor = {
            responseError: function(responseError) {
                if (responseError.status === 401) {
                    var baseUrl = angular.element('base').attr('href');
                    window.location = baseUrl + '/login';
                }
                return responseError;
            }
        };
        return requestInterceptor;
    });

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('SessionTimeoutInterceptor');
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    }]);

    app.factory('TagFilterService', function($rootScope) {
        var service = {};
        service.filterByTag = function(tag) {
            $rootScope.$broadcast('filterByTag', tag);
        };
        return service;
    });

    app.factory('PasswordModalService', function($rootScope) {
        var service = {};
        service.decryptData = function(sensitiveData) {
            $rootScope.$broadcast('decryptData', sensitiveData)
        };
        service.deleteData = function(sensitiveData) {
            $rootScope.$broadcast('deleteData', sensitiveData)
        };
        service.downloadFile = function(sensitiveData) {
            $rootScope.$broadcast('downloadFile', sensitiveData)
        };

        service.dataDecrypted = function(sensitiveData) {
            $rootScope.$broadcast('dataDecrypted', sensitiveData);
        };
        service.dataDeleted = function(sensitiveData) {
            $rootScope.$broadcast('dataDeleted', sensitiveData);
        };
        return service;
    });

    app.factory('SensitiveDataService', function($rootScope) {
        var service = {};
        service.updateListData = function(sensitiveData) {
            $rootScope.$broadcast('updateListData', sensitiveData);
        };
        return service;
    });

    app.controller('TagsController', ['$scope', 'TagFilterService', function($scope, TagFilterService) {
        this.tags = tags;

        this.hasSensitiveData = function(tag) {
            return tag.sensitive_data.length > 0
        };

        this.filterSensitiveData = function(tag) {
            TagFilterService.filterByTag(tag);
        };
    }]);

    app.controller('SensitiveDataListController', ['$scope', '$filter', '$element', 'PasswordModalService', function($scope, $filter, $element, PasswordModalService) {
        var self = this;
        this.data = sensitiveData;
        this.origData = sensitiveData;

        this.filterTags = [];

        $($element).find('.js-action-link').tooltip();

        this.decryptData = function(sensitiveData) {
            PasswordModalService.decryptData(sensitiveData);
        };

        this.deleteData = function(sensitiveData) {
            PasswordModalService.deleteData(sensitiveData);
        };

        this.downloadFile = function(sensitiveData) {
            PasswordModalService.downloadFile(sensitiveData);
        };

        $scope.$on('updateListData', function(event, sensitiveData) {
            var found = false;
            angular.forEach(self.origData, function(data, key) {
                if (data.id === sensitiveData.id) {
                    self.origData[key] = sensitiveData;
                    found = true;
                }
            });
            if (!found) {
                self.origData.push(sensitiveData);
            }
            angular.forEach(self.data, function(data, key) {
                if (data.id === sensitiveData.id) {
                    self.data[key] = sensitiveData;
                    found = true;
                }
            });
            if (!found) {
                self.data.push(sensitiveData);
            }
        });

        $scope.$on('dataDeleted', function(event, sensitiveData) {
            angular.forEach(self.origData, function(data, key) {
                if (data.id === sensitiveData.id) {
                    self.origData.splice(key, 1);
                }
            });
            angular.forEach(self.data, function(data, key) {
                if (data.id === sensitiveData.id) {
                    self.data.splice(key, 1);
                }
            });
        });

        $scope.$on('filterByTag', function(event, tag) {
            var tagIndex = self.filterTags.indexOf(tag);

            if (tagIndex >= 0) {
                self.filterTags.splice(tagIndex, 1);
                tag.labelClass = 'label-default';
            } else {
                self.filterTags.push(tag);
                tag.labelClass = 'label-primary';
            }

            if (self.filterTags.length === 0) {
                self.data = self.origData;
            } else {
                self.data = $filter('filter')(self.origData, function(value) {
                    var found = false;
                    angular.forEach(self.filterTags, function(filterTag) {
                        angular.forEach(value.tags, function(valueTag) {
                            if (valueTag.id === filterTag.id) {
                                found = true;
                            }
                        });
                    });
                    return found;
                });
            }
        });
    }]);

    app.controller('SensitiveDataAreaController', ['$http', '$scope', '$element', 'SensitiveDataService', 'PasswordModalService', function($http, $scope, $element, sensitiveDataService, passwordModalService) {
        var self = this;

        this.baseUrl = angular.element('base').attr('href');
        this.selectedTab = 'form';
        this.$el = $($element);

        var fileField = $($element).find('#form-fineupload');

        $scope.show = false;
        $scope.sensitiveData = {};

        $scope.alertMessage = '';

        $scope.showArea = function() {
            $scope.show = true;
        };

        $scope.hideArea = function() {
            $scope.show = false;
            $scope.sensitiveData = {};
        };

        this.isSelectedTab = function(tabName) {
            return this.selectedTab === tabName;
        };

        this.selectTab = function(tabName) {
            this.selectedTab = tabName;
        };

        $scope.getAvailableTags = function(query) {
            return $http.get(self.baseUrl + '/tags/search?query=' + query);
        };

        $scope.downloadFile = function() {
            passwordModalService.downloadFile($scope.sensitiveData);
        };

        this.hasFiles = function() {
            return fileField.fineUploader('getUploads').length > 0;
        };

        fileField.fineUploader({
            multiple: false,
            form: {
                interceptSubmit: false
            },
            validation: {
                sizeLimit: 15000000
            }
        }).on('error', function(event, id, name, response, xhr){
            $scope.alertMessage = response.error.message;
            fileField.fineUploader('reset');
        }).on('complete', function(event, id, name, data) {
            fileField.fineUploader('reset');
            $scope.sensitiveData.id = data.id;
            // We resubmit the form to set the tags.
            $scope.submitData(event);
        });

        $scope.submitData = function($event) {
            $event.preventDefault();
            $scope.alertMessage = '';
            if (self.hasFiles()) {
                fileField.fineUploader('uploadStoredFiles');
            } else {
                $http.post(
                    self.baseUrl + '/sensitiveData',
                    $scope.sensitiveData
                ).success(function(data) {
                    var value = $scope.sensitiveData.value;
                    $scope.sensitiveData = data;
                    $scope.sensitiveData.value = value;
                    sensitiveDataService.updateListData(angular.copy($scope.sensitiveData));
                }).error(function(data) {
                    $scope.alertMessage = data.error.message;
                });
            }
        };

        $scope.$on('dataDecrypted', function(event, sensitiveData){
            $scope.showArea();
            $scope.sensitiveData = sensitiveData;
        });
    }]);

    app.controller('PasswordModalController', ['$scope', '$element', '$http', 'PasswordModalService', function($scope, $element, $http, passwordModalService) {
        var self = this;
        this.$el = $($element);
        this.action = '';
        this.titleClass = 'text-info';
        this.submitClass = 'btn-info';
        this.submitText = 'Decrypt Now';
        this.submitDisabled = true;
        this.password = '';
        this.sensitiveData = {};

        this.baseUrl = angular.element('base').attr('href');
        $scope.alertMessage = '';
        $scope.alertClass = 'alert-warning';

        this.checkSubmitable = function(value) {
            if (self.password.length > 0) {
                self.submitDisabled = false;
            } else {
                self.submitDisabled = true;
            }
        };

        this.show = function() {
            self.$el.modal('show');
            self.$el.on('shown.bs.modal', function() {
                self.$el.find('input.js-password').focus();
            });
            $scope.alertMessage = '';
            };

        this.hide = function() {
            this.$el.modal('hide');
        };

        this.performAction = function() {
            switch (self.action) {
                case 'decrypt':
                    self.decrypt();
                    break;
                case 'delete':
                    self.delete();
                    break;
                case 'download':
                    self.download();
                    break;
            }
        };

        this.decrypt = function() {
            $http.post(
                    self.baseUrl + '/sensitiveData/decrypt',
                    {
                        id: self.sensitiveData.id,
                        password: self.password
                    }
                ).
                success(function(data) {
                    passwordModalService.dataDecrypted(data);
                    self.hide();
                }).
                error(function(response){
                    $scope.alertMessage = response.error.message;
                    $scope.alertClass = 'alert-warning';
                }
            );
        };

        this.delete = function() {
            $http.post(
                    self.baseUrl + '/sensitiveData/delete',
                    {
                        id: self.sensitiveData.id,
                        password: self.password
                    }
                ).
                success(function(data) {
                    passwordModalService.dataDeleted(self.sensitiveData);
                    self.hide();
                }).
                error(function(response){
                    $scope.alertMessage = response.error.message;
                    $scope.alertClass = 'alert-warning';
                }
            );
        };

        this.download = function() {
            $http.post(
                    self.baseUrl + '/sensitiveData/decrypt',
                    {
                        id: self.sensitiveData.id,
                        password: self.password
                    }
                ).
                success(function(data) {
                    // TODO: This seems a little "ugly", try to do it better and without jquery
                    var theForm = $('<form />');
                    $('body').append(theForm);
                    theForm.attr('action', self.baseUrl + '/sensitiveData/download');
                    theForm.attr('method', 'post');
                    theForm.hide();

                    var id = $('<input />').attr('name', 'id').val(self.sensitiveData.id);
                    var password = $('<input />').attr('name', 'password').val(self.password);
                    theForm.append(id).append(password);
                    theForm.submit();

                    theForm.remove();
                    self.hide();
                }).
                error(function(response){
                    $scope.alertMessage = response.error.message;
                    $scope.alertClass = 'alert-warning';
                }
            );
        };

        $scope.$on('decryptData', function(event, sensitiveData) {
            self.action = 'decrypt';
            self.titleClass = 'text-info';
            self.submitText = 'Decrypt Now';
            self.submitClass = 'btn-info';
            self.submitDisabled = true;
            self.password = '';
            self.sensitiveData = sensitiveData;
            self.show();
        });

        $scope.$on('deleteData', function(event, sensitiveData) {
            self.action = 'delete';
            self.titleClass = 'text-danger';
            self.submitText = 'Delete Now';
            self.submitClass = 'btn-danger';
            self.submitDisabled = true;
            self.password = '';
            self.sensitiveData = sensitiveData;
            self.show();
        });

        $scope.$on('downloadFile', function(event, sensitiveData) {
            self.action = 'download';
            self.titleClass = 'text-info';
            self.submitText = 'Download Now';
            self.submitClass = 'btn-info';
            self.submitDisabled = true;
            self.password = '';
            self.sensitiveData = sensitiveData;
            self.show();
        });
    }]);
})();