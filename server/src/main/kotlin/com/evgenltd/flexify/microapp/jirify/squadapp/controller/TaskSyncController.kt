package com.evgenltd.flexify.microapp.jirify.squadapp.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.squadapp.service.TaskSyncPerformService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TaskSyncController(
    private val userService: UserService,
    private val taskSyncPerformService: TaskSyncPerformService,
) {

    @PostMapping("/api/app/jirify/squad-app/sync")
    @JirifyAppSecured
    fun sync(): ResponseEntity<Unit> {
        val user = userService.getCurrentUser()
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED.value()).build()
        taskSyncPerformService.perform(user)
        return ResponseEntity.ok().build()
    }

}