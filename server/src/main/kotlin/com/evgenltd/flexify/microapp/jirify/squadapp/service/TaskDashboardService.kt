package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.common.emptyUuid
import com.evgenltd.flexify.microapp.jirify.common.entity.*
import com.evgenltd.flexify.microapp.jirify.common.record.EmployeeRecord
import com.evgenltd.flexify.microapp.jirify.common.repository.SprintTaskRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.task
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.microapp.jirify.common.service.TaskBranchRelationService
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.branchByType
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.properties
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.repositoryByType
import com.evgenltd.flexify.microapp.jirify.squadapp.record.*
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.UUID

@Service
class TaskDashboardService(
    private val workspaceRepository: WorkspaceRepository,
    private val sprintTaskRepository: SprintTaskRepository,
    private val taskBranchRelationService: TaskBranchRelationService,
) {

    fun taskDashboard(user: User, filter: TaskDashboardFilter): TaskDashboardData {
        val workspace = workspaceRepository.workspace(user, WorkspaceKind.SQUAD_APP)

        val sprint = workspace.sprints
            .filter { it.active }
            .sortedByDescending { it.updatedAt }
            .firstOrNull()
            ?: throw ApplicationException("Active sprint not found")

        val employees = filter.employees?.map { if (it == emptyUuid) null else it } ?: emptyList()
        val areas = filter.areas ?: emptyList()

        return TaskDashboardData(
            id = sprint.id!!,
            key = sprint.key,
            updatedAt = sprint.updatedAt,
            groups = sprint.sprintTasks
                .asSequence()
                .filter { employees.isEmpty() || it.task.assignee?.id in employees }
                .filter { areas.isEmpty()
                        || (it.task.properties().backend && DevelopmentArea.BACKEND in areas)
                        || (it.task.properties().frontend && DevelopmentArea.FRONTEND in areas) }
                .filter { filter.performed == null || it.performed == filter.performed }
                .groupBy { it.task.status }
                .map { it.toGroup() }
                .sortedBy { it.status.ordinal }
        )
    }

    fun task(user: User, id: UUID): TaskDashboardTaskData {
        val sprintTask = sprintTaskRepository.task(user, id)
        return TaskDashboardTaskData(
            id = sprintTask.id!!,
            key = sprintTask.task.key,
            summary = sprintTask.task.summary,
            url = sprintTask.task.url,
            status = sprintTask.task.status,
            externalStatus = sprintTask.task.externalStatus,
            assignee = sprintTask.task.assignee?.let { EmployeeRecord(it.id!!, it.name, it.me) },
            performed = sprintTask.performed,
            backendBranch = sprintTask.task.branchByType(DevelopmentArea.BACKEND)?.id,
            frontendBranch = sprintTask.task.branchByType(DevelopmentArea.FRONTEND)?.id,
        )
    }

    @Transactional
    fun updateTask(user: User, id: UUID, data: TaskDashboardTaskUpdateData) {
        val workspace = workspaceRepository.workspace(user, WorkspaceKind.SQUAD_APP)
        val sprintTask = sprintTaskRepository.task(user, id)

        sprintTask.performed = data.performed
        sprintTask.updatedAt = LocalDateTime.now()
        sprintTask.task.status = data.status
        sprintTask.task.updatedAt = LocalDateTime.now()

        taskBranchRelationService.linkToBranch(
            task = sprintTask.task,
            repository = workspace.repositoryByType(DevelopmentArea.BACKEND),
            branchId = data.backendBranch,
            branchName = data.backendBranchCreate?.name,
            parentBranchId = data.backendBranchCreate?.parent,
        )
        taskBranchRelationService.linkToBranch(
            task = sprintTask.task,
            repository = workspace.repositoryByType(DevelopmentArea.FRONTEND),
            branchId = data.frontendBranch,
            branchName = data.frontendBranchCreate?.name,
            parentBranchId = data.frontendBranchCreate?.parent,
        )
    }

    private fun Map.Entry<TaskStatus, List<SprintTask>>.toGroup(): TaskDashboardGroup = TaskDashboardGroup(
        status = key,
        entries = value.map { it.toEntry() }
    )

    private fun SprintTask.toEntry(): TaskDashboardEntry = TaskDashboardEntry(
        id = id!!,
        key = task.key,
        summary = task.summary,
        url = task.url,
        status = task.status,
        externalStatus = task.externalStatus,
        assignee = task.assignee?.let { EmployeeRecord(it.id!!, it.name, it.me) },
        performed = performed,
        estimation = estimation,
        priority = task.priority,
        backend = task.properties().backend,
        frontend = task.properties().frontend,
    )

}