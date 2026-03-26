<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LessonMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'type',
        'file_path',
        'url',
        'order',
    ];

    /**
     * The lesson this material belongs to.
     */
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
