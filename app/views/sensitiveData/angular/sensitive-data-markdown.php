<h2>{{sensitiveData.name}}</h2>
<div btf-markdown="sensitiveData.value"></div>
<a href ng-click="downloadFile()">{{sensitiveData.file}}</a>
<ul class="list-inline">
    <li ng-repeat="tag in sensitiveData.tags">
        <span class="label label-primary">{{tag.name}}</span>
    </li>
</ul>