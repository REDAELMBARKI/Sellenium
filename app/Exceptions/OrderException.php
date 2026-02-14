<?php

namespace App\Exceptions;

use Exception;

class OrderException extends Exception
{
    /**
     * Create a new class instance.
     */
    public function __construct(public Exception $e)
    {
        parent::__construct($e->getMessage(), (int) $e->getCode(), $e);
    }
}
