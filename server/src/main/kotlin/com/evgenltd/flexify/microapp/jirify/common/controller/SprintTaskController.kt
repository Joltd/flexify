package com.evgenltd.flexify.microapp.jirify.common.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.common.record.GetSprintTaskResponse
import com.evgenltd.flexify.microapp.jirify.common.record.UpdateSprintTaskRequest
import com.evgenltd.flexify.microapp.jirify.common.service.SprintTaskService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class SprintTaskController(
    private val userService: UserService,
    private val sprintTaskService: SprintTaskService,
) {

    @GetMapping("/api/app/jirify/sprint-task/{id}")
    @JirifyAppSecured
    fun getTask(
        @PathVariable id: UUID,
    ): GetSprintTaskResponse {
        val user = userService.getCurrentUserNotNull()
        return sprintTaskService.getTask(user, id)
    }

    @PutMapping("/api/app/jirify/sprint-task/{id}")
    @JirifyAppSecured
    fun updateTask(
        @PathVariable id: UUID,
        @RequestBody request: UpdateSprintTaskRequest,
    ) {
        val user = userService.getCurrentUserNotNull()
        sprintTaskService.updateTask(user, id, request)
    }
}