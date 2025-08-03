<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'date_of_birth',
        'gender',
        'credit_limit',
        'outstanding_balance',
        'is_active',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'credit_limit' => 'decimal:2',
        'outstanding_balance' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the transactions for the customer.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Check if customer has outstanding balance.
     */
    public function hasOutstandingBalance(): bool
    {
        return $this->outstanding_balance > 0;
    }

    /**
     * Check if customer can make purchase on credit.
     */
    public function canPurchaseOnCredit(float $amount): bool
    {
        return ($this->outstanding_balance + $amount) <= $this->credit_limit;
    }
}
