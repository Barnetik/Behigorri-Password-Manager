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

    app.config(['$httpProvider', '$provide', function($httpProvider, $provide) {
        $httpProvider.interceptors.push('SessionTimeoutInterceptor');
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    }]);

    app.factory('baseUrl', function($rootScope) {
        return angular.element('base').attr('href');
    });

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

    app.factory('SensitiveDataService', ['$rootScope', '$http', '$filter', 'baseUrl', function($rootScope, $http, $filter, baseUrl) {
        var self = this;
        this.origData = [];
        this.data = [];
        this.filterTags = [];
        this.query = '';

        this.updateData = function() {
            $rootScope.$broadcast('updateSensitiveDataList', self.data);
        };

        var service = {};

        service.initData = function() {
            $http.get(baseUrl + '/sensitiveData/list').success(function(data) {
                self.origData = data;
                self.data = data;
                self.updateData();
            });
        };

        this.filterData = function() {

            //Tags
            if (self.filterTags.length === 0) {
                self.data = self.origData;
            } else {
                self.data = $filter('filter')(self.origData, function(value) {
                    for (var filterIndex in self.filterTags) {
                        for (var valueIndex in value.tags) {
                            if (value.tags[valueIndex].id === self.filterTags[filterIndex].id) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
            }

            //Query
            if (self.query.trim().length > 0) {
                self.data = $filter('filter')(self.data, function(value) {
                    return value.name.toLowerCase().indexOf(self.query.trim().toLowerCase()) >= 0;
                });
            }

            self.updateData();
        };

        service.filterByQuery = function(query) {
            self.query = query;
            self.filterData();
        };

        service.filterByTag = function(tag) {
            if (tag.filter) {
                self.filterTags.push(tag);
            } else {
                var tagIndex = self.filterTags.indexOf(tag);
                self.filterTags.splice(tagIndex, 1);
            }
            self.filterData();
        };

        service.updateListData = function(sensitiveData) {
            $rootScope.$broadcast('updateListData', sensitiveData);
        };

        return service;
    }]);

    app.controller('TagsController',
    ['$scope', '$http', 'baseUrl', 'SensitiveDataService',
    function($scope, $http, baseUrl, SensitiveDataService) {
        var self = this;
        $scope.tags = [];

        this.initData = function() {
            $http.get(baseUrl + '/tags').success(function(data) {
                angular.forEach(data, function(tag) {
                    tag.filter = false;
                });
                $scope.tags = data;
            });
        };
        this.initData();

        $scope.hasSensitiveData = function(tag) {
            return tag.sensitive_data.length > 0
        };

        $scope.filterSensitiveData = function(tag) {
            tag.filter = !tag.filter;
            if (tag.filter) {
                tag.labelClass = 'label-primary';
            } else {
                tag.labelClass = 'label-default';
            }

            SensitiveDataService.filterByTag(tag);
        };

        $scope.$on('dataDeleted', function() {
            self.initData();
        });

    }]);

    app.controller('SensitiveDataListController',
    ['$scope', '$http',  '$filter', '$element', 'baseUrl', 'PasswordModalService', 'SensitiveDataService',
    function($scope, $http, $filter, $element, baseUrl, PasswordModalService, SensitiveDataService) {

        $scope.data = [];
        $scope.filterTags = [];

        $($element).find('.js-action-link').tooltip();

        SensitiveDataService.initData();

        $scope.$on('updateSensitiveDataList', function(event, data) {
            $scope.data = data;
        });

        $scope.decryptData = function(sensitiveData) {
            PasswordModalService.decryptData(sensitiveData);
        };

        $scope.deleteData = function(sensitiveData) {
            PasswordModalService.deleteData(sensitiveData);
        };

        $scope.downloadFile = function(sensitiveData) {
            PasswordModalService.downloadFile(sensitiveData);
        };

        $scope.$on('updateListData', function(event, sensitiveData) {
            var found = false;
            angular.forEach($scope.data, function(data, key) {
                if (data.id === sensitiveData.id) {
                    $scope.data[key] = sensitiveData;
                    found = true;
                }
            });
            if (!found) {
                $scope.data.push(sensitiveData);
            }
        });

        $scope.$on('dataDeleted', function(event, sensitiveData) {
            angular.forEach($scope.origData, function(data, key) {
                if (data.id === sensitiveData.id) {
                    $scope.origData.splice(key, 1);
                }
            });
            angular.forEach($scope.data, function(data, key) {
                if (data.id === sensitiveData.id) {
                    $scope.data.splice(key, 1);
                }
            });
        });
    }]);

    app.controller('SensitiveDataAreaController',
    ['$http', '$scope', '$element', 'baseUrl', 'SensitiveDataService', 'PasswordModalService',
    function($http, $scope, $element, baseUrl, sensitiveDataService, passwordModalService) {
        var fileField = $($element).find('#form-fineupload');

        $scope.selectedTab = 'form';
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

        $scope.isSelectedTab = function(tabName) {
            return $scope.selectedTab === tabName;
        };

        $scope.selectTab = function(tabName) {
            $scope.selectedTab = tabName;
        };

        $scope.getAvailableTags = function(query) {
            return $http.get(baseUrl + '/tags/search?query=' + query);
        };

        $scope.downloadFile = function() {
            passwordModalService.downloadFile($scope.sensitiveData);
        };

        $scope.hasFiles = function() {
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
            if ($scope.hasFiles()) {
                fileField.fineUploader('uploadStoredFiles');
            } else {
                $http.post(
                    baseUrl + '/sensitiveData',
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

    app.controller('SensitiveDataSearchController', ['$scope', '$http', 'baseUrl', 'SensitiveDataService', function($scope, $http, baseUrl, sensitiveDataService) {
        $scope.query = '';

        $scope.search = function() {
            sensitiveDataService.filterByQuery($scope.query);
        };

        $scope.submitSearch = function($event) {
            $event.preventDefault();
            $scope.search();
        };
    }]);

    app.controller('PasswordModalController', ['$scope', '$element', '$http', 'baseUrl', 'PasswordModalService', function($scope, $element, $http, baseUrl, passwordModalService) {
        $scope.$el = $($element);
        $scope.action = '';
        $scope.titleClass = 'text-info';
        $scope.submitClass = 'btn-info';
        $scope.submitText = 'Decrypt Now';
        $scope.submitDisabled = true;
        $scope.password = '';
        $scope.sensitiveData = {};

        $scope.alertMessage = '';
        $scope.alertClass = 'alert-warning';

        $scope.checkSubmitable = function(value) {
            if ($scope.password.length > 0) {
                $scope.submitDisabled = false;
            } else {
                $scope.submitDisabled = true;
            }
        };

        $scope.show = function() {
            $scope.$el.modal('show');
            $scope.$el.on('shown.bs.modal', function() {
                $scope.$el.find('input.js-password').focus();
            });
            $scope.alertMessage = '';
            };

        $scope.hide = function() {
            $scope.$el.modal('hide');
        };

        $scope.performAction = function() {
            switch ($scope.action) {
                case 'decrypt':
                    $scope.decrypt();
                    break;
                case 'delete':
                    $scope.delete();
                    break;
                case 'download':
                    $scope.download();
                    break;
            }
        };

        $scope.decrypt = function() {
            $http.post(
                    baseUrl + '/sensitiveData/decrypt',
                    {
                        id: $scope.sensitiveData.id,
                        password: $scope.password
                    }
                ).
                success(function(data) {
                    passwordModalService.dataDecrypted(data);
                    $scope.hide();
                }).
                error(function(response){
                    $scope.alertMessage = response.error.message;
                    $scope.alertClass = 'alert-warning';
                }
            );
        };

        $scope.delete = function() {
            $http.post(
                    baseUrl + '/sensitiveData/delete',
                    {
                        id: $scope.sensitiveData.id,
                        password: $scope.password
                    }
                ).
                success(function(data) {
                    passwordModalService.dataDeleted($scope.sensitiveData);
                    $scope.hide();
                }).
                error(function(response){
                    $scope.alertMessage = response.error.message;
                    $scope.alertClass = 'alert-warning';
                }
            );
        };

        $scope.download = function() {
            $http.post(
                    baseUrl + '/sensitiveData/decrypt',
                    {
                        id: $scope.sensitiveData.id,
                        password: $scope.password
                    }
                ).
                success(function(data) {
                    // TODO: This seems a little "ugly", try to do it better and without jquery
                    var theForm = $('<form />');
                    $('body').append(theForm);
                    theForm.attr('action', baseUrl + '/sensitiveData/download');
                    theForm.attr('method', 'post');
                    theForm.hide();

                    var id = $('<input />').attr('name', 'id').val($scope.sensitiveData.id);
                    var password = $('<input />').attr('name', 'password').val($scope.password);
                    theForm.append(id).append(password);
                    theForm.submit();

                    theForm.remove();
                    $scope.hide();
                }).
                error(function(response){
                    $scope.alertMessage = response.error.message;
                    $scope.alertClass = 'alert-warning';
                }
            );
        };

        $scope.$on('decryptData', function(event, sensitiveData) {
            $scope.action = 'decrypt';
            $scope.titleClass = 'text-info';
            $scope.submitText = 'Decrypt Now';
            $scope.submitClass = 'btn-info';
            $scope.submitDisabled = true;
            $scope.password = '';
            $scope.sensitiveData = sensitiveData;
            $scope.show();
        });

        $scope.$on('deleteData', function(event, sensitiveData) {
            $scope.action = 'delete';
            $scope.titleClass = 'text-danger';
            $scope.submitText = 'Delete Now';
            $scope.submitClass = 'btn-danger';
            $scope.submitDisabled = true;
            $scope.password = '';
            $scope.sensitiveData = sensitiveData;
            $scope.show();
        });

        $scope.$on('downloadFile', function(event, sensitiveData) {
            $scope.action = 'download';
            $scope.titleClass = 'text-info';
            $scope.submitText = 'Download Now';
            $scope.submitClass = 'btn-info';
            $scope.submitDisabled = true;
            $scope.password = '';
            $scope.sensitiveData = sensitiveData;
            $scope.show();
        });
    }]);
})();
