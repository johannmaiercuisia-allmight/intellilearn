<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'extracted_text',
    ];

    protected $appends = ['file_url'];

    protected $hidden = ['extracted_text'];

    public function getFileUrlAttribute(): ?string
    {
        if ($this->file_path) {
            $disk = app()->environment('production') ? 'r2' : 'public';
            return Storage::disk($disk)->url($this->file_path);
        }
        return null;
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
