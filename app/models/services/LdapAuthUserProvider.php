<?php

/*
 * Copyright (C) 2014 Alayn Gortazar <alayn@barnetik.com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
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
 * @author Alayn Gortazar <alayn@barnetik.com>
 */
class LdapAuthUserProvider implements \Illuminate\Auth\UserProviderInterface 
{
    public function __construct($config)
    {
        $this->ldap = new Ldap($config['ldap']);
        $this->hasher = new \Illuminate\Hashing\BcryptHasher();
    }
    
    public function retrieveByCredentials(array $credentials) 
    {
        return $this->ldap->getById($credentials['username']);
    }

    public function retrieveById($identifier) 
    {
        return $this->ldap->getById($identifier);
    }

    public function retrieveByToken($identifier, $token) 
    {
    }

    public function updateRememberToken(\Illuminate\Auth\UserInterface $user, $token) 
    {
        
    }

    public function validateCredentials(\Illuminate\Auth\UserInterface $user, array $credentials) 
    {
        return $this->ldap->validateCredentials($user, $credentials);
    }
}
