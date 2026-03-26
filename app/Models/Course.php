<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'instructor_id',
        'semester',
        'section',
        'status',
    ];

    // -------------------------------------------------------
    // RELATIONSHIPS
    // -------------------------------------------------------

    /**
     * The instructor who teaches this course.
     * Usage: $course->instructor->full_name
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * All enrollments for this course.
     * Usage: $course->enrollments
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * All students enrolled in this course (through enrollments).
     * Usage: $course->students
     */
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments')
                    ->withPivot('status')
                    ->withTimestamps();
    }

    /**
     * All lessons in this course.
     * Usage: $course->lessons
     */
    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }

    /**
     * All assessments in this course.
     * Usage: $course->assessments
     */
    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

    /**
     * All announcements for this course.
     * Usage: $course->announcements
     */
    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }
}
