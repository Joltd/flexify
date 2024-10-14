package com.evgenltd.flexify.microapp.jirify.common.record

import java.util.UUID

data class SelectBranchRecord(
    val id: UUID,
    val name: String,
    val repository: UUID,
)

data class ChooseBranchRecord(
    val id: UUID?,
    val create: CreateBranch?,
)

data class CreateBranch(
    val name: String,
    val parent: UUID?,
    val repository: UUID,
)

data class CreateBranchRequest(
    val workspace: UUID,
    val name: String,
    val parent: UUID?,
    val repository: UUID,
)