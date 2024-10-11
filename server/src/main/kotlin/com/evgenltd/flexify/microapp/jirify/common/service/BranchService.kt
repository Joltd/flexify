package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.microapp.jirify.common.record.SelectBranchRecord
import com.evgenltd.flexify.microapp.jirify.common.repository.BranchRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class BranchService(
    private val workspaceRepository: WorkspaceRepository,
    private val branchRepository: BranchRepository,
) {

    @Transactional
    fun select(user: User, workspaceId: UUID, repositoryId: UUID?): List<SelectBranchRecord> =
        workspaceRepository.workspace(user, workspaceId)
            .repositories
            .filter { repositoryId == null || it.id == repositoryId }
            .flatMap { it.branches }
            .map { SelectBranchRecord(it.id!!, it.name, it.repository.id!!) }

}