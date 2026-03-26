import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function InstructorStudentsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [progress, setProgress] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then((res) => {
        setCourses(res.data.courses);
        if (res.data.courses.length > 0) {
          setSelectedCourse(res.data.courses[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    Promise.all([
      api.get(`/courses/${selectedCourse}/progress`),
      api.get(`/courses/${selectedCourse}/students`),
    ])
      .then(([p, s]) => {
        setProgress(p.data.progress);
        setStudents(s.data.students);
      })
      .catch(console.error);
  }, [selectedCourse]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    </div>;
  }

  // Group progress by student
  const studentProgress = {};
  students.forEach((s) => {
    studentProgress[s.id] = {
      ...s,
      lessons: [],
      doneCount: 0,
      totalTime: 0,
    };
  });

  progress.forEach((p) => {
    if (studentProgress[p.user_id]) {
      studentProgress[p.user_id].lessons.push(p);
      if (p.status === 'done') studentProgress[p.user_id].doneCount++;
      studentProgress[p.user_id].totalTime += p.time_spent_seconds || 0;
    }
  });

  const statusColors = {
    pending: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-amber-100 text-amber-700',
    done: 'bg-emerald-100 text-emerald-700',
    missing: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Course selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">Course:</label>
        <select
          value={selectedCourse || ''}
          onChange={(e) => setSelectedCourse(parseInt(e.target.value))}
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
          ))}
        </select>
      </div>

      {/* Student progress table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-slate-600">Student</th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">Lessons Done</th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">Time Spent</th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">Lesson Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.values(studentProgress).map((sp) => (
              <tr key={sp.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-800">{sp.first_name} {sp.last_name}</p>
                  <p className="text-xs text-slate-400">{sp.email}</p>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {sp.doneCount} completed
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {Math.floor(sp.totalTime / 60)} min
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {sp.lessons.length === 0 ? (
                      <span className="text-xs text-slate-400">No activity</span>
                    ) : (
                      sp.lessons.map((l) => (
                        <span key={l.id}
                          className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[l.status]}`}
                          title={l.lesson?.title}
                        >
                          L{l.lesson?.order + 1}: {l.status}
                        </span>
                      ))
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                  No students enrolled in this course.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
