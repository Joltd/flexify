package com.evgenltd.flexify.microapp.jirify.squadapp.record

import com.evgenltd.flexify.microapp.jirify.squadapp.entity.BranchKind
import java.util.UUID

data class BranchRecord(
    val id: UUID,
    val name: String,
    val kind: BranchKind,
    val readyToProd: Boolean,
)

data class BranchAnalysisRecord(
    val id: UUID,
    val name: String,
    val tasks: List<BranchAnalysisTaskRecord>,
    val readyToProd: Boolean,
)

data class BranchAnalysisTaskRecord(
    val id: UUID,
    val key: String,
    val summary: String,
    val url: String,
    val externalStatus: String?,
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