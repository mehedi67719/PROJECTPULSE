'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";

const WeeklyCheckIn = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectId = searchParams.get('projectId');
    const { data: session } = useSession();
    const user = session?.user;

    const [project, setProject] = useState(null);
    const [progress, setProgress] = useState("");
    const [blockers, setBlockers] = useState("");
    const [confidence, setConfidence] = useState(3);
    const [completion, setCompletion] = useState(0);
    const [showRisk, setShowRisk] = useState(false);
    const [riskTitle, setRiskTitle] = useState("");
    const [riskSeverity, setRiskSeverity] = useState("Low");
    const [riskMitigation, setRiskMitigation] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;
            try {
                const res = await fetch(`http://localhost:5000/project/${projectId}`);
                const data = await res.json();
                setProject(data);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load project data'
                });
            }
        };
        fetchProject();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!progress || !blockers || !confidence || completion < 0 || completion > 100) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all fields correctly!'
            });
            return;
        }
        setLoading(true);
        try {
            const body = {
                projectId,
                employeemail: user.email,
                progressSummary: progress,
                blockers,
                confidenceLevel: confidence,
                completionPercentage: completion,
                SubmitDate: new Date().toLocaleDateString("en-GB")
            };
            if (showRisk && riskTitle) {
                body.risk = { title: riskTitle, severity: riskSeverity, mitigation: riskMitigation };
            }

            const res = await fetch(`http://localhost:5000/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Submitted!',
                    text: 'Weekly Check-in submitted successfully',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => { router.push("/Submit-chake-in"); });
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message || "Submission failed" });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center text-gray-300">Loading user...</div>;
    }

    return (
        <div className="min-h-screen max-w-[95%] mx-auto bg-gray-950 p-4 md:p-8 text-gray-100">
            {project ? (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
                    <h1 className="text-2xl font-bold mb-2">📝 Weekly Check-in: {project.name}</h1>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Progress Summary</label>
                            <textarea className="w-full p-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500" rows={4} value={progress} onChange={(e) => setProgress(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Blockers / Challenges</label>
                            <textarea className="w-full p-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500" rows={3} value={blockers} onChange={(e) => setBlockers(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Confidence Level</label>
                            <select value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="w-full p-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500" required>
                                <option value={1}>1 - Very Low</option>
                                <option value={2}>2 - Low</option>
                                <option value={3}>3 - Medium</option>
                                <option value={4}>4 - High</option>
                                <option value={5}>5 - Very High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Completion %</label>
                            <input type="number" value={completion} onChange={(e) => { let val = e.target.value; if (val === "") { setCompletion(""); return; } val = Number(val); if (val < 0) val = 0; if (val > 100) val = 100; setCompletion(val); }} className="w-full p-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500" placeholder="Enter completion %" required />
                        </div>

                        {!showRisk && (
                            <button type="button" onClick={() => setShowRisk(true)} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2.5 rounded-xl font-semibold">
                                Add Risk
                            </button>
                        )}

                        {showRisk && (
                            <div className="mt-4 border-t border-gray-700 pt-4">
                                <h2 className="text-lg font-semibold mb-2 text-white">Risk Details</h2>
                                <div className="mb-2">
                                    <label className="block text-gray-400 mb-1">Risk Title</label>
                                    <input type="text" value={riskTitle} onChange={(e) => setRiskTitle(e.target.value)} className="w-full p-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500" placeholder="Enter risk title" />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-400 mb-1">Severity</label>
                                    <select value={riskSeverity} onChange={(e) => setRiskSeverity(e.target.value)} className="w-full p-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1">Mitigation Plan</label>
                                    <textarea value={riskMitigation} onChange={(e) => setRiskMitigation(e.target.value)} className="w-full p-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500" rows={3} placeholder="Describe mitigation plan" />
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50">
                            {loading ? "Submitting..." : "Submit Weekly Check-in"}
                        </button>
                    </form>
                </div>
            ) : (
                <p className="text-gray-400 text-center mt-10">Loading project info...</p>
            )}
        </div>
    );
};

export default WeeklyCheckIn;
