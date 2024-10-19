package com.evgenltd.flexify.microapp.jirify.common.record

import java.util.*

data class SelectEmployeeRecord(
    val id: UUID,
    val name: String,
    val me: Boolean,
)
