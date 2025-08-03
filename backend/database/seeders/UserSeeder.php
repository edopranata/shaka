<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@shakapos.com'],
            [
                'name' => 'Administrator',
                'username' => 'admin',
                'password' => Hash::make('password'),
                'phone' => '08123456789',
                'address' => 'Kantor Pusat Shaka POS',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        
        $admin->assignRole('admin');

        // Create manager user
        $manager = User::firstOrCreate(
            ['email' => 'manager@shakapos.com'],
            [
                'name' => 'Manager Store',
                'username' => 'manager',
                'password' => Hash::make('password'),
                'phone' => '08123456790',
                'address' => 'Toko Utama',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        
        $manager->assignRole('manager');

        // Create cashier user
        $cashier = User::firstOrCreate(
            ['email' => 'cashier@shakapos.com'],
            [
                'name' => 'Kasir Store',
                'username' => 'cashier',
                'password' => Hash::make('password'),
                'phone' => '08123456791',
                'address' => 'Toko Utama',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        
        $cashier->assignRole('cashier');
    }
}
