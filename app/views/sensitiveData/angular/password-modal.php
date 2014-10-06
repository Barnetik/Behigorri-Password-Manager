<div class="modal fade js-decrypt-modal" ng-controller="PasswordModalController as passwordModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">
            <strong ng-class="passwordModal.titleClass">{{passwordModal.action}}</strong>
            {{passwordModal.sensitiveData.name}}
        </h4>
      </div>
      <form novalidate ng-submit="passwordModal.performAction()">
        <div class="modal-body">
            <div ng-show="alertMessage" class="alert alert-warning alert-dismissable">
                <button data-dismiss="alert" type="button" class="close" aria-hidden>x</button>
                {{alertMessage}}
            </div>
            <input type="hidden" name="id" ng-value="passwordModal.sensitiveData.id"/>
            <input ng-model="passwordModal.password" ng-change="passwordModal.checkSubmitable()" type="password" name="password" placeholder="password" class="form-control js-password"/>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <input type="submit" class="btn" ng-class="passwordModal.submitClass" ng-disabled="passwordModal.submitDisabled" value="{{passwordModal.submitText}}" />
        </div>
      </form>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->