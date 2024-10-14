package com.evgenltd.flexify.microapp.jirify.squadapp.record

import com.evgenltd.flexify.microapp.jirify.squadapp.entity.BranchKind
import java.util.UUID

data class BranchRecord(
    val id: UUID,
    val name: String,
    val kind: BranchKind,
)

data class CreateMergeRequestRequest(
    val repository: UUID,
    val sourceBranch: UUID,
    val targetBranch: UUID,
)

data class MergeRequestResponse(
    val iid: Long,
    val mergeStatus: String,
    val url: String,
)