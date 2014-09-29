<?php

class Tag extends \Eloquent {
    protected $fillable = [];

    public function SensitiveData()
    {
        return $this->belongsToMany('SensitiveDatum')->withTimestamps();
    }
}