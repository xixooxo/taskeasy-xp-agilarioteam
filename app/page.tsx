"use client"

import { useState, useEffect, useMemo } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { TaskStats } from "@/components/task-stats"
import { TaskSearchFilter } from "@/components/task-search-filter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, Plus, BarChart3 } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState("tasks")

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

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
    setActiveTab("tasks") // Switch back to tasks tab after adding
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
    )
    setEditingTask(null)
    setActiveTab("tasks") // Switch back to tasks tab after updating
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const startEditing = (task: Task) => {
    setEditingTask(task)
    setActiveTab("add") // Automatically switch to add tab when editing
  }

  const cancelEditing = () => {
    setEditingTask(null)
    setActiveTab("tasks") // Switch back to tasks tab when canceling
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setPriorityFilter("all")
    setStatusFilter("all")
  }

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    return filtered
  }, [tasks, searchTerm, priorityFilter, statusFilter])

  // Sort filtered tasks by priority (high -> medium -> low) and then by creation date
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [filteredTasks])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckSquare className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Aplikasi TaskEasy</h1>
          </div>
          <p className="text-lg text-gray-600">Simple task management for agile teams</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {editingTask ? "Edit Task" : "Add Task"}
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            {/* Search & Filter Component */}
            <TaskSearchFilter
              onSearchChange={setSearchTerm}
              onPriorityFilter={setPriorityFilter}
              onStatusFilter={setStatusFilter}
              onClearFilters={clearFilters}
              searchTerm={searchTerm}
              priorityFilter={priorityFilter}
              statusFilter={statusFilter}
              totalTasks={tasks.length}
              filteredCount={filteredTasks.length}
            />

            <Card>
              <CardHeader>
                <CardTitle>Task List</CardTitle>
                <CardDescription>
                  {filteredTasks.length !== tasks.length
                    ? `Showing ${filteredTasks.length} of ${tasks.length} tasks`
                    : `${tasks.length} total tasks`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList
                  tasks={sortedTasks}
                  onEdit={startEditing}
                  onDelete={deleteTask}
                  onStatusChange={(id, status) => updateTask(id, { status })}
                />
              </CardContent>
            </Card>
          </TabsContent>

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

          <TabsContent value="stats">
            <TaskStats tasks={tasks} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
