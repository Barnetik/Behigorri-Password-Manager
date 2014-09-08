<?php
use Service\Gnupg;

class SensitiveDatum extends \Eloquent
{
    public $fillable = ['name', 'value'];
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

    public function toJson($options = 0) {
        $array = $this->toArray();
        unset($array['file_contents']);
        if ($this->isEncrypted()) {
            unset($array['value']);
        }
        return json_encode($array, $options);
    }
}