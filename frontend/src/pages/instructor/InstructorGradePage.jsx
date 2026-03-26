import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function InstructorGradePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => {
        setCourses(res.data.courses);
        if (res.data.courses.length > 0) setSelectedCourse(res.data.courses[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    api.get(`/courses/${selectedCourse}/assessments`)
      .then((res) => {
        setAssessments(res.data.assessments);
        setSelectedAssessment(null);
        setSubmissions([]);
      })
      .catch(console.error);
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse || !selectedAssessment) return;
    api.get(`/courses/${selectedCourse}/assessments/${selectedAssessment}/submissions`)
      .then((res) => setSubmissions(res.data.submissions))
      .catch(console.error);
  }, [selectedCourse, selectedAssessment]);

  const openGrading = async (submission) => {
    try {
      const res = await api.get(
        `/courses/${selectedCourse}/assessments/${selectedAssessment}/submissions/${submission.id}`
      );
      setGradingSubmission(res.data.submission);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    </div>;
  }

  const statusColors = {
    in_progress: 'bg-slate-100 text-slate-600',
    submitted: 'bg-amber-100 text-amber-700',
    graded: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Course</label>
          <select value={selectedCourse || ''} onChange={(e) => setSelectedCourse(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Assessment</label>
          <select value={selectedAssessment || ''} onChange={(e) => setSelectedAssessment(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
            <option value="">Select assessment...</option>
            {assessments.map((a) => (
              <option key={a.id} value={a.id}>{a.title} ({a.type.replace('_', ' ')})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grading modal */}
      {gradingSubmission && (
        <GradingPanel
          submission={gradingSubmission}
          courseId={selectedCourse}
          assessmentId={selectedAssessment}
          onClose={() => setGradingSubmission(null)}
          onGraded={() => {
            setGradingSubmission(null);
            // Refresh submissions
            api.get(`/courses/${selectedCourse}/assessments/${selectedAssessment}/submissions`)
              .then((res) => setSubmissions(res.data.submissions));
          }}
        />
      )}

      {/* Submissions table */}
      {selectedAssessment ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {submissions.length === 0 ? (
            <p className="text-slate-500 p-8 text-center">No submissions yet for this assessment.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Student</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Attempt</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Score</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-slate-600">Submitted</th>
                  <th className="text-right px-5 py-3 font-medium text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">
                        {sub.user?.first_name} {sub.user?.last_name}
                      </p>
                      <p className="text-xs text-slate-400">{sub.user?.email}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">#{sub.attempt_number}</td>
                    <td className="px-5 py-3">
                      {sub.percentage !== null ? (
                        <span className={`font-bold ${sub.percentage >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {sub.percentage}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize
                        ${statusColors[sub.status]}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString('en-PH') : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => openGrading(sub)}
                        className={`text-sm font-medium ${
                          sub.status === 'submitted'
                            ? 'text-teal-600 hover:text-teal-700'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {sub.status === 'submitted' ? 'Grade' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500">Select an assessment above to view submissions.</p>
        </div>
      )}
    </div>
  );
}

function GradingPanel({ submission, courseId, assessmentId, onClose, onGraded }) {
  const [grades, setGrades] = useState({});
  const [saving, setSaving] = useState(false);

  // Pre-fill existing grades
  useEffect(() => {
    const initial = {};
    submission.answers?.forEach((a) => {
      initial[a.question_id] = {
        points_earned: a.points_earned ?? '',
        ai_feedback: a.ai_feedback || '',
      };
    });
    setGrades(initial);
  }, [submission]);

  const updateGrade = (questionId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], [field]: value },
    }));
  };

  const handleSubmitGrades = async () => {
    setSaving(true);
    const gradeArray = Object.entries(grades)
      .filter(([_, g]) => g.points_earned !== '' && g.points_earned !== null)
      .map(([questionId, g]) => ({
        question_id: parseInt(questionId),
        points_earned: parseFloat(g.points_earned),
        ai_feedback: g.ai_feedback || null,
      }));

    try {
      await api.put(
        `/courses/${courseId}/assessments/${assessmentId}/submissions/${submission.id}/grade`,
        { grades: gradeArray }
      );
      onGraded();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save grades.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-teal-50 rounded-xl border border-teal-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-800">
          Grading: {submission.user?.first_name} {submission.user?.last_name}
          <span className="text-slate-400 font-normal ml-2">(Attempt #{submission.attempt_number})</span>
        </h4>
        <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">Close</button>
      </div>

      {submission.answers?.map((answer, idx) => (
        <div key={answer.id} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Q{idx + 1}: {answer.question?.question_text}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {answer.question?.type?.replace('_', ' ')} · {answer.question?.points} pts max
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Student's answer:</p>
            <p className="text-sm text-slate-800">{answer.answer_text || '(no answer)'}</p>
          </div>

          {answer.is_correct !== null && (
            <p className={`text-xs font-medium ${answer.is_correct ? 'text-emerald-600' : 'text-red-500'}`}>
              Auto-graded: {answer.is_correct ? '✓ Correct' : '✗ Incorrect'}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Points (max {answer.question?.points})
              </label>
              <input
                type="number"
                min={0}
                max={answer.question?.points}
                step={0.5}
                value={grades[answer.question_id]?.points_earned ?? ''}
                onChange={(e) => updateGrade(answer.question_id, 'points_earned', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Feedback</label>
              <input
                type="text"
                value={grades[answer.question_id]?.ai_feedback || ''}
                onChange={(e) => updateGrade(answer.question_id, 'ai_feedback', e.target.value)}
                placeholder="Optional feedback..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <button
          onClick={handleSubmitGrades}
          disabled={saving}
          className="bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold
            hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Grades'}
        </button>
        <button onClick={onClose}
          className="bg-white text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium
            hover:bg-slate-100 border border-slate-300 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
