package com.evgenltd.flexify.microapp.jirify.common.record

import com.evgenltd.flexify.microapp.jirify.common.entity.TaskStatus
import java.util.UUID

data class GetSprintTaskResponse(
    val id: UUID,
    val status: TaskStatus,
    val performed: Boolean,
)

data class UpdateSprintTaskRequest(
    val status: TaskStatus,
    val performed: Boolean,
)