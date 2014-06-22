
<div class="row">
    
    <div class="col-xs-5">
        @foreach ($sensitiveData as $datum)
        <div id="datum-{{{ $datum->id }}}" data-model="{{{ $datum->toJSON() }}}" class="row datum-row">
            <div class="col-xs-9 js-datum-name">
                {{{ $datum->name }}}
            </div>
            <div class="col-xs-3">
                <button class="js-decrypt btn btn-danger" data-datum-id="{{{ $datum->id }}}">decrypt</button>
            </div>
        </div>
        @endforeach
    </div>
    
    <div class="col-xs-7">
        <div class="row">
            <button class="btn btn-success input-medium pull-right js-add-new">Add New</button>
        </div>
        <div class="row hidden js-new-form">
            <div class="span6">
                <form method="post">
                    <input name="id" type="hidden" class="js-form-id" />
                    <div class="controls controls-row">
                        <input name="name" type="text" class="span3 form-control js-form-name" placeholder="Description">
                    </div>
                    <div class="controls">
                        <textarea name="value" class="span6 form-control js-form-value" placeholder="Sensitive data" rows="5"></textarea>
                    </div>

                    <div class="controls">
                        <button type="submit" class="btn btn-primary input-medium pull-right">Send</button>
                        <button class="btn btn-warning input-medium pull-right js-add-new-cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>    
    </div>
    
</div>


<div class="modal fade js-decrypt-modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">Modal title</h4>
      </div>
      <div class="modal-body">
          <input type="hidden" name="id"/>
          <input type="password" name="password" placeholder="password" class="form-control"/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-danger js-submit" disabled="disabled">Decrypt Now</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->