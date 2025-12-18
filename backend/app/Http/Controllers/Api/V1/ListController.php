<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ResponseCode;
use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Services\ResponseService;

class ListController extends Controller
{
    public function __construct(
        private ResponseService $responseService,
    ) {}

    public function getTaskStatuses()
    {
        return $this->responseService->generate(
            code: ResponseCode::Ok,
            data: [
                'items' => collect(TaskStatus::cases())->transform(fn($item) => [
                    'code' => $item->value,
                    'name' => $item->name,
                ]),
            ]
        );
    }
}
