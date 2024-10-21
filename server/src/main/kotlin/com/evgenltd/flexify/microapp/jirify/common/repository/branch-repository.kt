package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Branch
import com.evgenltd.flexify.user.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface BranchRepository : JpaRepository<Branch, UUID>

fun BranchRepository.branch(user: User, id: UUID): Branch {
    val branch = findByIdOrNull(id)
        ?: throw ApplicationException("Branch not found")

    if (branch.repository.workspace.user.id != user.id) {
        throw ApplicationException("Branch not found")
    }

    return branch
}