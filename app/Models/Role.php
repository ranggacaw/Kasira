<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    public const OWNER = 'Owner';
    public const ADMIN = 'Admin';
    public const CASHIER = 'Cashier';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * @return list<string>
     */
    public static function names(): array
    {
        return [
            self::OWNER,
            self::ADMIN,
            self::CASHIER,
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
