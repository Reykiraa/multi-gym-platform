<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Gym;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GymManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_gym_and_auto_generate_mitra_account()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->postJson('/api/gyms', [
            'mitra_name' => 'New Mitra Test',
            'mitra_email' => 'mitra.test@gym.com',
            'mitra_password' => 'secret123',
            'name' => 'Gym Test Mitra Auto',
            'location' => 'Jakarta',
            'facilities' => ['Treadmill'],
            'credit_price' => 5,
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'gym' => ['id', 'mitra_id', 'name', 'location', 'facilities', 'credit_price'],
            'mitra' => ['id', 'name', 'email', 'role']
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'mitra.test@gym.com',
            'role' => 'mitra'
        ]);

        $mitraId = $response->json('mitra.id');

        $this->assertDatabaseHas('gyms', [
            'mitra_id' => $mitraId,
            'name' => 'Gym Test Mitra Auto'
        ]);
        
        $this->assertNotNull($mitraId);
    }

    public function test_non_admin_cannot_create_gym()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->postJson('/api/gyms', [
            'mitra_name' => 'Mitra Try',
            'mitra_email' => 'mitra.try@gym.com',
            'name' => 'Gym Try',
            'location' => 'Bali',
            'facilities' => ['Cardio'],
            'credit_price' => 10,
        ]);

        $response->assertStatus(403);
    }
}
