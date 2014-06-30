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

Nowdays, is not easily installable and usable, but here are some guidelines:

Clone the current repository

  `git clone https://github.com/BarnetikKoop/Behigorri-Password-Manager.git`

Install php dependencies

  `$ composer install`

Install javascript/css dependencies

  `$ bower install`

Create database and configure it on laravel's database configuration file (app/config/database.php), then migrate:

  `$ php artisan migrate`

Create a gpg pub/priv key on app/storage/keys/admin using gpg cli:

  `$ gpg --homedir app/storage/keys/admin --gen-key` 

And make apache user the folders owner:

  `$ sudo chown www-data:www-data app/storage -R`

Take the gpg key's fingerprint:

  $ gpg --homedir app/storage/keys/admin
  
    pub   2048R/F1678C06 2014-06-06
          Key fingerprint = F6A7 370F 50C9 5303 4BC4  F4F1 7F08 F167 8C06

Remove it's whitespaces:

  `F6A7370F50C953034BC4F4F17F08F1678C06`

And insert it into the roles table:

  `INSERT INTO roles values(1, 500, 'admin', 'F6A7370F50C953034BC4F4F17F08F1678C06');`


Easy, wasn't it? :p

We promess to make this better soon, but as stated before, this is still a Work In Progress.
