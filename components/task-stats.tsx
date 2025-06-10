"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, CheckCircle, Clock, AlertCircle, Target } from "lucide-react"
import type { Task } from "@/app/page"
import "../styles/task-stats.css"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "done").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const todoTasks = tasks.filter((task) => task.status === "to-do").length

  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "To Do",
      value: todoTasks,
      icon: AlertCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ]

  // Helper function to get width class based on percentage
  const getWidthClass = (percentage: number): string => {
    const rounded = Math.round(percentage / 5) * 5 // Round to nearest 5
    return `w-${Math.min(100, Math.max(0, rounded))}`
  }

  const priorityStats = [
    {
      label: "High Priority",
      value: highPriorityTasks,
      colorClass: "priority-bar-high",
      percentage: totalTasks > 0 ? (highPriorityTasks / totalTasks) * 100 : 0,
    },
    {
      label: "Medium Priority",
      value: mediumPriorityTasks,
      colorClass: "priority-bar-medium",
      percentage: totalTasks > 0 ? (mediumPriorityTasks / totalTasks) * 100 : 0,
    },
    {
      label: "Low Priority",
      value: lowPriorityTasks,
      colorClass: "priority-bar-low",
      percentage: totalTasks > 0 ? (lowPriorityTasks / totalTasks) * 100 : 0,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Completion Rate
          </CardTitle>
          <CardDescription>Overall progress of your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completionRate.toFixed(1)}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
            <p className="text-sm text-gray-600">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
          <CardDescription>Breakdown of tasks by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priorityStats.map((priority) => (
              <div key={priority.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{priority.label}</span>
                  <span>
                    {priority.value} tasks ({priority.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="priority-bar-container">
                  <div className={`priority-bar ${priority.colorClass} ${getWidthClass(priority.percentage)}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {totalTasks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Task Status</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• {todoTasks} tasks waiting to start</li>
                  <li>• {inProgressTasks} tasks currently active</li>
                  <li>• {completedTasks} tasks finished</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Priority Focus</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• {highPriorityTasks} high priority tasks</li>
                  <li>• {mediumPriorityTasks} medium priority tasks</li>
                  <li>• {lowPriorityTasks} low priority tasks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
