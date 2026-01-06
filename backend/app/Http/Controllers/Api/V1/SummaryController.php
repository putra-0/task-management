<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ResponseCode;
use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Services\ResponseService;
use App\Services\UserService;

class SummaryController extends Controller
{
    public function __construct(
        private ResponseService $responseService,
        private UserService $userService,
    ) {}

    public function getTotalTasksbyStatus()
    {
        $tasks = Task::query()
            ->where('user_id', $this->userService->getfromRequest()->id)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->get();

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            data: [
                'todo' => $tasks->firstWhere('status', TaskStatus::ToDo)->total ?? 0,
                'inProgress' => $tasks->firstWhere('status', TaskStatus::InProgress)->total ?? 0,
                'done' => $tasks->firstWhere('status', TaskStatus::Done)->total ?? 0,
            ]
        );
    }
}
