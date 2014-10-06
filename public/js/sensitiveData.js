(function() {
    var app = angular.module('Behigorri', ['ngTagsInput']);

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

    app.controller('SensitiveDataListController', ['$scope', '$filter', 'PasswordModalService', function($scope, $filter, PasswordModalService) {
        var self = this;
        this.data = sensitiveData;
        this.origData = sensitiveData;

        this.filterTags = [];

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
                    self.data[key] = sensitiveData;
                    found = true;
                }
            });
            if (!found) {
                self.origData.push(sensitiveData);
            }
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

    app.controller('SensitiveDataAreaController', ['$http', '$scope', 'SensitiveDataService', function($http, $scope, sensitiveDataService) {
        var self = this;

        this.baseUrl = angular.element('base').attr('href');
        this.selectedTab = 'form';
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

        this.submitData = function($event) {
            $event.preventDefault();
            $scope.alertMessage = '';

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
                });
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

$(document).ready(function(){
    $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        if (jqxhr.status === 401) {
            window.location = $('base').attr('href') + '/login';
        }
    });
    var sensitiveData = (function() {
        var baseUrl = $('base').attr('href');

        var sensitiveArea = new function() {
            var self = this;

            this.$el = $('.js-sensitive-data-tabs');

            this.ui = {
                closeButton: this.$el.find('.js-close-sensitive-data')
            };

            this.init = function() {
                if (this.hasErrors()) {
                    this.show();
                }
            };

            this.hasErrors = function() {
                return this.$el.find('.has-error').length > 0;
            };

            this.init();
        };

        var sensitiveDataList = new function() {
            var self = this;

            this.$el = $('.js-sensitive-data-list');

            this.updateRow = function(data) {
                var loggedUser = $('#logged-user').text();
                var currentRow = this.$el.find('#datum-' + data.id);
                currentRow.find('.js-datum-name').html(data.name);
                currentRow.find('.js-datum-metadata small').html(data.updated_at + ' (' + loggedUser + ')');
                if (data.file) {
                    if (currentRow.find('.js-download').length === 0) {
                        var downloadLink = this.ui.sampleRow.find('.js-download').clone();
                        downloadLink.data('datumId', data.id);
                        currentRow.find('.js-action-links').prepend(downloadLink);
                    }
                }
            };

            $('.js-action-link').tooltip();
        };

        var newForm = new function() {
            var self = this;

            this.$el = $('.js-new-form');

            this.hasFiles = false;

            this.ui = {
                form: this.$el.find('form'),
                loading: this.$el.find('.js-add-new-buttons .fa-spinner'),
                buttons: this.$el.find('input:submit,input:reset'),
                sendButton: this.$el.find('.js-add-new-send'),
                cancelButton: this.$el.find('.js-add-new-cancel'),
                fields: this.$el.find('input,textarea').not('input:submit,input:reset'),
                idInput: this.$el.find('.js-form-id'),
                nameInput: this.$el.find('.js-form-name'),
                tagsField: this.$el.find('#tags'),
                valueInput: this.$el.find('.js-form-value'),
                fileLinks: $(this.$el.parents('.tab-content')[0]).find('.js-file-link'),
                alertBox: this.$el.find('.js-alert-box'),
                fileField: $('#form-fineupload')
            };

            this.show = function(tabName) {
                sensitiveArea.show(tabName);
            };

            this.hide = function() {
                sensitiveArea.hide();
            };

            this.reset = function() {
                this.ui.fields.val('').change();
                this.ui.tagsField.tagsinput('removeAll');
                this.ui.fileLinks.text('').attr('href', '');
                var qqFileList = this.$el.find('ul.qq-upload-list');
                if (qqFileList.length > 0) {
                    qqFileList.html('');
                }
            };

            this.ui.loading.hide = function() {
                if (!self.ui.loading.hasClass('hide')) {
                    self.ui.loading.addClass('hide');
                }
            };

            this.ui.loading.show = function() {
                if (self.ui.loading.hasClass('hide')) {
                    self.ui.loading.removeClass('hide');
                }
            };

            this.hasFiles = function() {
                return self.ui.fileField.fineUploader('getUploads').length > 0;
            };

            this.submitSuccess = function(data) {
                if (data.success) {
                    var alert = new alertMessage('success');
                    if (self.ui.idInput.val()) {
                        alert.show('Data updated', self.ui.alertBox, 3000);
                        sensitiveDataList.updateRow(data);
                    } else  {
                        alert.show('New data created', self.ui.alertBox, 3000);
                        self.ui.idInput.val(data.id);
                        sensitiveDataList.createRow(data);
                    }
                    if (data.file) {
                       self.ui.fileLinks.text(data.file);
                    }
                }
            };

            this.submitError = function(response) {
                var alert = new alertMessage();
                alert.show(response.error.message, self.ui.alertBox, 3000);
            };

            this.ui.fileField.fineUploader({
                multiple: false,
                form: {
                    interceptSubmit: false
                },
                validation: {
                    sizeLimit: 15000000
                }
            }).on('error', function(event, id, name, errorReason, response){
                console.log(event, id, name, errorReason, response);
                self.submitError(response);
                self.ui.fileField.fineUploader('reset');
                self.ui.loading.hide();
                self.ui.buttons.prop('disabled', false);
            }).on('complete', function(event, id, name, data){
                self.submitSuccess(data);
                self.ui.fileField.fineUploader('reset');
                self.ui.loading.hide();
                self.ui.buttons.prop('disabled', false);
            });

            this.ui.fileLinks.click(function(e) {
                e.preventDefault();
                var currentElement = $('#datum-' + self.ui.idInput.val());
                passwordModal.download(currentElement);
            });

        };

        var passwordModal = new function() {
            var self = this;

            this.action = 'decrypt';

            this.$el = $('.js-decrypt-modal');

            this.ui = {
                idField: this.$el.find('input[name=id]'),
                passwordField: this.$el.find('input[name=password]'),
                submitButton: this.$el.find('.js-submit'),
                modalTitle: this.$el.find('.modal-title'),
                modalBody: this.$el.find('.modal-body'),
                form: this.$el.find('form')
            };

            this.submit = function() {
                if (self.ui.passwordField.val() !== '') {
                    switch (self.action) {
                        case 'delete':
                            self.doDelete();
                            break;
                        case 'download':
                            self.doDownload();
                            break;
                    }
                }
            };

            this.doDelete = function() {
                $.post(baseUrl + '/sensitiveData/delete', {
                    id: self.ui.idField.val(),
                    password: self.ui.passwordField.val()
                }).done(function(data) {
                    self.hide();
                    $('#datum-' + self.ui.idField.val()).remove();
                }).fail(function(data) {
                    try {
                        var response = JSON.parse(data.responseText);
                        var alert = new alertMessage();
                        alert.show(response.error.message, self.ui.modalBody);
                    } catch(err) {}
                });
            };

            this.doDownload = function() {
                // We decrypt just to check that password is ok.
                $.post(baseUrl + '/sensitiveData/decrypt', {
                    id: self.ui.idField.val(),
                    password: self.ui.passwordField.val()
                }).done(function(data) {
                    // Create new form and make the request. We cannot download files via ajax :(
                    // We also need to append this to the DOM to make it work in firefox
                    var theForm = $('<form />');
                    $('body').append(theForm);
                    theForm.attr('action', baseUrl + '/sensitiveData/download');
                    theForm.attr('method', 'post');
                    theForm.hide();

                    var id = $('<input />').attr('name', 'id').val(self.ui.idField.val());
                    var password = $('<input />').attr('name', 'password').val(self.ui.passwordField.val());
                    theForm.append(id).append(password);
                    theForm.submit();

                    theForm.remove();
                    self.hide();
                }).fail(function(data) {
                    try {
                        var response = JSON.parse(data.responseText);
                        var alert = new alertMessage();
                        alert.show(response.error.message, self.ui.modalBody);
                    } catch(err) {}
                });
            };
        };

        var markdownPlaceholder = new function() {
            var self = this;

            this.$el = $('.js-markdown-placeholder');

            this.ui = {
                'title': this.$el.find('.js-markdown-title'),
                'body': this.$el.find('.js-markdown-body')
            };

            newForm.ui.nameInput.on('change', function() {
                self.ui.title.html($(this).val());
            });

            newForm.ui.valueInput.on('change', function() {
                self.ui.body.html(markdown.toHTML($(this).val()));
            });
        };

        var rawPlaceholder = new function() {
            var self = this;

            this.$el = $('.js-raw-placeholder');

            this.ui = {
                'title': this.$el.find('.js-raw-title'),
                'body': this.$el.find('.js-raw-body')
            };

            newForm.ui.nameInput.on('change', function() {
                self.ui.title.html($(this).val());
            });

            newForm.ui.valueInput.on('change', function() {
                self.ui.body.html($(this).val());
            });
        };
    })();
});