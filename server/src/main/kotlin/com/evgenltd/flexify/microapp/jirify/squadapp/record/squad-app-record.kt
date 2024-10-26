package com.evgenltd.flexify.microapp.jirify.squadapp.record

import java.util.UUID

data class SquadAppWorkspaceData(
    val id: UUID,
    val backendRepository: UUID,
    val frontendRepository: UUID,
)