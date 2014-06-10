<?php

class LdapAuthUserProviderTest extends TestCase {

    private $userProvider;
    const VALID_USER = 'testuser';
    const VALID_PASS = 'testpassword';
    const LDAP_SERVER = 'ldap://ad.example.com';
    const LDAP_IDENTIFIER = 'uid';
    const LDAP_BASE_DN = 'ou=Employees,dc=example,dc=com';

    public function setUp()
    {
        parent::setUp();
        $config = array(
            'ldap' => array(
                'hostname' => self::LDAP_SERVER,
                'identifier' => self::LDAP_IDENTIFIER,
                'base_dn' => self::LDAP_BASE_DN
            )
        );
        $this->userProvider = new \Service\LdapAuthUserProvider($config);
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

    public function testRetrievedUserValidatesCredentials()
    {
        $credentials = array(
            'username' => self::VALID_USER,
            'password' => self::VALID_PASS
        );
        $user = $this->userProvider->retrieveByCredentials($credentials);
        $this->assertTrue($this->userProvider->validateCredentials($user, $credentials));
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
    
    public function testLdapAuthProviderIsWorking()
    {
        $this->assertTrue(Auth::attempt(array('username' => self::VALID_USER, 'password' => self::VALID_PASS)));
    }
    
}
