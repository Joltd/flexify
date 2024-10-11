package com.evgenltd.flexify.microapp.jirify.squadapp.record

import com.evgenltd.flexify.microapp.jirify.common.entity.TaskStatus
import java.util.*

data class TaskRecord(
    val id: UUID,
    val key: String,
    val summary: String,
    val url: String,
    val status: TaskStatus?,
    val externalStatus: String?,
    val priority: Int?,
    val backend: Boolean,
    val frontend: Boolean,
)