
<?=Form::open(array(
    'method' => 'post',
    'files' => true,
    'id' => 'qq-form',
    'novalidate' => true,
    'ng-submit' => 'submitData($event)',
    'action' => 'sensitiveData'
)) ?>
    <fieldset ng-disabled="isSaving">
        <?=Form::input(
            'hidden',
            'id',
            null,
            array(
                'class' => 'js-form-id',
                'ng-value' => 'sensitiveData.id'
            )
        )?>
        <div class="row">
            <div class="js-alert-box col-xs-12">
                <div ng-show="alertMessage" ng-repeat="message in alertMessage" class="alert {{alertClass}} alert-dismissible">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    {{message}}
                </div>
            </div>
        </div>
        <div class="form-group">
            <?=Form::input(
                'text',
                'name',
                null,
                array(
                    'class' => 'form-control js-form-name',
                    'placeholder' => 'Name',
                    'ng-model' => 'sensitiveData.name'
                )
            )?>
        </div>
        <div class="form-group">
            <?=Form::textarea('value', null,
                    array(
                        'class' => 'form-control js-form-value',
                        'placeholder' => 'Sensitive data',
                        'rows' => '15',
                        'ng-model' => 'sensitiveData.value'
                    )
            )?>
        </div>
        <div class="form-group">
            <tags-input ng-model="sensitiveData.tags" display-property="name">
                <auto-complete source="getAvailableTags($query)" min-length="1"></auto-complete>
            </tags-input>
        </div>
        <div class="form-group">
            <p>
                <a href ng-click="downloadFile()">{{sensitiveData.file}}</a>
            </p>
        </div>
        <div id="form-fineupload"></div>
        <div class="form-group js-add-new-buttons">
            <input type="submit" class="btn btn-primary input-medium pull-right js-add-new-send" value="Send" />
            <input type="reset" ng-click="hideArea()" class="btn btn-warning input-medium pull-right js-add-new-cancel" />
            <i class="fa fa-spinner fa-spin hide pull-right"></i>
        </div>
    </fieldset>
<?=Form::close() ?>