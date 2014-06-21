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

/**
 * Description of GnugpTesthom
 *
 * @author alayn
 */
class GnupgTest extends PHPUnit_Framework_TestCase {
    private $gnupg;
    const FINGERPRINT = 'A71E3BAC76B55FC9CD21EE337F6019EDFCB507A8'; //test
    const FINGERPRINT_2 = '8D13E0CE76FE320F1A0B47E47351A00890A0B5EC'; //testing

    public function setUp()
    {
        putenv("GNUPGHOME=" . __DIR__ . "/_keys");
        $this->gnupg = new \Service\Gnupg(new \Gnupg);
    }
    
    public function testGnupgCanBeInstanciated()
    {
        $this->assertInstanceOf('\\Service\\Gnupg', $this->gnupg);
    }
    
    public function testEncryptedTextIsDifferentFromOriginal()
    {
        $this->gnupg->addencryptkey(self::FINGERPRINT);
        $this->gnupg->addencryptkey(self::FINGERPRINT_2);
        $encrypted = $this->gnupg->encrypt('froga');
        $this->assertNotEquals('froga', $encrypted);
    }
    
    public function testEncryptedTextIsRecoverableWithRightPassword()
    {
        $this->gnupg->addencryptkey(self::FINGERPRINT);
        $encryptedData = $this->gnupg->encrypt('froga');
        $cleanData = $this->gnupg->decrypt($encryptedData, 'test');
        $this->assertEquals('froga', $cleanData);

    }
}
