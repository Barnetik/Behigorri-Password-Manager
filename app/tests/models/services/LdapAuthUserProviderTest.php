<?php

class LdapAuthUserProviderTest extends TestCase {

    private $userProvider;
    const VALID_USER = 'user';
    const VALID_PASS = 'password';
    const INVALID_USER = 'wrongUser';
    const INVALID_PASS = 'wrongPass';

    public function setUp()
    {
        parent::setUp();
        $this->userProvider = new \Service\LdapAuthUserProvider($this->app->config);
    }
    
    public function testLdapAuthUserProviderIsInstanceable()
    {
        $this->assertInstanceOf('\\Service\\LdapAuthUserProvider', $this->userProvider);
    }

    public function testLdapAuthUserProviderImplementsUserProviderInterface()
    {
        $this->assertInstanceOf('\\Illuminate\\Auth\\UserProviderInterface', $this->userProvider);
    }
    
    public function testRetrieveByCredentialsWithValidDataReturnsUser()
    {
        $credentials = array(
            'username' => self::VALID_USER,
            'password' => self::VALID_PASS
        );
        $user = $this->userProvider->retrieveByCredentials($credentials);
        $this->assertInstanceOf('\\Illuminate\\Auth\\UserInterface', $user);
        $this->assertEquals(self::VALID_USER, $user->getAuthIdentifier());
    }

    public function testRetrieveByCredentialsWithInValidDataReturnsNull()
    {
        $credentials = array(
            'username' => 'invalidUser',
            'password' => 'invalidPass'
        );
        $user = $this->userProvider->retrieveByCredentials($credentials);
        $this->assertNull($user);
    }
    
    public function testRetrievedUserValidatesCredentials()
    {
        $credentials = array(
            'username' => self::VALID_USER,
            'password' => self::VALID_PASS
        );
        $user = $this->userProvider->retrieveByCredentials($credentials);
        $this->assertTrue($this->userProvider->validateCredentials($user, $credentials));
    }

    public function testRetrieveByIdReturnsValidUser()
    {
        $user = $this->userProvider->retrieveById(self::VALID_USER);
        $this->assertInstanceOf('\\Illuminate\\Auth\\UserInterface', $user);
        $this->assertEquals(self::VALID_USER, $user->getAuthIdentifier());
    }
    
    public function testLdapAuthProviderIsWorking()
    {
        $this->assertTrue(Auth::attempt(array('username' => self::VALID_USER, 'password' => self::VALID_PASS)));
    }
    
}
