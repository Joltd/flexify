package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Branch
import com.evgenltd.flexify.microapp.jirify.common.entity.Task
import com.evgenltd.flexify.microapp.jirify.common.repository.BranchRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.branch
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class TaskBranchRelationService(
    private val branchRepository: BranchRepository,
    private val branchService: BranchService,
) {

    @Transactional
    fun linkToBranch(user: User, task: Task, branchId: UUID) {
        val branch = branchRepository.branch(user, branchId)
        linkToBranch(task, branch)
    }

    @Transactional
    fun linkToNewBranch(user: User, task: Task, branchName: String, parentId: UUID?, repositoryId: UUID): Branch {
        val branch = branchService.create(user, branchName, parentId, repositoryId)
        linkToBranch(task, branch)
        return branch
    }

    private fun linkToBranch(task: Task, branch: Branch) {
        val linkedBranches = task.branches
            .filter { it.id == branch.id }
        if (linkedBranches.isNotEmpty()) {
            throw ApplicationException("Task already linked to branch")
        }

        task.branches.add(branch)
    }

}