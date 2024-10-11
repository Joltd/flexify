package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Branch
import com.evgenltd.flexify.microapp.jirify.common.entity.Task
import com.evgenltd.flexify.microapp.jirify.common.repository.BranchRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.RepositoryRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.findByIdNotNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class TaskBranchRelationService(
    private val repositoryRepository: RepositoryRepository,
    private val branchRepository: BranchRepository,
) {

    @Transactional
    fun linkToBranch(task: Task, branchId: UUID) {
        val branch = branchRepository.findByIdNotNull(branchId)
        linkToBranch(task, branch)
    }

    @Transactional
    fun linkToNewBranch(task: Task, branchName: String, parentId: UUID?, repositoryId: UUID) {
        val branch = createBranch(branchName, parentId, repositoryId)
        linkToBranch(task, branch)
    }

    private fun createBranch(branchName: String, parentId: UUID?, repositoryId: UUID): Branch {
        val repository = repositoryRepository.findByIdNotNull(repositoryId)

        val existedBranch = branchRepository.findByName(branchName)
        if (existedBranch != null) {
            throw ApplicationException("Branch already exists")
        }

        val parent = repository.branches.firstOrNull { it.id == parentId }
        if (parentId != null && parent == null) {
            throw ApplicationException("Parent branch not found")
        }

        val branch = Branch(
            name = branchName,
            repository = repository,
            parent = parent,
        )
        return branchRepository.save(branch)
    }

    private fun linkToBranch(task: Task, branch: Branch) {
        val linkedBranches = task.branches.filter { it.id == branch.id || it.name == branch.name }
        if (linkedBranches.isNotEmpty()) {
            throw ApplicationException("Task already linked to branch")
        }

        task.branches.add(branch)
    }

}