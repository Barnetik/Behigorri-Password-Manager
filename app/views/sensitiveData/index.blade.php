
<div class="row">
    <div class="col-xs-7">

        <table class="table table-striped table-hover js-sensitive-data-list">
            <thead>
                <tr>
                    <th class="col-xs-5">Description</th>
                    <th class="col-xs-4 text-right">Last update</th>
                    <th class="col-xs-3"></th>
                </tr>
            </thead>
            <tbody>
                <tr data-datum-id=":id" class="hide js-sample-data-row">
                    <td class="col-xs-5 js-datum-name">
                        :name
                    </td>
                    <td class="col-xs-4 text-right js-datum-metadata">
                        <small>:updated-at (:username)</small>
                    </td>
                    <td class="col-xs-3 text-right js-action-links">
                        <span title="download attatched file" data-toggle="tooltip" class="js-download fa-stack fa-lg js-action-link" data-datum-id=":id">
                            <i class="fa fa-circle-o fa-stack-2x"></i>
                            <i class="fa fa-download fa-stack-1x"></i>
                        </span>
                        <span title="decrypt" class="js-decrypt fa-stack fa-lg js-action-link" data-datum-id=":id">
                            <i class="fa fa-circle-o fa-stack-2x"></i>
                            <i class="fa fa-unlock-alt fa-stack-1x"></i>
                        </span>
                        <span title="delete" class="js-delete fa-stack fa-lg js-action-link" data-datum-id=":id">
                            <i class="fa fa-circle-o fa-stack-2x"></i>
                            <i class="fa fa-times fa-stack-1x"></i>
                        </span>
                    </td>
                </tr>
                @foreach ($sensitiveData as $datum)
                <tr id="datum-{{{ $datum->id }}}" data-datum-id="{{{ $datum->id }}}">
                    <td class="col-xs-5 js-datum-name">
                        {{{ $datum->name }}}
                    </td>
                    <td class="col-xs-4 text-right">
                        <small>{{{ $datum->updated_at }}} ({{{ $datum->user->username }}})</small>
                    </td>
                    <td class="col-xs-3 text-right js-action-links">
                        @if ($datum->file)
                            <span title="download attatched file" data-toggle="tooltip" class="js-download fa-stack fa-lg js-action-link" data-datum-id="{{{ $datum->id }}}">
                                <i class="fa fa-circle-o fa-stack-2x"></i>
                                <i class="fa fa-download fa-stack-1x"></i>
                            </span>
                        @endif
                        <span title="decrypt" class="js-decrypt fa-stack fa-lg js-action-link" data-datum-id="{{{ $datum->id }}}">
                            <i class="fa fa-circle-o fa-stack-2x"></i>
                            <i class="fa fa-unlock-alt fa-stack-1x"></i>
                        </span>
                        <span title="delete" class="js-delete fa-stack fa-lg js-action-link" data-datum-id="{{{ $datum->id }}}">
                            <i class="fa fa-circle-o fa-stack-2x"></i>
                            <i class="fa fa-times fa-stack-1x"></i>
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

    </div>

    <div class="col-xs-5">
        <div class="row">
            <button class="btn btn-success input-medium pull-right js-add-new">Add New</button>
        </div>

        <div class="js-sensitive-data-tabs hidden col-xs-12">
            <!-- Nav tabs -->
            <button type="button" class="close js-close-sensitive-data"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>

            <ul class="nav nav-tabs" role="tablist">
              <li class="active"><a href="#edit-sensitive-data" role="tab" data-toggle="tab" id="edit-sensitive-data-tab">Edit</a></li>
              <li><a href="#markdown-sensitive-data" role="tab" data-toggle="tab" id="markdown-sensitive-data-tab">Markdown</a></li>
              <li><a href="#raw-sensitive-data" role="tab" data-toggle="tab" id="raw-sensitive-data-tab">Raw</a></li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content">
                <div class="tab-pane active" id="edit-sensitive-data">
                    <div class="row js-new-form">
                        <div class="col-xs-12">
                            {{ Form::open(array('method' => 'post', 'files' => true, 'id' => 'qq-form')) }}
                                {{ Form::input('hidden', 'id', null, array('class' => 'js-form-id')) }}
                                <div class="row">
                                    <div class="js-alert-box col-xs-12"></div>
                                </div>
                                <div class="form-group">
                                    {{ Form::input('text', 'name', null, array('class' => 'form-control js-form-name', 'placeholder' => 'Name'))}}
                                    {{ Form::errorMsg($validator, 'name')}}
                                </div>
                                <div class="form-group">
                                    {{ Form::textarea('value', null, array('class' => 'form-control js-form-value', 'placeholder' => 'Sensitive data', 'rows' => '15'))}}
                                    {{ Form::errorMsg($validator, 'value')}}
                                </div>
                                <div class="form-group">
                                    <p>
                                        <a href="#" class="js-file-link"></a>
                                    </p>
                                </div>
                                <div id="form-fineupload"></div>
                                <div class="form-group js-add-new-buttons">
                                    <input type="submit" class="btn btn-primary input-medium pull-right js-add-new-send" value="Send" />
                                    <input type="reset" class="btn btn-warning input-medium pull-right js-add-new-cancel" />
                                    <i class="fa fa-spinner fa-spin hide pull-right"></i>
                                </div>
                            {{ Form::close() }}
                        </div>
                    </div>
                </div>
                <div class="tab-pane" id="markdown-sensitive-data">
                    <div class="row js-markdown-placeholder">
                        <div class="col-xs-12">
                            <h2 class="js-markdown-title"></h2>
                            <div class="js-markdown-body"></div>
                            <a href="#" class="js-file-link"></a>
                        </div>
                    </div>
                </div>
                <div class="tab-pane" id="raw-sensitive-data">
                    <div class="row js-raw-placeholder">
                        <div class="col-xs-12">
                            <h2 class="js-raw-title"></h2>
                            <div>
                                <pre class="js-raw-body"></pre>
                            </div>
                            <a href="#" class="js-file-link"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="modal fade js-decrypt-modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">Decrypt data</h4>
      </div>
      <div class="modal-body">
          <form>
            <input type="hidden" name="id"/>
            <input type="password" name="password" placeholder="password" class="form-control"/>
          </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-danger js-submit" disabled="disabled">Decrypt Now</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->