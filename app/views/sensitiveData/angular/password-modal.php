<div class="modal fade js-decrypt-modal" ng-controller="PasswordModalController">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">
            <strong ng-class="titleClass">{{action}}</strong>
            {{sensitiveData.name}}
        </h4>
      </div>
      <form novalidate ng-submit="performAction()">
        <div class="modal-body">
            <div ng-show="alertMessage" class="alert alert-warning alert-dismissable">
                <button data-dismiss="alert" type="button" class="close" aria-hidden>x</button>
                {{alertMessage}}
            </div>
            <input type="hidden" name="id" ng-value="sensitiveData.id"/>
            <input ng-model="password" ng-change="checkSubmitable()" type="password" name="password" placeholder="password" class="form-control js-password"/>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <input type="submit" class="btn" ng-class="submitClass" ng-disabled="submitDisabled" value="{{submitText}}" />
        </div>
      </form>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->