$(document).ready(function(){
    var sensitiveData = (function() {
        var baseUrl = $('base').attr('href');

        var newForm = new function() {
            var self = this;
            
            this.$el = $('.js-new-form');

            this.ui = {
                addNewButton: $('.js-add-new'),
                cancelButton: this.$el.find('.js-add-new-cancel'),
                fields: this.$el.find('input,textarea'),
                idInput: this.$el.find('.js-form-id'),
                nameInput: this.$el.find('.js-form-name'),
                valueInput: this.$el.find('.js-form-value')
            };

            this.ui.addNewButton.on('click', function() {
                self.show();
            });

            this.ui.cancelButton.on('click', function() {
                self.reset();
                self.hide();
            });

            this.show = function() {
                this.$el.removeClass('hidden');
                this.ui.addNewButton.addClass('hidden');
            };

            this.hide = function() {
                this.$el.addClass('hidden');
                this.ui.addNewButton.removeClass('hidden');
            };

            this.reset = function() {
                this.ui.fields.val('');
            };

            this.setData = function(sensitiveDatum) {
                this.ui.idInput.val(sensitiveDatum.id).change();
                this.ui.nameInput.val(sensitiveDatum.name).change();
                this.ui.valueInput.val(sensitiveDatum.value).change();  
            };
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
                modalBody: this.$el.find('.modal-body')
            };
            
            this.decrypt = function(currentElement) {
                this.action = 'decrypt';
                this.show(currentElement);
            };
            
            this.delete = function(currentElement) {
                this.action = 'delete';
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

                this.ui.submitButton.prop('disabled', true);
                this.ui.modalTitle.html('<strong class="text-' + textClass + '">' + this.action + '</strong>' + datumElement.find('.js-datum-name').text());
                this.ui.idField.val(datumElement.data('datumId'));
                this.ui.passwordField.val('');
                this.ui.submitButton.attr('class', 'btn btn-' + textClass + ' js-submit');
                this.ui.submitButton.text(submitText);
                this.$el.modal('show');
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

            this.ui.submitButton.on('click', function() {
                if (self.ui.passwordField.val() !== '') {
                    if (self.$el.find('.alert')) {
                        self.$el.find('.alert').alert('close');
                    }

                    if (self.action == 'delete') {
                        self.doDelete();
                    } else {
                        self.doDecrypt();
                    }
                }
            });
            
            this.doDecrypt = function() {
                $.post(baseUrl + '/sensitiveData/decrypt', {
                    id: self.ui.idField.val(),
                    password: self.ui.passwordField.val()
                }).done(function(data) {
                    var sensitiveDatum = JSON.parse(data);
                    newForm.setData(sensitiveDatum);
                    newForm.show();
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
                console.log(self.ui.body);
                self.ui.body.html(markdown.toHTML($(this).val()));
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