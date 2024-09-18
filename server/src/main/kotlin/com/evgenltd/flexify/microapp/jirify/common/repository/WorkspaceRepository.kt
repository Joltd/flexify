package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.microapp.jirify.common.entity.Workspace
import com.evgenltd.flexify.microapp.jirify.common.entity.WorkspaceKind
import com.evgenltd.flexify.user.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface WorkspaceRepository : JpaRepository<Workspace, UUID> {

    fun findByUserAndKind(user: User, kind: WorkspaceKind): Workspace?

}