<script type="text/javascript">
    var tags = <?=json_encode($tags)?>
</script>

<h3>Tags</h3>
<ul class="list-unstyled" ng-controller="TagsController as tags">
    <li ng-repeat="tag in tags.tags | filter:tags.hasSensitiveData" ng-init="tag.labelClass = 'label-default'">
        <a ng-click="tags.filterSensitiveData(tag)" class="label" ng-class="tag.labelClass">{{tag.name}}</a>
    </li>
</ul>
