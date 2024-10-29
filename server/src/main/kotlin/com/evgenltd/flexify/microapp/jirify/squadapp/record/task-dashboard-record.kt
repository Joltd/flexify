package com.evgenltd.flexify.microapp.jirify.squadapp.record

import com.evgenltd.flexify.microapp.jirify.common.entity.DevelopmentArea
import com.evgenltd.flexify.microapp.jirify.common.entity.MergeRequestStatus
import com.evgenltd.flexify.microapp.jirify.common.entity.TaskStatus
import com.evgenltd.flexify.microapp.jirify.common.record.EmployeeRecord
import java.time.LocalDateTime
import java.util.UUID

data class TaskDashboardFilter(
    val employees: List<UUID>?,
    val areas: List<DevelopmentArea>?,
    val performed: Boolean?,
)

data class TaskDashboardData(
    val id: UUID,
    val key: String,
    val updatedAt: LocalDateTime?,
    val groups: List<TaskDashboardGroup>,
)

data class TaskDashboardGroup(
    val status: TaskStatus,
    val entries: List<TaskDashboardEntry>,
)

data class TaskDashboardEntry(
    val id: UUID,
    val key: String,
    val summary: String,
    val url: String,
    val status: TaskStatus,
    val externalStatus: String?,
    val assignee: EmployeeRecord?,
    val performed: Boolean,
    val estimation: Int?,
    val priority: Int?,
    val backend: TaskDashboardEntryBranch?,
    val frontend: TaskDashboardEntryBranch?,
)

data class TaskDashboardEntryBranch(
    val id: UUID,
    val name: String,
    val mergeRequest: TaskDashboardEntryBranchMergeRequest?,
)

data class TaskDashboardEntryBranchMergeRequest(
    val id: UUID,
    val externalId: String,
    val url: String,
    val status: MergeRequestStatus,
)

data class TaskDashboardTaskData(
    val id: UUID,
    val key: String,
    val summary: String,
    val url: String,
    val status: TaskStatus,
    val externalStatus: String?,
    val assignee: EmployeeRecord?,
    val performed: Boolean,
    val backendBranch: UUID?,
    val backendMergeRequest: TaskDashboardEntryBranchMergeRequest?,
    val frontendBranch: UUID?,
    val frontendMergeRequest: TaskDashboardEntryBranchMergeRequest?,
)

data class TaskDashboardTaskUpdateData(
    val status: TaskStatus,
    val performed: Boolean,
    val backendBranch: UUID?,
    val backendBranchCreate: TaskDashboardCreateBranchData?,
    val frontendBranch: UUID?,
    val frontendBranchCreate: TaskDashboardCreateBranchData?,
)

data class TaskDashboardCreateBranchData(
    val name: String,
    val parent: UUID?,
)
