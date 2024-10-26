package com.evgenltd.flexify.microapp.jirify.squadapp.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.squadapp.record.TaskDashboardData
import com.evgenltd.flexify.microapp.jirify.squadapp.record.TaskDashboardFilter
import com.evgenltd.flexify.microapp.jirify.squadapp.record.TaskDashboardTaskData
import com.evgenltd.flexify.microapp.jirify.squadapp.record.TaskDashboardTaskUpdateData
import com.evgenltd.flexify.microapp.jirify.squadapp.service.TaskDashboardService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class TaskDashboardController(
    private val userService: UserService,
    private val taskDashboardService: TaskDashboardService,
) {

    @GetMapping("/api/app/jirify/squad-app/task-dashboard")
    @JirifyAppSecured
    fun taskDashboard(filter: TaskDashboardFilter): TaskDashboardData {
        val user = userService.getCurrentUserNotNull()
        return taskDashboardService.taskDashboard(user, filter)
    }

    @GetMapping("/api/app/jirify/squad-app/task-dashboard/task/{id}")
    @JirifyAppSecured
    fun task(@PathVariable id: UUID): TaskDashboardTaskData {
        val user = userService.getCurrentUserNotNull()
        return taskDashboardService.task(user, id)
    }

    @PutMapping("/api/app/jirify/squad-app/task-dashboard/task/{id}")
    @JirifyAppSecured
    fun updateTask(@PathVariable id: UUID, @RequestBody data: TaskDashboardTaskUpdateData) {
        val user = userService.getCurrentUserNotNull()
        taskDashboardService.updateTask(user, id, data)
    }

}