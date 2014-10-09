<div class="row">

    <div id="tag-list" class="col-xs-1">
        @include('sensitiveData/angular/tags')
    </div>

    <div class="col-xs-6">
        @include('sensitiveData/angular/sensitive-data-list')
    </div>

    <div class="col-xs-5" ng-controller="SensitiveDataAreaController as sensitiveArea">
        <div class="col-xs-12" ng-hide="show" ng-click="showArea()">
            <button class="btn btn-success input-medium pull-right js-add-new">Add New</button>
        </div>

        <div class="js-sensitive-data-tabs col-xs-12" ng-show="show">
            <!-- Nav tabs -->
            <button type="button" class="close js-close-sensitive-data" ng-click="hideArea()">
                <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
            </button>

            <ul class="nav nav-tabs" role="tablist">
              <li ng-class="{active:isSelectedTab('form')}" ng-click="selectTab('form')">
                  <a href id="edit-sensitive-data-tab">Edit</a>
              </li>
              <li ng-class="{active:isSelectedTab('markdown')}" ng-click="selectTab('markdown')">
                  <a href id="markdown-sensitive-data-tab">Markdown</a>
              </li>
              <li ng-class="{active:isSelectedTab('raw')}" ng-click="selectTab('raw')">
                  <a href id="raw-sensitive-data-tab">Raw</a>
              </li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content">
                <div class="tab-pane" ng-class="{active:isSelectedTab('form')}" id="edit-sensitive-data">
                    <div class="row js-new-form">
                        <div class="col-xs-12">
                            @include('sensitiveData/angular/sensitive-data-form')
                        </div>
                    </div>
                </div>
                <div class="tab-pane" ng-class="{active:isSelectedTab('markdown')}" id="markdown-sensitive-data">
                    <div class="row js-markdown-placeholder">
                        <div class="col-xs-12">
                            @include('sensitiveData/angular/sensitive-data-markdown')
                        </div>
                    </div>
                </div>
                <div class="tab-pane" ng-class="{active:isSelectedTab('raw')}" id="raw-sensitive-data">
                    <div class="row js-raw-placeholder">
                        <div class="col-xs-12">
                            @include('sensitiveData/angular/sensitive-data-raw')
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@include('sensitiveData/angular/password-modal')
