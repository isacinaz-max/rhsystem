<?php
namespace App\Traits;
use Illuminate\Support\Facades\Log;
trait Loggable
{
    public static function bootLoggable(): void
    {
        static::created(function ($model) {
            self::logAction('created', $model);
        });
        static::updated(function ($model) {
            self::logAction('updated', $model);
        });
        static::deleted(function ($model) {
            self::logAction('deleted', $model);
        });
    }
    protected static function logAction(string $action, $model): void
    {
        Log::info("{$action}: " . get_class($model) . " ID: {$model->id}", [
            'action' => $action,
            'model' => get_class($model),
            'model_id' => $model->id,
            'user_id' => auth()->id(),
            'changes' => $model->getChanges(),
        ]);
    }
}
