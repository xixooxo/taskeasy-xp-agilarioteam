"use client"

import { useState, useEffect } from "react"
import { TaskForm } from "@/components/task-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, Plus, BarChart3 } from "lucide-react" // BarChart3 akan dihapus

export interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "to-do" | "in-progress" | "done"
  createdAt: string
  updatedAt: string
}

export default function TaskEasyApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskeasy-tasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskeasy-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
    )
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const startEditing = (task: Task) => {
    setEditingTask(task)
  }

  const cancelEditing = () => {
    setEditingTask(null)
  }
  

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckSquare className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">TaskEasy</h1>
          </div>
          <p className="text-lg text-gray-600">Simple task management for agile teams</p>
        </div>


        <Tabs defaultValue="add" className="space-y-6"> {/* Default value diubah ke "add" */}
          <TabsList className="grid w-full grid-cols-1 max-w-sm mx-auto"> {/* Grid hanya 1 kolom */}
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add/Edit Task
            </TabsTrigger>

          </TabsList>


          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>{editingTask ? "Edit Task" : "Add New Task"}</CardTitle>
                <CardDescription>
                  {editingTask
                    ? "Update the task details below"
                    : "Create a new task with title, description, and priority"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskForm
                  onSubmit={editingTask ? (data) => updateTask(editingTask.id, data) : addTask}
                  initialData={editingTask}
                  onCancel={editingTask ? cancelEditing : undefined}
                />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}