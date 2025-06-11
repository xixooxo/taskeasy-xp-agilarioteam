"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Calendar, Clock } from "lucide-react"
import type { Task } from "@/app/page"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Task["status"]) => void
}

export function TaskList({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "to-do":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "✅"
      case "in-progress":
        return "⚡"
      case "to-do":
        return "📋"
    }
  }

  const getPriorityIcon = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "🔴"
      case "medium":
        return "🟡"
      case "low":
        return "🟢"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 truncate">{task.title}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{task.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 p-0"
                  data-testid="edit-button"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  data-testid="delete-button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={getPriorityColor(task.priority)}>
                {getPriorityIcon(task.priority)} {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>

              <Badge className={getStatusColor(task.status)}>
                {getStatusIcon(task.status)} {task.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDate(task.createdAt)}</span>
                </div>
                {task.updatedAt !== task.createdAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {formatDate(task.updatedAt)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Select value={task.status} onValueChange={(value: Task["status"]) => onStatusChange(task.id, value)}>
                  {/* Pindahkan data-testid ke SelectTrigger */}
                  <SelectTrigger className="w-32 h-8" data-testid="status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-do">📋 To Do</SelectItem>
                    <SelectItem value="in-progress">⚡ In Progress</SelectItem>
                    <SelectItem value="done">✅ Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}