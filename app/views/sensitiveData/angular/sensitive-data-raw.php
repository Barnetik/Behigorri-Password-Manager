<h2>{{sensitiveData.name}}</h2>
<div><pre>{{sensitiveData.value}}</pre></div>
<a href ng-click="downloadFile()">{{sensitiveData.file}}</a>
<ul class="list-inline">
    <li ng-repeat="tag in sensitiveData.tags">
        <span class="label label-primary">{{tag.name}}</span>
    </li>
</ul>