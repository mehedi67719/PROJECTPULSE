'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import Swal from 'sweetalert2'

const ClientFeedback = () => {
    const { data: session, status } = useSession()
    const user = session?.user
    const [projects, setProjects] = useState([])
    const [tasksByProject, setTasksByProject] = useState({})
    const [feedback, setFeedback] = useState({})

    useEffect(() => {
        if (!user) return
        const loadProjects = async () => {
            const res = await fetch(`https://projectpules-server.onrender.com/all-projects/${user.email}/client`)
            const data = await res.json()
            setProjects(data)
            data.forEach(p => loadTasks(p._id))
        }
        const loadTasks = async projectId => {
            const res = await fetch(`https://projectpules-server.onrender.com/tasks/${projectId}`)
            const data = res.ok ? await res.json() : []
            setTasksByProject(prev => ({ ...prev, [projectId]: data }))
        }
        loadProjects()
    }, [user])

    const handleStarClick = (projectId, field, value) => {
        setFeedback(prev => ({
            ...prev,
            [projectId]: {
                ...prev[projectId],
                [field]: value
            }
        }))
    }

    const submitFeedback = async projectId => {
        const payload = feedback[projectId]
        if (!payload || !payload.satisfaction || !payload.communication) {
            return Swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text: 'Please select ratings before submitting!'
            })
        }
        try {
            const res = await fetch(`https://projectpules-server.onrender.com/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, clientEmail: user.email, ...payload })
            })
            const data = await res.json()
            if (data.success) {
                Swal.fire({ icon: 'success', title: 'Feedback Submitted', text: 'Thank you for your feedback!' })
            } else {
                Swal.fire({ icon: 'error', title: 'Failed', text: data.message || 'Something went wrong' })
            }
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to submit feedback' })
        }
    }

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-950 px-4 py-8 text-white">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-400">Client Feedback</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(project => {
                    const tasks = tasksByProject[project._id] || []
                    const hasTasks = tasks.length > 0
                    const projFeedback = feedback[project._id] || {}
                    return (
                        <div key={project._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-3">{project.name}</h2>
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-blue-300">Weekly Check-ins</h3>
                                    {hasTasks ? tasks.map(task => (
                                        <div key={task._id} className="bg-gray-800 rounded-lg p-3 text-sm space-y-1">
                                            <p className="text-gray-300"><span className="font-medium">Employee:</span> {task.employeemail}</p>
                                            <p className="text-gray-400 line-clamp-2">{task.progressSummary}</p>
                                            <div className="flex justify-between text-xs text-gray-400 pt-1">
                                                <span>Confidence: {task.confidenceLevel}/5</span>
                                                <span>{task.completionPercentage}%</span>
                                            </div>
                                        </div>
                                    )) : <p className="text-sm text-red-400">No check-in submitted yet</p>}
                                </div>
                            </div>
                            {hasTasks && (
                                <div className="mt-5 space-y-3 border-t border-gray-700 pt-4">
                                    <div>
                                        <p className="text-sm text-gray-300 mb-1">Satisfaction</p>
                                        <div className="flex gap-1">
                                            {[1,2,3,4,5].map(star => (
                                                <FaStar key={star} size={20} className={`cursor-pointer ${projFeedback.satisfaction >= star ? 'text-yellow-400' : 'text-gray-500'}`} onClick={() => handleStarClick(project._id,'satisfaction',star)} />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300 mb-1">Communication</p>
                                        <div className="flex gap-1">
                                            {[1,2,3,4,5].map(star => (
                                                <FaStar key={star} size={20} className={`cursor-pointer ${projFeedback.communication >= star ? 'text-yellow-400' : 'text-gray-500'}`} onClick={() => handleStarClick(project._id,'communication',star)} />
                                            ))}
                                        </div>
                                    </div>
                                    <textarea rows={2} placeholder="Comments (optional)" className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={e => handleStarClick(project._id,'comments',e.target.value)} />
                                    <label className="flex items-center gap-2 text-xs text-gray-300">
                                        <input type="checkbox" className="accent-blue-500" onChange={e => handleStarClick(project._id,'flagIssue',e.target.checked)} />
                                        Flag an issue
                                    </label>
                                    <button onClick={() => submitFeedback(project._id)} className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-sm font-semibold transition">Submit Feedback</button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ClientFeedback
