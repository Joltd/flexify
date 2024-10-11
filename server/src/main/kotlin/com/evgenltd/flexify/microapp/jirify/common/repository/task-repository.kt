package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Task
import com.evgenltd.flexify.user.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TaskRepository : JpaRepository<Task, UUID> {

    fun findByKey(key: String): Task?

}

fun TaskRepository.findByIdAndUser(id: UUID, user: User): Task {
    val task = findById(id).orElse(null)
        ?: throw ApplicationException("Task not found")

    if (task.workspace.user.id != user.id) {
        throw ApplicationException("Task not found")
    }

    return task
}