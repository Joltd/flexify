package com.evgenltd.flexify.microapp.jirify.common.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.common.service.TaskService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class TaskController(
    private val userService: UserService,
    private val taskService: TaskService,
) {

    @GetMapping("/api/app/jirify/task/field")
    @JirifyAppSecured
    fun field(
        @RequestParam(name = "workspace") workspace: UUID,
    ) {
        val user = userService.getCurrentUserNotNull()
        taskService.field(user, workspace)
    }

}