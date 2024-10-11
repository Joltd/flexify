package com.evgenltd.flexify.microapp.jirify.squadapp.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.squadapp.record.TaskRecord
import com.evgenltd.flexify.microapp.jirify.squadapp.service.TaskService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TaskController(
    private val userService: UserService,
    private val taskService: TaskService,
) {

    @GetMapping("/api/app/jirify/squad-app/task")
    @JirifyAppSecured
    fun list(): List<TaskRecord> {
        val user = userService.getCurrentUserNotNull()
        return taskService.list(user)
    }

}