"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

interface TaskSearchFilterProps {
  onSearchChange: (search: string) => void
  onPriorityFilter: (priority: string) => void
  onStatusFilter: (status: string) => void
  onClearFilters: () => void
  searchTerm: string
  priorityFilter: string
  statusFilter: string
  totalTasks: number
  filteredCount: number
}

export function TaskSearchFilter({
  onSearchChange,
  onPriorityFilter,
  onStatusFilter,
  onClearFilters,
  searchTerm,
  priorityFilter,
  statusFilter,
  totalTasks,
  filteredCount,
}: TaskSearchFilterProps) {
  const hasActiveFilters = searchTerm || priorityFilter !== "all" || statusFilter !== "all"

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Search & Filter Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">
              Search Tasks
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filter by Priority</Label>
              <Select value={priorityFilter} onValueChange={onPriorityFilter}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">🔴 High Priority</SelectItem>
                  <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                  <SelectItem value="low">🟢 Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={onStatusFilter}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="to-do">📋 To Do</SelectItem>
                  <SelectItem value="in-progress">⚡ In Progress</SelectItem>
                  <SelectItem value="done">✅ Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
            <Button
              variant="outline"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="h-11 px-6 w-full md:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>

            <div className="bg-gray-50 rounded-lg p-3 w-full md:w-auto flex-grow md:text-right">
              <div className="flex items-center justify-between md:justify-end md:gap-3">
                <span>
                  Showing <strong className="text-indigo-600">{filteredCount}</strong> of <strong>{totalTasks}</strong>{" "}
                  tasks
                </span>
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Filters active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}