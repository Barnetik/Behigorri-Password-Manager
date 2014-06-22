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

use Illuminate\Auth\GenericUser;
use \Cache;

/**
 * @author Alayn Gortazar <alayn@barnetik.com>
 */
class Ldap 
{
    const CACHE_TIME = 10;

    private $config;
    private $ldap;


    public function __construct($config)
    {
        $this->config = $config;
        if (!isset($config['hostname'])) {
            throw new \Exception('Ldap hostname is required');
        }

        if (!isset($config['bind_dn']) || !isset($config['bind_pass'])) {
            throw new \Exception('A bind user and password must be provided');
        }
    }
    
    protected function getLdap()
    {
        if (!isset($this->ldap)) {
            if (isset($this->config['port'])) {
                $this->ldap = @ldap_connect($this->config['hostname'], $this->config['port']);
            } else {
                $this->ldap = @ldap_connect($this->config['hostname']);
            }
            ldap_set_option($this->ldap, LDAP_OPT_PROTOCOL_VERSION, 3);

            $bind = @ldap_bind($this->ldap, $this->config['bind_dn'], $this->config['bind_pass']);
            if (!$bind) {
                throw new \Exception('Could not bind to LDAP server');
            }
        }        
        return $this->ldap;
    }
    
    public function getById($id) 
    {
        $identifier = 'uid';
        
        if (isset($this->config['identifier'])) {
            $identifier = $this->config['identifier'];
        }
        
        if (!isset($this->config['base_dn'])) {
            throw new \Exception('Ldap base_dn is required');
        }
        
        $rdn = sprintf('%s=%s,%s', $identifier, $id, $this->config['base_dn']);
        
        if (Cache::has($rdn)) {
            return Cache::get($rdn);
        }
        $ldap = $this->getLdap();
        $result = @ldap_read($ldap, $rdn, 'objectClass=*');
        if ($result !== false) {
            $entries = @ldap_get_entries($ldap, $result);
            if ($entries['count'] > 0) {
                $user = $this->getUser($entries[0]);
                Cache::put($rdn, $user, self::CACHE_TIME);
                return $user;
            }
        }
        
        return null;
    }
    
    private function getUser($userEntry)
    {
        return new GenericUser(array(
            'id' => $userEntry['uid'][0],
            'password' => $userEntry['userpassword'][0],
            'name' => $userEntry['givenname'][0],
            'surname' => $userEntry['sn'][0],
            'mail' => $userEntry['mail'][0],
            'dn' => $userEntry['dn']
        ));
    }
    
    public function validateCredentials($user, $credentials)
    {
        return @ldap_bind($this->getLdap(), $user->dn, $credentials['password']);
    }
}
