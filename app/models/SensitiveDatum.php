<?php
use Service\Gnupg;

class SensitiveDatum extends \Eloquent
{
    public $fillable = ['name', 'value'];
    public $hidden = ['value', 'file_contents'];
    public $encrypted = false;

    protected $gnupg;
    protected $role;

    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);
        $this->gnupg = App::make('\\Service\\Gnupg');
    }

    public static function boot()
    {
        parent::boot();
        SensitiveDatum::saving(function(SensitiveDatum $sensitiveDatum) {
            if (!$sensitiveDatum->isEncrypted()) {
                $sensitiveDatum->encrypt();
            }
        });
        SensitiveDatum::registerModelEvent('restoring', function(SensitiveDatum $sensitiveDatum) {
            $sensitiveDatum->encrypted = true;
        });
    }

    public function encrypt()
    {
        $this->gnupg->addEncryptKey($this->role->gpg_fingerprint);
        if ($this->isDirty('value')) {
            $this->value = $this->gnupg->encrypt($this->value);
        }
        if ($this->isDirty('file_contents')) {
            $this->file_contents = $this->gnupg->encrypt($this->file_contents);
        }
        $this->encrypted = true;
        $this->gnupg->clearEncryptKeys();
        $this->hideEncryptedValues();
    }

    protected function hideEncryptedValues()
    {
        if (!in_array('value', $this->hidden)) {
            array_push($this->hidden, 'value');
        }
        if (!in_array('file_contents', $this->hidden)) {
            array_push($this->hidden, 'file_contents');
        }
    }

    public function decrypt($password)
    {
        if ($this->value) {
            $this->value = $this->gnupg->decrypt($this->value, $password);
        }
        if ($this->file_contents) {
            $this->file_contents = $this->gnupg->decrypt($this->file_contents, $password);
        }

        $this->encrypted = false;
        $this->showDecryptedValues();
    }

    protected function showDecryptedValues()
    {
        $valuePosition = array_search('value', $this->hidden);
        if ($valuePosition !== false) {
            unset($this->hidden[$valuePosition]);
        }
    }

    public function setEncryptedValue($value)
    {
        $this->encrypted = true;
        $this->value = $value;
    }

    public function isEncrypted()
    {
        return $this->encrypted;
    }

    public function setRole(\Role $role)
    {
        $validator = Validator::make($role->toArray(), array(
            'name' => 'alpha_dash'
        ));
        if ($validator->fails()) {
            throw new \Exception('Wrong role name: ' . $validator->messages()->first('name'));
        }

        putenv("GNUPGHOME=" . storage_path() . '/keys/' . $role->name);
        $this->role = $role;
    }

    public function user()
    {
        return $this->belongsTo('User');
    }

    public function tags()
    {
        return $this->belongsToMany('Tag')->withTimestamps();
    }

    public function toArrayWithSuccess($options = 0) {
        $array = $this->toArray();
        $array['success'] = true;
        return $array;
    }
}