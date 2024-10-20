package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Sprint
import com.evgenltd.flexify.microapp.jirify.common.entity.SprintTask
import com.evgenltd.flexify.user.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface SprintTaskRepository : JpaRepository<SprintTask, UUID> {
    fun findBySprint(sprint: Sprint): List<SprintTask>
}

fun SprintTaskRepository.task(user: User, id: UUID): SprintTask {
    val task = findByIdOrNull(id)
        ?: throw ApplicationException("Task not found")

    if (task.sprint.workspace.user.id != user.id) {
        throw ApplicationException("Task not found")
    }

    return task
}