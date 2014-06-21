<?php
use Service\Gnupg;

class SensitiveDatum extends \Eloquent 
{
    protected $fillable = [];
    public $encrypted = false;
    protected $gnupg;

    public function __construct(Gnupg $gnupg) 
    {
        $this->gnupg = $gnupg;
    }

    public static function boot()
    {
        parent::boot();
        SensitiveDatum::saving(function(SensitiveDatum $sensitiveDatum) {
            if (!$sensitiveDatum->isEncrypted()) {
                $sensitiveDatum->encrypt();
            }
        });
        SensitiveDatum::restoring(function(SensitiveDatum $sensitiveDatum) {
            $sensitiveDatum->encrypted = true;
        });
    }

    public function encrypt()
    {
        $this->value = $this->gnupg->encrypt($this->value);
        $this->encrypted = true;
    }

    public function setEncryptedValue($value) {
        $this->encrypted = true;
        $this->value = $value;
    }

    public function isEncrypted() {
        return $this->encrypted;
    }

}