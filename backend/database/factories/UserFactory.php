<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;


class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password',
        ];
    }
}
