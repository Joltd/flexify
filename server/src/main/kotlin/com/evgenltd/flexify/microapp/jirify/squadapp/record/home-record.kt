package com.evgenltd.flexify.microapp.jirify.squadapp.record

import com.evgenltd.flexify.microapp.jirify.common.entity.TaskStatus
import com.evgenltd.flexify.microapp.jirify.common.record.ChooseBranchRecord
import java.time.LocalDateTime
import java.util.UUID

data class ActiveSprintResponse(
    val id: UUID,
    val key: String,
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
    val estimation: Int?,
    val priority: Int?,
    val backend: Boolean,
    val frontend: Boolean,
)

data class BeginWorkRequest(
    val taskId: UUID,
    val sendToJira: Boolean,
    val backend: ChooseBranchRecord?,
    val frontend: ChooseBranchRecord?,
)