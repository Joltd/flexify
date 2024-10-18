package com.evgenltd.flexify.microapp.jirify.common.record

import java.util.UUID

data class SelectTaskRecord(
    val id: UUID,
    val key: String,
    val summary: String,
)