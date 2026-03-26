<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

// =============================================================
// PUBLIC ROUTES
// =============================================================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/verify-email/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return response()->json(['message' => 'Email verified successfully.']);
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');


// =============================================================
// PROTECTED ROUTES
// =============================================================

Route::middleware('auth:sanctum')->group(function () {

    // --- AUTH ---
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/email/resend', [AuthController::class, 'resendVerification']);

    // --- PROFILE ---
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    // --- COURSES ---
    Route::get('/courses', [CourseController::class, 'index']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);
    Route::put('/courses/{course}', [CourseController::class, 'update']);
    Route::delete('/courses/{course}', [CourseController::class, 'destroy']);
    Route::post('/courses/{course}/enroll', [CourseController::class, 'enroll']);
    Route::post('/courses/{course}/unenroll', [CourseController::class, 'unenroll']);
    Route::get('/courses/{course}/students', [CourseController::class, 'students']);

    // --- LESSONS ---
    Route::get('/courses/{course}/lessons', [LessonController::class, 'index']);
    Route::post('/courses/{course}/lessons', [LessonController::class, 'store']);
    Route::get('/courses/{course}/lessons/{lesson}', [LessonController::class, 'show']);
    Route::put('/courses/{course}/lessons/{lesson}', [LessonController::class, 'update']);
    Route::delete('/courses/{course}/lessons/{lesson}', [LessonController::class, 'destroy']);

    // --- LESSON MATERIALS ---
    Route::post('/courses/{course}/lessons/{lesson}/materials', [LessonController::class, 'uploadMaterial']);
    Route::delete('/courses/{course}/lessons/{lesson}/materials/{material}', [LessonController::class, 'deleteMaterial']);

    // --- LESSON PROGRESS ---
    Route::put('/courses/{course}/lessons/{lesson}/progress', [LessonController::class, 'updateProgress']);
    Route::get('/courses/{course}/progress', [LessonController::class, 'courseProgress']);

    // --- ASSESSMENTS ---
    Route::get('/courses/{course}/assessments', [AssessmentController::class, 'index']);
    Route::post('/courses/{course}/assessments', [AssessmentController::class, 'store']);
    Route::get('/courses/{course}/assessments/{assessment}', [AssessmentController::class, 'show']);
    Route::put('/courses/{course}/assessments/{assessment}', [AssessmentController::class, 'update']);
    Route::delete('/courses/{course}/assessments/{assessment}', [AssessmentController::class, 'destroy']);

    // --- QUESTIONS ---
    Route::post('/courses/{course}/assessments/{assessment}/questions', [AssessmentController::class, 'addQuestion']);
    Route::post('/courses/{course}/assessments/{assessment}/questions/bulk', [AssessmentController::class, 'addQuestionsBulk']);
    Route::put('/courses/{course}/assessments/{assessment}/questions/{question}', [AssessmentController::class, 'updateQuestion']);
    Route::delete('/courses/{course}/assessments/{assessment}/questions/{question}', [AssessmentController::class, 'deleteQuestion']);

    // --- SUBMISSIONS & GRADING ---
    Route::post('/courses/{course}/assessments/{assessment}/start', [SubmissionController::class, 'start']);
    Route::post('/courses/{course}/assessments/{assessment}/submit', [SubmissionController::class, 'submit']);
    Route::get('/courses/{course}/assessments/{assessment}/submissions', [SubmissionController::class, 'index']);
    Route::get('/courses/{course}/assessments/{assessment}/submissions/{submission}', [SubmissionController::class, 'show']);
    Route::put('/courses/{course}/assessments/{assessment}/submissions/{submission}/grade', [SubmissionController::class, 'grade']);

    // --- ANNOUNCEMENTS ---
    Route::get('/courses/{course}/announcements', [AnnouncementController::class, 'index']);
    Route::post('/courses/{course}/announcements', [AnnouncementController::class, 'store']);
    Route::put('/courses/{course}/announcements/{announcement}', [AnnouncementController::class, 'update']);
    Route::delete('/courses/{course}/announcements/{announcement}', [AnnouncementController::class, 'destroy']);

    // --- CALENDAR ---
    Route::get('/calendar', [CalendarController::class, 'index']);
    Route::post('/courses/{course}/calendar', [CalendarController::class, 'store']);
    Route::put('/calendar/{calendarEvent}', [CalendarController::class, 'update']);
    Route::delete('/calendar/{calendarEvent}', [CalendarController::class, 'destroy']);

    // --- GRADES ---
    Route::get('/courses/{course}/grades', [GradeController::class, 'index']);
    Route::post('/courses/{course}/grades/compute', [GradeController::class, 'compute']);

    // --- STUDENT ACTIVITY FEED ---
    Route::get('/student/feed', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        if (! $user->isStudent()) {
            return response()->json(['feed' => []]);
        }

        $courseIds = \App\Models\Enrollment::where('user_id', $user->id)
            ->where('status', 'active')
            ->pluck('course_id');

        $courses = \App\Models\Course::whereIn('id', $courseIds)
            ->pluck('name', 'id');

        $feed = collect();

        // Announcements
        \App\Models\Announcement::whereIn('course_id', $courseIds)
            ->orderBy('created_at', 'desc')->take(20)->get()
            ->each(fn($a) => $feed->push([
                'type'       => 'announcement',
                'title'      => $a->title,
                'body'       => $a->content,
                'course'     => $courses[$a->course_id] ?? '',
                'course_id'  => $a->course_id,
                'created_at' => $a->created_at,
            ]));

        // New assessments
        \App\Models\Assessment::whereIn('course_id', $courseIds)
            ->where('is_published', true)
            ->orderBy('created_at', 'desc')->take(20)->get()
            ->each(fn($a) => $feed->push([
                'type'       => 'assessment',
                'title'      => $a->title,
                'body'       => ucfirst(str_replace('_', ' ', $a->type)) . ' · ' . $a->total_points . ' pts',
                'course'     => $courses[$a->course_id] ?? '',
                'course_id'  => $a->course_id,
                'item_id'    => $a->id,
                'created_at' => $a->created_at,
            ]));

        // New lesson materials
        \App\Models\LessonMaterial::whereHas('lesson', fn($q) => $q->whereIn('course_id', $courseIds)->where('is_published', true))
            ->with('lesson:id,title,course_id')
            ->orderBy('created_at', 'desc')->take(20)->get()
            ->each(fn($m) => $feed->push([
                'type'       => 'material',
                'title'      => $m->title,
                'body'       => strtoupper($m->type) . ' uploaded to ' . ($m->lesson->title ?? ''),
                'course'     => $courses[$m->lesson->course_id ?? 0] ?? '',
                'course_id'  => $m->lesson->course_id ?? null,
                'lesson_id'  => $m->lesson_id,
                'created_at' => $m->created_at,
            ]));

        $sorted = $feed->sortByDesc('created_at')->values()->take(30);

        return response()->json(['feed' => $sorted]);
    });

    // --- ADMIN USER MANAGEMENT ---
    Route::get('/admin/users', [AdminController::class, 'listUsers']);
    Route::post('/admin/users', [AdminController::class, 'createUser']);
    Route::put('/admin/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);

});
