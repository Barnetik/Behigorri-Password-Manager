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
 * Test Case for SensitiveDatum model
 *
 * @author alayn
 */
class SensitiveDatumTest extends TestCase {
    const FINGERPRINT = 'A71E3BAC76B55FC9CD21EE337F6019EDFCB507A8'; //test
    const FINGERPRINT_2 = '8D13E0CE76FE320F1A0B47E47351A00890A0B5EC'; //testing

    protected $sensitiveDatum;
    public function setUp()
    {
        parent::setUp();
        $this->sensitiveDatum = App::make('SensitiveDatum');

    }
    
    public function testSensitiveDatumIsInstanciableThroughIoc()
    {
        $this->assertInstanceOf('\\SensitiveDatum', $this->sensitiveDatum);
    }
    
    public function testSensitiveDatumEncryptsDataWhenEncryptCalled()
    {
        $this->sensitiveDatum->value = "test";
        $this->assertEquals('test', $this->sensitiveDatum->value);
        
        $this->sensitiveDatum->encrypt();
        $this->assertNotEquals('test', $this->sensitiveDatum);
    }
}
