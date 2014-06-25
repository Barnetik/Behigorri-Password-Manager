$(document).ready(function(){
    var baseUrl = $('base').attr('href');
    
    var showAlert = function(message, context) {
        var alertWrapper = $('<div />').addClass('alert alert-warning alert-dismissable fade in');
        alertWrapper.append(
            $('<button />').attr('type', 'button').addClass('close').data('dismiss', 'alert').prop('aria-hidden', true).text("x")
        );
        alertWrapper.append(message);
        context.prepend(alertWrapper);
//        setTimeout(function() {
//            alertWrapper.alert('close');
//        }, 5000);
    };
    
    var idField = $('.js-decrypt-modal input[name=id]');
    var passwordField = $('.js-decrypt-modal input[name=password]');
    var submitButton = $('.js-decrypt-modal .js-submit');
    var modal = $('.js-decrypt-modal');

    $('.js-decrypt').click(function(e) {
        var currentButton = $(e.currentTarget);
        var currentElement = $('#datum-' + currentButton.data('datumId'));
        modal.find('.modal-title').text(currentElement.find('.js-datum-name').text());
        idField.val(currentButton.data('datumId'));
        passwordField.val('');
        modal.modal('show');
    });

    passwordField.on('change, keyup', function(e) {
        var input = $(e.currentTarget);
        if (input.val() !== '') {
           submitButton.prop('disabled', false);
        } else {
           submitButton.prop('disabled', true);
        }
    });
   
    submitButton.click(function() {
        if (passwordField.val() !== '') {
            if (modal.find('.alert')) {
                modal.find('.alert').alert('close');
            }
            $.post(baseUrl + '/decrypt', {
                id: idField.val(),
                password: passwordField.val()
            }).done(function(data) {
                var sensitiveDatum = JSON.parse(data);
                newForm.find('.js-form-id').val(sensitiveDatum.id);
                newForm.find('.js-form-name').val(sensitiveDatum.name);
                newForm.find('.js-form-value').val(sensitiveDatum.value);
                showNewForm();
                modal.modal('hide');
            }).fail(function(data) {
                var response = JSON.parse(data.responseText);
                showAlert(response.error.message, modal.find('.modal-body'));
            });
        }
    });
    
    
    var addNewButton = $('.js-add-new');
    var newForm = $('.js-new-form');
    addNewButton.click(function() {
        showNewForm();
    });

    var addNewCancelButton = $('.js-add-new-cancel');
    addNewCancelButton.click(function(e) {
        resetNewForm();
        hideNewForm();
    });
    
    var showNewForm = function() {
        addNewButton.addClass('hidden');
        newForm.removeClass('hidden');
    };
    
    var hideNewForm = function() {
        newForm.addClass('hidden');
        addNewButton.removeClass('hidden');
    };
    
    var resetNewForm = function() {
        newForm.find('input,textarea').val('');
    };
});