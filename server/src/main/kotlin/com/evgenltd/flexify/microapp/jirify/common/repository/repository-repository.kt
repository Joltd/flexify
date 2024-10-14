package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Repository
import com.evgenltd.flexify.user.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
import java.util.*

@org.springframework.stereotype.Repository
interface RepositoryRepository : JpaRepository<Repository, UUID>

fun RepositoryRepository.repository(user: User, id: UUID): Repository {
    val repository = findByIdOrNull(id)
        ?: throw ApplicationException("Repository not found")

    if (repository.workspace.user.id != user.id) {
        throw ApplicationException("Repository not found")
    }

    return repository
}
