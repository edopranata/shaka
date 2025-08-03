<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // User management
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',
            
            // Product management
            'products.view',
            'products.create',
            'products.edit',
            'products.delete',
            
            // Category management
            'categories.view',
            'categories.create',
            'categories.edit',
            'categories.delete',
            
            // Customer management
            'customers.view',
            'customers.create',
            'customers.edit',
            'customers.delete',
            
            // Transaction management
            'transactions.view',
            'transactions.create',
            'transactions.edit',
            'transactions.delete',
            'transactions.process',
            
            // Reports
            'reports.view',
            'reports.export',
            
            // Settings
            'settings.view',
            'settings.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $cashierRole = Role::firstOrCreate(['name' => 'cashier']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);

        // Assign permissions to roles
        
        // Admin gets all permissions
        $adminRole->givePermissionTo(Permission::all());

        // Manager gets most permissions except user delete
        $managerPermissions = Permission::whereNotIn('name', [
            'users.delete',
            'settings.edit'
        ])->get();
        $managerRole->givePermissionTo($managerPermissions);

        // Cashier gets limited permissions
        $cashierPermissions = [
            'products.view',
            'customers.view',
            'customers.create',
            'customers.edit',
            'transactions.view',
            'transactions.create',
            'transactions.process',
            'reports.view',
        ];
        $cashierRole->givePermissionTo($cashierPermissions);
    }
}
