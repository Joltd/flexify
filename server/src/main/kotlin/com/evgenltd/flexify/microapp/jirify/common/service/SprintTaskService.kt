package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.microapp.jirify.common.record.GetSprintTaskResponse
import com.evgenltd.flexify.microapp.jirify.common.record.UpdateSprintTaskRequest
import com.evgenltd.flexify.microapp.jirify.common.repository.SprintTaskRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.task
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class SprintTaskService(
    private val sprintTaskRepository: SprintTaskRepository,
) {

    fun getTask(
        user: User,
        id: UUID,
    ): GetSprintTaskResponse {
        val task = sprintTaskRepository.task(user, id)
        task.task.branches
        return GetSprintTaskResponse(
            id = task.id!!,
            status = task.task.status,
            performed = task.performed,
        )
    }

    @Transactional
    fun updateTask(
        user: User,
        id: UUID,
        request: UpdateSprintTaskRequest,
    ) {
        val task = sprintTaskRepository.task(user, id)
        task.task.status = request.status
        task.performed = request.performed
    }

}