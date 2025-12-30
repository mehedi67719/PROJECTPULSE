"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const MyTasks = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
   
        const res = await fetch(
          `https://projectpules-server.onrender.com/all-projects/${user.email}/${user.role}`
        );
        const projectData = await res.json();
        setProjects(projectData);

      
        const taskRes = await fetch(
          `https://projectpules-server.onrender.com/tasks/email?email=${user.email}`
        );
        const taskData = await taskRes.json();
        setTasks(taskData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);


  const getRemainingDays = (submitDate) => {
    const [d, m, y] = submitDate.split("/");
    const submit = new Date(y, m - 1, d);
    const today = new Date();

    const diffTime = today.getTime() - submit.getTime();
    const passedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (passedDays < 0) return 7;
    if (passedDays >= 7) return 0;

    return 7 - passedDays;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[95%] mx-auto bg-gray-950 px-4 md:px-8 py-6 text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Tasks</h1>
        <p className="text-gray-400 text-sm mt-1">
          View your assigned projects and submit weekly progress updates
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-400">
          No projects assigned yet
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
           
            const projectTask = tasks.find(
              (task) => task.projectId === project._id
            );

            const remainingDays = projectTask
              ? getRemainingDays(projectTask.SubmitDate)
              : 0;

            const isDisabled = projectTask && remainingDays > 0;

            return (
              <div
                key={project._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-white">
                      {project.name}
                    </h2>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        project.status === "on-track"
                          ? "bg-green-600/20 text-green-400"
                          : project.status === "at-risk"
                          ? "bg-orange-600/20 text-orange-400"
                          : project.status === "critical"
                          ? "bg-red-600/20 text-red-400"
                          : "bg-yellow-600/20 text-yellow-400"
                      }`}
                    >
                      {project.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-2">
                    {project.description}
                  </p>

                  <p className="text-gray-400 text-sm mb-2">
                    Timeline:{" "}
                    {new Date(project.startDate).toLocaleDateString()} –{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>

                
                  {project.employees && project.employees.length > 0 && (
                    <div className="text-gray-300 text-sm mb-2">
                      <span className="font-semibold">Employees:</span>{" "}
                      {project.employees.map((emp) => emp.name).join(", ")}
                    </div>
                  )}

                  
                  {project.client && (
                    <div className="text-gray-300 text-sm mb-2">
                      <span className="font-semibold">Client:</span>{" "}
                      {project.client.name}
                    </div>
                  )}
                </div>

                
                {isDisabled ? (
                  <div className="mt-4 text-center">
                    <button
                      disabled
                      className="w-full bg-gray-700 text-gray-400 py-2.5 rounded-xl font-semibold cursor-not-allowed"
                    >
                      Submit Disabled
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      Can be submitted after {remainingDays} more days.
                    </p>
                  </div>
                ) : (
                  <Link
                    href={`/Weekly-chake-in?projectId=${project._id}`}
                    className="mt-4 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold"
                  >
                    Submit Weekly Check-in
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
