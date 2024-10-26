package com.evgenltd.flexify.microapp.jirify.common.record

import java.util.*

data class EmployeeRecord(
    val id: UUID,
    val name: String,
    val me: Boolean,
)