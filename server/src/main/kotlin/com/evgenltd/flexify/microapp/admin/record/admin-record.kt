package com.evgenltd.flexify.microapp.admin.record

import com.evgenltd.flexify.microapp.MicroApp
import java.util.UUID

data class UserRecord(
    val id: UUID?,
    val login: String,
    val deleted: Boolean,
    val applications: List<MicroApp>,
)

data class CreateUserRequest(
    val login: String,
    val password: String,
    val applications: List<MicroApp> = emptyList(),
)

data class UpdateUserRequest(
    val login: String,
    val password: String?,
    val deleted: Boolean,
    val applications: List<MicroApp> = emptyList(),
)