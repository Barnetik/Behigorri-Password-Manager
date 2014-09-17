$(document).ready(function(){
    var sensitiveData = (function() {
        var baseUrl = $('base').attr('href');

        var sensitiveArea = new function() {
            var self = this;

            this.$el = $('.js-sensitive-data-tabs');

            this.ui = {
                addNewButton: $('.js-add-new'),
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

            this.show = function(tabName) {
                var tabName = tabName || 'edit';
                $('#' + tabName + '-sensitive-data-tab').tab('show');
                this.ui.addNewButton.addClass('hidden');
                this.$el.removeClass('hidden');
            };

            this.hide = function() {
                this.ui.addNewButton.removeClass('hidden');
                this.$el.addClass('hidden');
            };

            this.ui.addNewButton.on('click', function() {
                self.show();
            });

            this.ui.closeButton.on('click', function(){
                newForm.reset();
                self.hide();
            });

            this.init();
        };

        var sensitiveDataList = new function() {
            var self = this;

            this.$el = $('.js-sensitive-data-list');

            this.ui = {
                sampleRow: this.$el.find('.js-sample-data-row')
            };

            this.createRow = function(data) {
                var loggedUser = $('#logged-user').text();
                var newRow = this.ui.sampleRow.clone();

                if (!data.file) {
                    newRow.find('.js-download').remove();
                }

                newRow.attr('id', 'datum-' + data.id);
                newRow.data('datumId', data.id);
                newRow.find('.js-datum-name').html(data.name);
                newRow.find('.js-datum-metadata small').html(data.updated_at + ' (' + loggedUser + ')');
                newRow.find('.js-download,.js-decrypt,.js-delete').data('datumId', data.id)
                newRow.removeClass('.js-sample-data-row').removeClass('hide');

                this.$el.prepend(newRow);

                newRow.find('.js-action-link').tooltip();
            };

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

            // Show decrypt modal
            this.$el.on('click', '.js-decrypt', function(e) {
                var currentButton = $(e.currentTarget);
                var currentElement = $('#datum-' + currentButton.data('datumId'));
                passwordModal.decrypt(currentElement);
            });

            // Show delete modal
            this.$el.on('click', '.js-delete', function(e) {
                var currentButton = $(e.currentTarget);
                var currentElement = $('#datum-' + currentButton.data('datumId'));
                passwordModal.delete(currentElement);
            });

            // Show download modal
            this.$el.on('click', '.js-download', function(e) {
                var currentButton = $(e.currentTarget);
                var currentElement = $('#datum-' + currentButton.data('datumId'));
                passwordModal.download(currentElement);
            });

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
                this.ui.fileLinks.text('').attr('href', '');
                var qqFileList = this.$el.find('ul.qq-upload-list');
                if (qqFileList.length > 0) {
                    qqFileList.html('');
                }
            };

            this.setData = function(sensitiveDatum) {
                this.reset();
                this.ui.idInput.val(sensitiveDatum.id).change();
                this.ui.nameInput.val(sensitiveDatum.name).change();
                this.ui.valueInput.val(sensitiveDatum.value).change();
                this.ui.fileLinks.text(sensitiveDatum.file);
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

            this.submit = function() {
                this.ui.loading.show();
                this.ui.buttons.prop('disabled', true);

                if (self.hasFiles()) {
                    this.ui.fileField.fineUploader('uploadStoredFiles');
                } else {
                    $.post(
                        this.ui.form.attr('action'),
                        this.ui.form.serialize(),
                        self.submitSuccess,
                        'json'
                    ).fail(function(data) {
                        var response = JSON.parse(data.responseText);
                        self.submitError(response);
                    }).always(function(){
                        self.ui.loading.hide();
                        self.ui.buttons.prop('disabled', false);
                    });
                }
            };

            this.$el.on('submit', function(e) {
                e.preventDefault();
                self.submit();
            });

            this.ui.cancelButton.on('click', function() {
                self.reset();
                self.hide();
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

            this.decrypt = function(currentElement) {
                this.action = 'decrypt';
                this.show(currentElement);
            };

            this.delete = function(currentElement) {
                this.action = 'delete';
                this.show(currentElement);
            };

            this.download = function(currentElement) {
                this.action = 'download';
                this.show(currentElement);
            };

            this.show = function(datumElement) {
                var textClass = 'info';
                var submitText = 'Decrypt Now';

                if (this.action === 'delete') {
                    textClass = 'danger';
                    submitText = 'Delete Now';
                }

                if (this.$el.find('.alert')) {
                    this.$el.find('.alert').alert('close');
                }

                if (this.action === 'download') {
                    submitText = 'Download Now';
                }

                this.ui.submitButton.prop('disabled', true);
                this.ui.modalTitle.html('<strong class="text-' + textClass + '">' + this.action + '</strong>' + datumElement.find('.js-datum-name').text());
                this.ui.idField.val(datumElement.data('datumId'));
                this.ui.passwordField.val('');
                this.ui.submitButton.attr('class', 'btn btn-' + textClass + ' js-submit');
                this.ui.submitButton.text(submitText);
                this.$el.modal('show');
                this.$el.on('shown.bs.modal', function() {
                    self.ui.passwordField.focus();
                });
            };

            this.hide = function() {
                this.$el.modal('hide');
            };

            this.ui.passwordField.on('change, keyup', function(e) {
                if ($(this).val() !== '') {
                   self.ui.submitButton.prop('disabled', false);
                } else {
                   self.ui.submitButton.prop('disabled', true);
                }
            });

            this.submit = function() {
                if (self.ui.passwordField.val() !== '') {
                    if (self.$el.find('.alert')) {
                        self.$el.find('.alert').alert('close');
                    }

                    switch (self.action) {
                        case 'delete':
                            self.doDelete();
                            break;
                        case 'download':
                            self.doDownload();
                            break;
                        default:
                            self.doDecrypt();
                            break;
                    }
                }
            };

            this.ui.submitButton.on('click', this.submit);
            this.ui.form.on('submit', function(e) {
                e.preventDefault();
                self.submit();
            });

            this.doDecrypt = function() {
                $.post(
                    baseUrl + '/sensitiveData/decrypt',
                    {
                        id: self.ui.idField.val(),
                        password: self.ui.passwordField.val()
                    },
                    function(data) {
                        newForm.setData(data);
                        newForm.show('markdown');
                        self.hide();
                    },
                    'json'
                ).fail(function(data) {
                    var response = JSON.parse(data.responseText);
                    var alert = new alertMessage();
                    alert.show(response.error.message, self.ui.modalBody);
                });
            };

            this.doDelete = function() {
                $.post(baseUrl + '/sensitiveData/delete', {
                    id: self.ui.idField.val(),
                    password: self.ui.passwordField.val()
                }).done(function(data) {
                    self.hide();
                    $('#datum-' + self.ui.idField.val()).remove();
                }).fail(function(data) {
                    var response = JSON.parse(data.responseText);
                    var alert = new alertMessage();
                    alert.show(response.error.message, self.ui.modalBody);
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
                    var response = JSON.parse(data.responseText);
                    var alert = new alertMessage();
                    alert.show(response.error.message, self.ui.modalBody);
                });
            };
        };

        var alertMessage = function(severity) {
            var self = this;
            var severity = severity || 'warning';

            var alertWrapper = $('<div />').addClass('alert alert-' + severity + ' alert-dismissable fade in');
            alertWrapper.append(
                $('<button data-dismiss="alert"/>').attr('type', 'button').addClass('close').prop('aria-hidden', true).text("x")
            );

            this.show = function(message, context, timeout) {
                if (context.find('.alert').length > 0) {
                    context.find('.alert').alert('close');
                }
                alertWrapper.append(message);
                context.prepend(alertWrapper);
                alertWrapper.alert();

                if (timeout) {
                    setTimeout(
                        function() {
                            alertWrapper.alert('close');
                        },
                        timeout
                    );
                }
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