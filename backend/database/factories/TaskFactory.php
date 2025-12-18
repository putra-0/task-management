<?php

namespace Database\Factories;

use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use DateInterval;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $datetime = fake()->dateTimeBetween('-1 year');

        return [
            'uuid' => fake()->unique()->uuid(),
            'status' => fake()->randomElement(TaskStatus::cases()),
            'title' => fake()->sentence(2),
            'description' => fake()->optional()->sentence(5),
            'created_at' => $datetime,
            'deadline' => (clone $datetime)->add(new DateInterval('PT1H')),
        ];
    }

    public function configure()
    {
        $userIds = User::whereNotNull('email_verified_at')->pluck('id');

        return $this->afterMaking(function (Task $task) use ($userIds) {
            $task->user_id = $userIds->random();

        });
    }
}
