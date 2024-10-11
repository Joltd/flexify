package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.microapp.jirify.common.record.SelectRepositoryRecord
import com.evgenltd.flexify.microapp.jirify.common.repository.RepositoryRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class RepositoryService(
    private val workspaceRepository: WorkspaceRepository,
    private val repositoryRepository: RepositoryRepository,
) {

    fun select(user: User, workspaceId: UUID): List<SelectRepositoryRecord> =
        workspaceRepository.workspace(user, workspaceId)
            .repositories
            .map { SelectRepositoryRecord(it.id!!, it.name) }

}