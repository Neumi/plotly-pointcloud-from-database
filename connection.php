<?php
/**
 * Created by PhpStorm.
 * User: Jan
 * Date: 05.04.19
 * Time: 05:12
 */
class Db
{
    private static $instance = NULL;

    private function __construct()
    {
    }

    private function __clone()
    {
    }

    public static function getInstance()
    {
        if (!isset(self::$instance)) {
            $pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
            self::$instance = new PDO('mysql:host=localhost;dbname=3dscan', 'root', 'root', $pdo_options);
        }
        return self::$instance;
    }
}