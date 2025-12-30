'use client'
import React, { useEffect, useState } from 'react'

const ProjectsHealth = () => {
    const [projects, setProjects] = useState([])
    const [healthData, setHealthData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('https://projectpules-server.onrender.com/all-projects')
                const data = await res.json()
                setProjects(data)

                const healthResults = {}
                for (let project of data) {
                    const tasksRes = await fetch(`https://projectpules-server.onrender.com/tasks/${project._id}`)
                    const tasks = tasksRes.ok ? await tasksRes.json() : []

                    const feedbackRes = await fetch(`https://projectpules-server.onrender.com/feedback?projectId=${project._id}`)
                    const feedbacks = feedbackRes.ok ? await feedbackRes.json() : []

                    const avgClientSatisfaction = feedbacks.length
                        ? feedbacks.reduce((sum, f) => sum + f.satisfaction, 0) / feedbacks.length
                        : 0

                    const avgEmployeeConfidence = tasks.length
                        ? tasks.reduce((sum, t) => sum + t.confidenceLevel, 0) / tasks.length
                        : 0

                    const actualProgress = tasks.length
                        ? tasks.reduce((sum, t) => sum + t.completionPercentage, 0) / tasks.length
                        : 0

                    const flaggedIssues = feedbacks.filter(f => f.flagIssue).length
                    const riskPenalty = tasks.length ? (flaggedIssues / tasks.length) * 100 : 0

                    const healthScore =
                        0.4 * (avgClientSatisfaction / 5 * 100) +
                        0.3 * (avgEmployeeConfidence / 5 * 100) +
                        0.2 * actualProgress -
                        0.1 * riskPenalty

                    let status = 'Critical'
                    if (healthScore >= 80) status = 'On Track'
                    else if (healthScore >= 60) status = 'At Risk'

                    healthResults[project._id] = {
                        healthScore: Math.round(healthScore),
                        status,
                    }
                }

                setHealthData(healthResults)
                setLoading(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                Loading projects...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6 text-white">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">
                Projects Health Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(project => {
                    const health = healthData[project._id] || {}
                    return (
                        <div
                            key={project._id}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition"
                        >
                            <div>
                                <h2 className="text-xl font-semibold mb-2 text-white">{project.name}</h2>
                                <p className="text-gray-400 text-sm mb-2 line-clamp-3">{project.description}</p>
                                <p className="text-gray-300 text-sm">
                                    Timeline: {project.startDate} - {project.endDate}
                                </p>
                                <p className="text-gray-300 text-sm">
                                    Status: <span className={`font-bold ${health.status === 'On Track' ? 'text-green-400' : health.status === 'At Risk' ? 'text-yellow-400' : 'text-red-400'}`}>{health.status || '-'}</span>
                                </p>
                            </div>
                            <div className="mt-4">
                                <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
                                    <div
                                        className={`h-4 rounded-full ${
                                            health.status === 'On Track'
                                                ? 'bg-green-400'
                                                : health.status === 'At Risk'
                                                ? 'bg-yellow-400'
                                                : 'bg-red-500'
                                        }`}
                                        style={{ width: `${health.healthScore || 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-300 text-sm text-right">{health.healthScore || 0}%</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProjectsHealth
