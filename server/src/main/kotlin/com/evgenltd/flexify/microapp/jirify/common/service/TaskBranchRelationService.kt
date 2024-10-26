package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Branch
import com.evgenltd.flexify.microapp.jirify.common.entity.Repository
import com.evgenltd.flexify.microapp.jirify.common.entity.Task
import com.evgenltd.flexify.microapp.jirify.common.repository.BranchRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class TaskBranchRelationService(
    private val branchRepository: BranchRepository,
) {

    @Transactional
    fun linkToBranch(
        task: Task,
        repository: Repository,
        branchId: UUID?,
        branchName: String?,
        parentBranchId: UUID?,
        customizeBranch: (Branch) -> Unit = {},
    ) {
        val currentBranch = task.branchByRepository(repository.id!!)
        if (branchId != null && currentBranch?.id == branchId) {
            return
        }

        task.branches.remove(currentBranch)
        if (branchId != null) {
            val branch = repository.branchNotNull(branchId)
            task.branches.add(branch)
            return
        }

        val actualName = branchName?.trim()
            ?.takeIf { it.isNotBlank() }
            ?: return

        val existedBranch = repository.branch(actualName)
        if (existedBranch != null) {
            throw ApplicationException("Branch already exists")
        }

        val parent = parentBranchId?.let {
            repository.branchNotNull(it)
        }

        val branch = Branch(
            name = branchName,
            repository = repository,
            parent = parent,
        )
        customizeBranch(branch)
        branchRepository.save(branch)

        task.branches.add(branch)
    }

}