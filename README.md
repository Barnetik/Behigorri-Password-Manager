Behigorri Password Manager
==========================

Behigorri is (or will be, this is still a Work In Progress) a Password Manager or Keyring intended to save sensitive data on a remote server to be accesible from anywhere.

Features
--------

It's **current main features** are:
 * LDAP based authentication (as Laravel authentication drivers are used, this can be easily modifiable for database authentication)
 * GNUPG use to store sensitive data on server side. This means:
   * Passwordless encryption
   * Passphrase enabled decryption

It's **future features** are meant to be:
 * Multiple roles with exclusive encryption key for each one.
 * Multirole encryption, allowing multiple roles to decrypt a single data unit with their own passphrases without needing to share them. 

Dependencies
------------
 * Composer
 * Bower
 * gnupg (cli)
 * php extensions
   * gnupg
   * ldap

Installation
------------

Nowdays, there are some steps to be taken for a proper installation, here are some guidelines:

Clone the current repository

  `git clone https://github.com/BarnetikKoop/Behigorri-Password-Manager.git`

Install php dependencies

  `$ composer install`

Create database and configure it on laravel's database configuration file (app/config/database.php), then migrate:

  `$ php artisan migrate`

Create a gpg pub/priv key on app/storage/keys/admin using custom artisan command:

  `$ php artisan behigorri:gpg:init` 

Configure ldap or you're choice authentication mechanism and you should be ready to go!
