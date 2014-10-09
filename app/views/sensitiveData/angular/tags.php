<h3>Tags</h3>
<ul class="list-unstyled" ng-controller="TagsController">
    <li ng-repeat="tag in tags | filter:hasSensitiveData" ng-init="tag.labelClass = 'label-default'">
        <a ng-click="filterSensitiveData(tag)" class="label" ng-class="tag.labelClass">{{tag.name}}</a>
    </li>
</ul>
