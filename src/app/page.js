'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

const Home = () => {
    const { data: session, status } = useSession()
    const email = session?.user?.email

    const [role, setRole] = useState('')
    const [projects, setProjects] = useState([])
    const [users, setUsers] = useState([])
    const [tasks, setTasks] = useState([])
    const [healthMap, setHealthMap] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!email) return

        const load = async () => {
            try {
                const roleRes = await fetch(
                    `http://localhost:5000/api/user-role?email=${email}`
                )
                const roleData = await roleRes.json()
                setRole(roleData.role)

                let projectData = []

                if (roleData.role === 'admin') {
                    const [p, u] = await Promise.all([
                        fetch('http://localhost:5000/all-projects').then(r => r.json()),
                        fetch('http://localhost:5000/users').then(r => r.json())
                    ])
                    projectData = p
                    setProjects(p)
                    setUsers(u)
                }

                if (roleData.role === 'client') {
                    projectData = await fetch(
                        `http://localhost:5000/all-projects/${email}/client`
                    ).then(r => r.json())
                    setProjects(projectData)
                }

                if (roleData.role === 'employee') {
                    const [p, t] = await Promise.all([
                        fetch(`http://localhost:5000/all-projects/${email}/employee`).then(r => r.json()),
                        fetch(`http://localhost:5000/tasks/email?email=${email}`).then(r => r.json())
                    ])
                    projectData = p
                    setProjects(p)
                    setTasks(t)
                }

                
                const map = {}
                for (let project of projectData) {
                    const [tasksRes, feedbackRes] = await Promise.all([
                        fetch(`http://localhost:5000/tasks/${project._id}`),
                        fetch(`http://localhost:5000/feedback?projectId=${project._id}`)
                    ])

                    const taskList = tasksRes.ok ? await tasksRes.json() : []
                    const feedbacks = feedbackRes.ok ? await feedbackRes.json() : []

                    const avgClientSatisfaction = feedbacks.length
                        ? feedbacks.reduce((s, f) => s + f.satisfaction, 0) / feedbacks.length
                        : 0

                    const avgEmployeeConfidence = taskList.length
                        ? taskList.reduce((s, t) => s + t.confidenceLevel, 0) / taskList.length
                        : 0

                    const actualProgress = taskList.length
                        ? taskList.reduce((s, t) => s + t.completionPercentage, 0) / taskList.length
                        : 0

                    const flaggedIssues = feedbacks.filter(f => f.flagIssue).length
                    const riskPenalty = taskList.length ? (flaggedIssues / taskList.length) * 100 : 0

                    const score =
                        0.4 * (avgClientSatisfaction / 5 * 100) +
                        0.3 * (avgEmployeeConfidence / 5 * 100) +
                        0.2 * actualProgress -
                        0.1 * riskPenalty

                    let status = 'Critical'
                    if (score >= 80) status = 'On Track'
                    else if (score >= 60) status = 'At Risk'

                    map[project._id] = status
                }

                setHealthMap(map)
                setLoading(false)
            } catch (err) {
                console.error(err)
                setLoading(false)
            }
        }

        load()
    }, [email])

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                Loading Home ...
            </div>
        )
    }

    const countByStatus = status =>
        Object.values(healthMap).filter(s => s === status).length

    return (
        <div className="min-h-screen bg-gray-950 p-6 text-white">
            <h1 className="text-3xl font-bold text-center mb-10 text-blue-400">
                Dashboard Overview
            </h1>

       
            {role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Stat title="Total Projects" value={projects.length} />
                    <Stat title="On Track Projects" value={countByStatus('On Track')} color="green" />
                    <Stat title="At Risk Projects" value={countByStatus('At Risk')} color="yellow" />
                    <Stat title="Critical Projects" value={countByStatus('Critical')} color="red" />
                    <Stat
                        title="Total Employees"
                        value={users.filter(u => u.role === 'employee').length}
                    />
                    <Stat
                        title="Total Clients"
                        value={users.filter(u => u.role === 'client').length}
                    />
                </div>
            )}

          
            {role === 'client' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Stat title="My Projects" value={projects.length} />
                    <Stat title="On Track" value={countByStatus('On Track')} color="green" />
                    <Stat title="At Risk" value={countByStatus('At Risk')} color="yellow" />
                    <Stat title="Critical" value={countByStatus('Critical')} color="red" />
                </div>
            )}

      
            {role === 'employee' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Stat title="Assigned Projects" value={projects.length} />
                    <Stat title="Total Tasks" value={tasks.length} />
                    <Stat
                        title="Completed Tasks"
                        value={tasks.filter(t => t.completionPercentage === 100).length}
                        color="green"
                    />
                    <Stat
                        title="Pending Tasks"
                        value={tasks.filter(t => t.completionPercentage < 100).length}
                        color="yellow"
                    />
                </div>
            )}
        </div>
    )
}

const Stat = ({ title, value, color }) => {
    const colorMap = {
        green: 'text-green-400',
        yellow: 'text-yellow-400',
        red: 'text-red-400'
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-400 text-sm mb-2">{title}</p>
            <h2 className={`text-4xl font-bold ${colorMap[color] || 'text-white'}`}>
                {value}
            </h2>
        </div>
    )
}

export default Home
