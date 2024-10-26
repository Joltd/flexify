package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.common.FieldRecord
import com.evgenltd.flexify.microapp.jirify.common.repository.*
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class BranchService(
    private val workspaceRepository: WorkspaceRepository,
) {

    @Transactional
    fun field(user: User, workspaceId: UUID, repositoryId: UUID, hidden: Boolean, common: Boolean, base: Boolean): List<FieldRecord> =
        workspaceRepository.workspace(user, workspaceId)
            .repositories
            .filter { it.id == repositoryId }
            .flatMap { it.branches }
            .filter { hidden || it.hidden.not() }
            .filter { common || it.base }
            .filter { base || it.base.not() }
            .map { FieldRecord(it.id!!, it.name) }

}