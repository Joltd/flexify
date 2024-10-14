package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.microapp.jirify.common.entity.DevelopmentArea
import com.evgenltd.flexify.microapp.jirify.common.entity.WorkspaceKind
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.repositoryByType
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.toRecord
import com.evgenltd.flexify.microapp.jirify.squadapp.record.WorkspaceResponse
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service

@Service("squadAppWorkspaceService")
class WorkspaceService(
    private val workspaceRepository: WorkspaceRepository,
) {

    fun workspace(user: User): WorkspaceResponse = workspaceRepository
        .workspace(user, WorkspaceKind.SQUAD_APP)
        .let {
            WorkspaceResponse(
                id = it.id!!,
                name = it.name,
                backendRepository = it.repositoryByType(DevelopmentArea.BACKEND).toRecord(),
                frontendRepository = it.repositoryByType(DevelopmentArea.FRONTEND).toRecord(),
            )
        }

}