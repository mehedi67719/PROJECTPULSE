"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SubmitCheckInTable = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

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

  const handleSeeTask = (projectId) => {
    router.push(`/See-tasks/${projectId}`);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 md:px-8 py-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Submit Weekly Check-In</h1>

      {projects.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-400">
          No projects assigned yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 text-gray-100">
            <thead>
              <tr className="bg-gray-900">
                <th className="border-b border-gray-700 px-4 py-2 text-left">Project</th>
                <th className="border-b border-gray-700 px-4 py-2 text-left">Client</th>
                <th className="border-b border-gray-700 px-4 py-2 text-left">Employees</th>
                <th className="border-b border-gray-700 px-4 py-2 text-left">Timeline</th>
                <th className="border-b border-gray-700 px-4 py-2 text-left">Task Submitted</th>
                <th className="border-b border-gray-700 px-4 py-2 text-left">Remaining Days</th>
                <th className="border-b border-gray-700 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const projectTask = tasks.find((task) => task.projectId === project._id);
                const remainingDays = projectTask ? getRemainingDays(projectTask.SubmitDate) : 0;
                const isDisabled = projectTask && remainingDays > 0;

                return (
                  <tr key={project._id} className="hover:bg-gray-800">
                    <td className="border-b border-gray-700 px-4 py-2 max-w-[200px]">
                      <div className="line-clamp-2 overflow-hidden">{project.name}</div>
                    </td>
                    <td className="border-b border-gray-700 px-4 py-2 max-w-[150px]">
                      <div className="line-clamp-2 overflow-hidden">{project.client?.name || "-"}</div>
                    </td>
                    <td className="border-b border-gray-700 px-4 py-2 max-w-[200px]">
                      <div className="line-clamp-2 overflow-hidden">
                        {project.employees?.map((emp) => emp.name).join(", ") || "-"}
                      </div>
                    </td>
                    <td className="border-b border-gray-700 px-4 py-2">
                      {new Date(project.startDate).toLocaleDateString()} – {new Date(project.endDate).toLocaleDateString()}
                    </td>
                    <td className="border-b border-gray-700 px-4 py-2">{projectTask ? "Yes" : "No"}</td>
                    <td className="border-b border-gray-700 px-4 py-2">{projectTask ? remainingDays : "-"}</td>
                    <td className="border-b border-gray-700 px-4 py-2 flex gap-2">
                      {isDisabled && (
                        <>
                          <button
                            disabled
                            className="bg-gray-700 text-gray-400 py-1 px-3 rounded font-semibold cursor-not-allowed"
                          >
                            Already Submitted
                          </button>
                          <button
                            onClick={() => handleSeeTask(project._id)}
                            className="bg-green-600 hover:bg-green-700 py-1 px-3 rounded text-white font-semibold"
                          >
                            See Your Task
                          </button>
                        </>
                      )}
                      {!projectTask && (
                        <Link
                          href={`/Weekly-chake-in?projectId=${project._id}`}
                          className="bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded text-white font-semibold"
                        >
                          Submit Check-in
                        </Link>
                      )}
                      {projectTask && !isDisabled && (
                        <button
                          onClick={() => handleSeeTask(project._id)}
                          className="bg-green-600 hover:bg-green-700 py-1 px-3 rounded text-white font-semibold"
                        >
                          See Your Task
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmitCheckInTable;
