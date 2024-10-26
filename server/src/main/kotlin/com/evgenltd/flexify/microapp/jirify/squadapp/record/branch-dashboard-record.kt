package com.evgenltd.flexify.microapp.jirify.squadapp.record

import com.evgenltd.flexify.microapp.jirify.common.entity.DevelopmentArea
import java.util.UUID

data class BranchDashboardFilter(
    val area: DevelopmentArea,
    val readyToProd: Boolean?,
    val hidden: Boolean?,
)

data class BranchDashboardEntry(
    val id: UUID,
    val name: String,
    val readyToProd: Boolean,
    val hidden: Boolean,
)

data class BranchDashboardBranchData(
    val id: UUID,
    val name: String,
    val repository: UUID,
    val parent: UUID?,
    val tasks: List<BranchDashboardRelationTaskEntry>,
    val mergeRequests: List<BranchDashboardMergeRequestEntry>
)

data class BranchDashboardBranchCreateData(
    val name: String,
    val repository: UUID,
    val parent: UUID?,
)

data class BranchDashboardBranchUpdateData(
    val name: String,
    val parent: UUID?,
    val hidden: Boolean,
)

data class BranchDashboardRelationEntry(
    val id: UUID,
    val name: String,
    val tasks: List<BranchDashboardRelationTaskEntry>,
    val readyToProd: Boolean,
)

data class BranchDashboardRelationTaskEntry(
    val id: UUID,
    val key: String,
    val summary: String,
    val url: String,
    val externalStatus: String?,
)

data class BranchDashboardMergeRequestEntry(
    val externalId: String,
    val externalStatus: String,
    val url: String,
    val targetBranch: String,
)

data class BranchDashboardCreateMergeRequest(
    val sourceBranchSuffix: String,
    val targetBranch: UUID,
)

data class BranchDashboardSaveMergeRequest(
    val targetBranch: UUID,
)