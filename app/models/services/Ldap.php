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
/**
 * @author Alayn Gortazar <alayn@barnetik.com>
 */
class Ldap {

    private $config;

    public function __construct($config)
    {
        $this->config = $config;
        if (!isset($config['hostname'])) {
            throw new \Exception('Ldap hostname is required');
        }
        
        if (isset($config['port'])) {
            $this->ldap = @ldap_connect($config['hostname'], $config['port']);
        } else {
            $this->ldap = @ldap_connect($config['hostname']);
        }
        ldap_set_option($this->ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
    }
    
    public function authenticate($credentials) 
    {
        $identifier = 'uid';
        
        if (isset($this->config['identifier'])) {
            $identifier = $this->config['identifier'];
        }
        
        if (!isset($this->config['base_dn'])) {
            throw new \Exception('Ldap base_dn is required');
        }
        
        $rdn = sprintf('%s=%s,%s', $identifier, $credentials['username'], $this->config['base_dn']);
        $bind = @ldap_bind($this->ldap, $rdn, $credentials['password']);
        if ($bind) {
            $result = @ldap_read($this->ldap, $rdn, 'objectClass=*');
            $entries = @ldap_get_entries($this->ldap, $result);
            
            return $this->getUser($entries[0], $credentials);
        }
        return null;
    }
    
    private function getUser($userEntry, $credentials)
    {
        return new GenericUser(array(
            'id' => $credentials['username'],
            'password' => $userEntry['userpassword'][0],
            'name' => $userEntry['givenname'][0],
            'surname' => $userEntry['sn'][0],
            'mail' => $userEntry['mail'][0],
            'dn' => $userEntry['dn'][0]
        ));
    }
}
