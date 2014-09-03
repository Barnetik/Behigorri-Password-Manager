$(document).ready(function(){
    var sensitiveData = (function() {
        var baseUrl = $('base').attr('href');

        var sensitiveArea = new function() {
            var self = this;

            this.$el = $('.js-sensitive-data-tabs');

            this.ui = {
                addNewButton: $('.js-add-new'),
                closeButton: this.$el.find('.js-close-sensitive-data'),
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

        var newForm = new function() {
            var self = this;

            this.$el = $('.js-new-form');

            this.ui = {
                cancelButton: this.$el.find('.js-add-new-cancel'),
                fields: this.$el.find('input,textarea'),
                idInput: this.$el.find('.js-form-id'),
                nameInput: this.$el.find('.js-form-name'),
                valueInput: this.$el.find('.js-form-value'),
            };

            this.ui.cancelButton.on('click', function() {
                self.reset();
                self.hide();
            });

            this.show = function(tabName) {
                sensitiveArea.show(tabName);
            };

            this.hide = function() {
                sensitiveArea.hide();
            };

            this.reset = function() {
                this.ui.fields.val('').change();
                $('.js-file-link').text('').attr('href', '');
            };

            this.setData = function(sensitiveDatum) {
                this.ui.idInput.val(sensitiveDatum.id).change();
                this.ui.nameInput.val(sensitiveDatum.name).change();
                this.ui.valueInput.val(sensitiveDatum.value).change();
                $('.js-file-link').text(sensitiveDatum.file);
            };

            $('.js-file-link').on('click', function() {
                var currentElement = $('#datum-' + self.ui.idInput.val());
                passwordModal.download(currentElement);
                return false;
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

                if (this.action == 'delete') {
                    textClass = 'danger';
                    submitText = 'Delete Now';
                }

                if (this.$el.find('.alert')) {
                    this.$el.find('.alert').alert('close');
                }

                if (this.action == 'download') {
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
                $.post(baseUrl + '/sensitiveData/decrypt', {
                    id: self.ui.idField.val(),
                    password: self.ui.passwordField.val()
                }).done(function(data) {
                    var sensitiveDatum = JSON.parse(data);
                    newForm.setData(sensitiveDatum);
                    newForm.show('markdown');
                    self.hide();
                }).fail(function(data) {
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
                    var theForm = $('<form />');
                    theForm.attr('action', baseUrl + '/sensitiveData/download');
                    theForm.attr('method', 'post');

                    var id = $('<input />').attr('name', 'id').val(self.ui.idField.val());;
                    var password = $('<input />').attr('name', 'password').val(self.ui.passwordField.val());;
                    theForm.append(id).append(password);

                    theForm.submit();
                    self.hide();
                }).fail(function(data) {
                    var response = JSON.parse(data.responseText);
                    var alert = new alertMessage();
                    alert.show(response.error.message, self.ui.modalBody);
                });
            };
        };

        var alertMessage = function() {
            var self = this;

            this.alertWrapper = $('<div />').addClass('alert alert-warning alert-dismissable fade in');
            this.alertWrapper.append(
                $('<button data-dismiss="alert"/>').attr('type', 'button').addClass('close').prop('aria-hidden', true).text("x")
            );

            this.show = function(message, context) {
                this.alertWrapper.append(message);
                context.prepend(this.alertWrapper);
                this.alertWrapper.alert();
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

        // Show decrypt modal
        $('.js-decrypt').click(function(e) {
            var currentButton = $(e.currentTarget);
            var currentElement = $('#datum-' + currentButton.data('datumId'));
            passwordModal.decrypt(currentElement);
        });

        // Show decrypt modal
        $('.js-delete').click(function(e) {
            var currentButton = $(e.currentTarget);
            var currentElement = $('#datum-' + currentButton.data('datumId'));
            passwordModal.delete(currentElement);
        });

    })();
});