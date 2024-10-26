package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.common.FieldRecord
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class RepositoryService(
    private val workspaceRepository: WorkspaceRepository,
) {

    fun field(user: User, workspaceId: UUID): List<FieldRecord> =
        workspaceRepository.workspace(user, workspaceId)
            .repositories
            .map { FieldRecord(it.id!!, it.name) }

}