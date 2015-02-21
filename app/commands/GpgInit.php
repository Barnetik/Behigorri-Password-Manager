<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class GpgInit extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'behigorri:gpg:init';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Command description.';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
        $keyRingPath = storage_path() . '/keys/admin';
        if (!file_exists($keyRingPath)) {
            $created = mkdir($keyRingPath, 0700, true);
            if (!$created) {
                throw new \Exception('Keyring dir could not be created');
            }
        }
        
        if (!is_dir($keyRingPath)) {
            throw new \Exception('Keyring path is not a directory');
        }
        
        exec('gpg --homedir ' . $keyRingPath . ' --gen-key');
      
        $this->addFingerprint($keyRingPath);
    }
    
    private function addFingerPrint($keyRingPath) 
    {
        $output = [];
        exec('gpg --fingerprint --homedir ' . $keyRingPath, $output);
        foreach ($output as $outline) {
            $matches = [];
            $result = preg_match('/Key fingerprint = (?<fingerprint>.+)/', $outline, $matches);
            if ($result === 1) {
                $fingerprint = str_replace(' ', '', $matches['fingerprint']);
                $role = new Role();
                $role->guid = 500;
                $role->name = 'admin';
                $role->gpg_fingerprint = $fingerprint;
                $role->save();
            }
        }
    }

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return array(
//			array('example', InputArgument::REQUIRED, 'An example argument.'),
		);
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return array(
//			array('example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null),
		);
	}

}
