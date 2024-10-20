package com.evgenltd.flexify.microapp.jirify.squadapp.record

import com.evgenltd.flexify.microapp.jirify.common.entity.DevelopmentArea
import com.evgenltd.flexify.microapp.jirify.common.entity.TaskStatus
import java.time.LocalDateTime
import java.util.UUID

data class ActiveSprintRequest(
    val employees: List<UUID>?,
    val areas: List<DevelopmentArea>?,
    val performed: Boolean?,
)

data class ActiveSprintResponse(
    val id: UUID,
    val key: String,
    val workspace: UUID,
    val updatedAt: LocalDateTime?,
    val groups: List<SprintTaskGroup>,
)

data class SprintTaskGroup(
    val status: TaskStatus,
    val tasks: List<SprintTaskRecord>,
)

data class SprintTaskRecord(
    val id: UUID,
    val key: String,
    val summary: String,
    val url: String,
    val status: TaskStatus,
    val externalStatus: String?,
    val assignee: AssigneeRecord?,
    val performed: Boolean,
    val estimation: Int?,
    val priority: Int?,
    val backend: Boolean,
    val frontend: Boolean,
)

data class AssigneeRecord(
    val id: UUID,
    val name: String,
)

data class CreateBranchRecord(
    val name: String,
    val parent: UUID?,
)

data class UpdateTaskRequest(
    val taskId: UUID,
    val status: TaskStatus,
    val performed: Boolean,
)

data class BeginWorkRequest(
    val taskId: UUID,
    val sendToJira: Boolean,
    val backend: UUID?,
    val createBackend: CreateBranchRecord?,
    val frontend: UUID?,
    val createFrontend: CreateBranchRecord?,
)