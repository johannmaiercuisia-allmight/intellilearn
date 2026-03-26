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

    // --- ADMIN USER MANAGEMENT ---
    Route::get('/admin/users', [AdminController::class, 'listUsers']);
    Route::post('/admin/users', [AdminController::class, 'createUser']);
    Route::put('/admin/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);

});
