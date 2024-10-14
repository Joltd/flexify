package com.evgenltd.flexify.microapp.jirify.squadapp.record

import java.util.UUID

data class WorkspaceResponse(
    val id: UUID,
    val name: String,
    val backendRepository: RepositoryRecord,
    val frontendRepository: RepositoryRecord,
)