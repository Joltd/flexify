package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.microapp.jirify.common.entity.Task
import com.evgenltd.flexify.microapp.jirify.common.record.SelectTaskRecord
import com.evgenltd.flexify.microapp.jirify.common.repository.TaskRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.properties
import com.evgenltd.flexify.microapp.jirify.squadapp.record.TaskRecord
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import java.util.*

@Service
class TaskService(
    private val workspaceRepository: WorkspaceRepository,
    private val taskRepository: TaskRepository,
) {

    fun select(user: User, workspaceId: UUID): List<SelectTaskRecord> {
        val workspace = workspaceRepository.workspace(user, workspaceId)
        return taskRepository.findByWorkspace(workspace)
            .map { SelectTaskRecord(it.id!!, it.key, it.summary) }
    }

    fun list(user: User): List<TaskRecord> = taskRepository.findAll()
        .map { it.toRecord() }

    private fun Task.toRecord(): TaskRecord = TaskRecord(
        id = id!!,
        key = key,
        summary = summary,
        url = url,
        status = status,
        externalStatus = externalStatus,
        priority = priority,
        backend = properties().backend,
        frontend = properties().frontend,
    )

}