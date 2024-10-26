package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.common.FieldRecord
import com.evgenltd.flexify.microapp.jirify.common.repository.TaskRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import java.util.*

@Service
class TaskService(
    private val workspaceRepository: WorkspaceRepository,
    private val taskRepository: TaskRepository,
) {

    fun field(user: User, workspaceId: UUID): List<FieldRecord> {
        val workspace = workspaceRepository.workspace(user, workspaceId)
        return taskRepository.findByWorkspace(workspace)
            .map { FieldRecord(it.id!!, it.key) }
    }

}