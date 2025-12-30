"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const severityColor = {
  Low: "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  High: "bg-red-500/20 text-red-400 border-red-500/30",
};

const ReportRisk = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const res = await fetch(
        `https://projectpules-server.vercel.app/tasks/email?email=${user.email}`
      );
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, [user]);

  useEffect(() => {
    if (tasks.length === 0) return;

    const fetchProjects = async () => {
      const map = {};

      await Promise.all(
        tasks.map(async (task) => {
          if (!map[task.projectId]) {
            const res = await fetch(
              `https://projectpules-server.vercel.app/project/${task.projectId}`
            );
            const data = await res.json();
            map[task.projectId] = data?.projectName || "Unnamed Project";
          }
        })
      );

      setProjects(map);
    };

    fetchProjects();
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-[95%] mx-auto py-10">
        <h1 className="text-4xl font-bold mb-10">Project Risk Overview</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-indigo-500/40 transition"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  {projects[task.projectId] || "Loading..."}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Submitted: {task.SubmitDate}
                </p>
              </div>

              {task.risk ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risk Identified</span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${
                        severityColor[task.risk.severity]
                      }`}
                    >
                      {task.risk.severity}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Title</p>
                    <p className="text-base">{task.risk.title}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Mitigation Plan</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {task.risk.mitigation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                  No risk reported for this project
                </div>
              )}
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            No project data found
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportRisk;
