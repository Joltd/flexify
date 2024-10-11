package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.microapp.jirify.common.entity.Task
import com.evgenltd.flexify.microapp.jirify.common.repository.TaskRepository
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.properties
import com.evgenltd.flexify.microapp.jirify.squadapp.record.TaskRecord
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service

@Service
class TaskService(
    private val taskRepository: TaskRepository,
) {

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