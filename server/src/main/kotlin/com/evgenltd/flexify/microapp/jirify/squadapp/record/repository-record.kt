package com.evgenltd.flexify.microapp.jirify.squadapp.record

import com.evgenltd.flexify.microapp.jirify.common.entity.DevelopmentArea
import java.util.UUID

data class RepositoryRecord(
    val id: UUID,
    val name: String,
    val type: DevelopmentArea,
)