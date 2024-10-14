package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Branch
import com.evgenltd.flexify.microapp.jirify.common.record.SelectBranchRecord
import com.evgenltd.flexify.microapp.jirify.common.repository.*
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class BranchService(
    private val workspaceRepository: WorkspaceRepository,
    private val repositoryRepository: RepositoryRepository,
    private val branchRepository: BranchRepository,
) {

    @Transactional
    fun select(user: User, workspaceId: UUID, repositoryId: UUID?): List<SelectBranchRecord> =
        workspaceRepository.workspace(user, workspaceId)
            .repositories
            .filter { repositoryId == null || it.id == repositoryId }
            .flatMap { it.branches }
            .map { SelectBranchRecord(it.id!!, it.name, it.repository.id!!) }

    @Transactional
    fun create(user: User, name: String, parentId: UUID?, repositoryId: UUID): Branch {
        val repository = repositoryRepository.repository(user, repositoryId)

        val existedBranch = branchRepository.findByName(name)
        if (existedBranch != null) {
            throw ApplicationException("Branch already exists")
        }

        val parent = parentId?.let {
            repository.branch(parentId) ?: throw ApplicationException("Parent branch not found")
        }

        val branch = Branch(
            name = name,
            repository = repository,
            parent = parent,
        )
        return branchRepository.save(branch)
    }

}