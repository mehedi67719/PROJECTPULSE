"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SeeTasks = () => {
  const params = useParams();
  const projectId = params.projectId; 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:5000/tasks/${projectId}`);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading tasks...
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-gray-950 px-4">
        No tasks submitted yet for this project.
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[95%] mx-auto bg-gray-950 px-4 md:px-8 py-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Project Tasks</h1>
      
      <div className="flex flex-col items-center gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:shadow-xl transition w-full "
          >
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-semibold">Employee Email:</span> {task.employeemail}
            </p>
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-semibold">Progress Summary:</span> {task.progressSummary}
            </p>
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-semibold">Blockers:</span> {task.blockers}
            </p>
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-semibold">Confidence Level:</span> {task.confidenceLevel}
            </p>
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-semibold">Completion %:</span> {task.completionPercentage}%
            </p>
            <p className="text-gray-400 text-sm">
              <span className="font-semibold">Submit Date:</span> {task.SubmitDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeeTasks;
