package com.evgenltd.flexify.microapp.jirify.squadapp.record

import com.evgenltd.flexify.microapp.jirify.common.record.SelectRepositoryRecord
import java.util.UUID

data class WorkspaceResponse(
    val id: UUID,
    val name: String,
    val backendRepository: SelectRepositoryRecord,
    val frontendRepository: SelectRepositoryRecord,
)