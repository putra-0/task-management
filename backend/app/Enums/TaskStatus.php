<?php

namespace App\Enums;

enum TaskStatus: string
{
    case ToDo = 'TD';
    case InProgress = 'IP';
    case Done = 'DN';

    public function getName(): string
    {
        return str()->headline($this->name);
    }
}
