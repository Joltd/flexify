package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Workspace
import com.evgenltd.flexify.microapp.jirify.common.entity.WorkspaceKind
import com.evgenltd.flexify.user.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface WorkspaceRepository : JpaRepository<Workspace, UUID> {

    fun findByUserAndKind(user: User, kind: WorkspaceKind): Workspace?

}

fun WorkspaceRepository.workspace(user: User, workspaceId: UUID): Workspace {
    val workspace = findByIdOrNull(workspaceId)
        ?: throw ApplicationException("Workspace not found")

    if (workspace.user.id != user.id) {
        throw ApplicationException("Workspace not found")
    }

    return workspace
}

fun WorkspaceRepository.workspace(user: User, kind: WorkspaceKind): Workspace = findByUserAndKind(user, kind)
    ?: throw ApplicationException("Workspace not found")
