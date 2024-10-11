package com.evgenltd.flexify.microapp.jirify.squadapp.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.squadapp.service.WorkspaceService
import com.evgenltd.flexify.microapp.jirify.squadapp.record.WorkspaceResponse
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController("squadAppWorkspaceController")
class WorkspaceController(
    private val userService: UserService,
    private val workspaceService: WorkspaceService,
) {

    @GetMapping("/api/app/jirify/squad-app/workspace")
    @JirifyAppSecured
    fun workspace(): WorkspaceResponse {
        val user = userService.getCurrentUserNotNull()
        return workspaceService.workspace(user)
    }

}