<?php

/*
 * Copyright (C) 2014 Alayn Gortazar <alayn@barnetik.com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distribauted in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

namespace Service;

/**
 * Facade to real Gnupg (from extension) as there was no way to make decryption
 * work properly. Implements only methods needed in Behigorri PM project.
 * @author alayn
 */
class Gnupg {

    private $gnupg;

    public function __construct(\Gnupg $gnupg) 
    {
        $this->gnupg = $gnupg;
        $this->gnupg->setErrorMode(\Gnupg::ERROR_EXCEPTION);
    }
    
    public function addEncryptKey($fingerprint)
    {
        $this->gnupg->addEncryptKey($fingerprint);
    }
    
    public function clearEncryptKeys()
    {
        $this->gnupg->clearEncryptKeys();
    }
    
    public function encrypt($data)
    {
        return $this->gnupg->encrypt($data);
    }
    
    /*
     * TODO: Make this shell_exec safer.
     */
    public function decrypt($encryptedData, $password)
    {
        $encFile = tempnam(sys_get_temp_dir(), '');
        file_put_contents($encFile, $encryptedData);
        $command = sprintf(
            'gpg --homedir %s --batch --passphrase %s --yes -d %s 2> /dev/null', 
            escapeshellarg(getenv('GNUPGHOME')), 
            escapeshellarg($password), 
            escapeshellarg($encFile)
        );
        
        $aClearData = [];
        $returnVar = null;
        exec($command, $aClearData, $returnVar);
        
        if ($returnVar != 0) {
            throw new \Exception('Data could not be decrypted');
        }
        unlink($encFile);
        return implode("\n", $aClearData);
    }
}
