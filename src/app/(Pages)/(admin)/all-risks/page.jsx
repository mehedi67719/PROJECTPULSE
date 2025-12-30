"use client";
import React, { useEffect, useState } from "react";

const Allrisks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("https://projectpules-server.vercel.app/tasks");
        const data = await res.json();
        const onlyRiskTasks = data.filter(task => task.risk);
        setTasks(onlyRiskTasks);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

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
            map[task.projectId] = data?.name || "Unnamed Project";
          }
        })
      );

      setProjects(map);
    };

    fetchProjects();
  }, [tasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading risks...
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[95%] mx-auto px-4 py-6 text-gray-100 bg-gray-950">
      <h1 className="text-3xl font-bold mb-6">All Reported Risks</h1>

      {tasks.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-400">
          No risks reported yet
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg"
            >
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-blue-400">
                  {projects[task.projectId] || "Loading project..."}
                </h2>
                <p className="text-xs text-gray-400">
                  Reported by: {task.employeemail}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Risk Title:</span>{" "}
                  {task.risk.title}
                </p>

                <p>
                  <span className="text-gray-400">Severity:</span>{" "}
                  <span
                    className={`font-bold ${
                      task.risk.severity === "High"
                        ? "text-red-400"
                        : task.risk.severity === "Medium"
                        ? "text-orange-400"
                        : "text-green-400"
                    }`}
                  >
                    {task.risk.severity}
                  </span>
                </p>

                <p className="text-gray-300">
                  <span className="text-gray-400">Mitigation:</span>{" "}
                  {task.risk.mitigation}
                </p>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Submitted on {task.SubmitDate}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allrisks;
