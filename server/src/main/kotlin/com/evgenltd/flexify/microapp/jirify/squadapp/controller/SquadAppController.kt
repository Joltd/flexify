package com.evgenltd.flexify.microapp.jirify.squadapp.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.common.entity.DevelopmentArea
import com.evgenltd.flexify.microapp.jirify.common.entity.WorkspaceKind
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.repositoryByType
import com.evgenltd.flexify.microapp.jirify.squadapp.record.SquadAppWorkspaceData
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SquadAppController(
    private val userService: UserService,
    private val workspaceRepository: WorkspaceRepository,
) {

    @GetMapping("/api/app/jirify/squad-app")
    @JirifyAppSecured
    fun squadApp(): SquadAppWorkspaceData {
        val user = userService.getCurrentUserNotNull()
        val workspace = workspaceRepository.workspace(user, WorkspaceKind.SQUAD_APP)
        return SquadAppWorkspaceData(
            id = workspace.id!!,
            backendRepository = workspace.repositoryByType(DevelopmentArea.BACKEND).id!!,
            frontendRepository = workspace.repositoryByType(DevelopmentArea.FRONTEND).id!!,
        )
    }

}