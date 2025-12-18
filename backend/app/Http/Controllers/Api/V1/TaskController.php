<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ResponseCode;
use App\Exceptions\DataNotFoundException;
use App\Helpers\DateHelper;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Task\IndexRequest;
use App\Http\Requests\Api\V1\Task\StoreRequest;
use App\Http\Requests\Api\V1\Task\UpdateRequest;
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
        $tasks = Task::query()
            ->where('user_id', $this->userService->getfromRequest()->id)
            ->when($request->filled('status'), function (Builder $query) use ($request) {
                $query->where('status', $request->input('status'));
            })
            ->orderBy('deadline')
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

    public function store(StoreRequest $request)
    {
        QueryHelper::retryOnDuplicate(fn() => Task::create([
            'uuid' => str()->uuid(),
            'status' => $request->input('status'),
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'deadline' => $request->date('deadline', 'Y-m-d H:i:s'),
            'user_id' => $this->userService->getFromRequest()->id,
        ]));

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Task has been created'
        );
    }

    public function update(UpdateRequest $request, string $uuid)
    {
        $task = Task::where('uuid', $uuid)
            ->where('user_id', $this->userService->getFromRequest()->id)
            ->first();

        throw_if(is_null($task), new DataNotFoundException('Task'));

        $task->update([
            'status' => $request->input('status'),
        ]);

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Task has been updated'
        );
    }

    public function destroy(string $uuid)
    {
        $task = Task::where('uuid', $uuid)
            ->where('user_id', $this->userService->getFromRequest()->id)
            ->first();

        throw_if(is_null($task), new DataNotFoundException('Task'));

        $task->delete();

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Task has been deleted'
        );
    }
}
