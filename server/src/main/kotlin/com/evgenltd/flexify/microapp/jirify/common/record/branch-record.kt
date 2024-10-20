package com.evgenltd.flexify.microapp.jirify.common.record

import java.util.UUID

data class SelectBranchRecord(
    val id: UUID,
    val name: String,
    val repository: UUID,
)

data class CreateBranchRequest(
    val name: String,
    val parent: UUID?,
    val repository: UUID,
)

data class UpdateBranchRequest(
    val id: UUID,
    val name: String,
    val parent: UUID?,
    val repository: UUID,
)