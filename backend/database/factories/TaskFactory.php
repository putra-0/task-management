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
        return [
            'uuid' => fake()->unique()->uuid(),
            'status' => fake()->randomElement(TaskStatus::cases()),
            'title' => fake()->sentence(2),
            'description' => fake()->optional()->sentence(5),
            'created_at' => fake()->dateTimeBetween('-1 year'),
        ];
    }

    public function withDeadline(): static
    {
        return $this->state(fn (array $attributes) => [
            'deadline' => (clone $attributes['created_at'])->add(new DateInterval('PT2H')),
        ]);
    }

    public function configure()
    {
        $userIds = User::whereNotNull('email_verified_at')->pluck('id');

        return $this->afterMaking(function (Task $task) use ($userIds) {
            $task->user_id = $userIds->random();

        });
    }
}
