<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\DateHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Task\IndexRequest;
use App\Models\Task;
use App\Services\ResponseService;
use App\Services\UserService;
use Illuminate\Database\Eloquent\Builder;

class TaskController extends Controller
{
    public function __construct(
        private ResponseService $responseService,
        private UserService $userService,
    ) {}

    public function index(IndexRequest $request)
    {
        $sort = $request->array('sort');

        $tasks = Task::query()
            ->where('user_id', $this->userService->getfromRequest()->id)
            ->when($sort !== [], function (Builder $query) use ($sort) {
                foreach ($sort as $item) {
                    $query->orderBy(str()->snake($item['by']), $item['direction']);
                }
            })
            ->when($request->filled('status'), function (Builder $query) use ($request) {
                $query->where('status', $request->input('status'));
            })
            ->orderBy('id')
            ->paginate($request->integer('perPage'))
            ->through(fn($item) => [
                'uuid' => $item->uuid,
                'status' => [
                    'code' => $item->status->value,
                    'name' => $item->status->getName(),
                ],
                'title' => $item->title,
                'description' => $item->description,
                'deadline' => DateHelper::formatIso($item->deadline),
                'createdAt' => DateHelper::formatIso($item->created_at),
            ]);

        return $this->responseService->paginate($tasks);
    }
}
