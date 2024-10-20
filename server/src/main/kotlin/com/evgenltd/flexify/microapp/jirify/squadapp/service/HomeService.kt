package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.common.emptyUuid
import com.evgenltd.flexify.microapp.jirify.common.entity.*
import com.evgenltd.flexify.microapp.jirify.common.repository.*
import com.evgenltd.flexify.microapp.jirify.common.service.TaskBranchRelationService
import com.evgenltd.flexify.microapp.jirify.common.service.integration.jira.JiraIntegrationFactory
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.*
import com.evgenltd.flexify.microapp.jirify.squadapp.record.*
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.UUID

@Service
class HomeService(
    private val workspaceRepository: WorkspaceRepository,
    private val sprintRepository: SprintRepository,
    private val taskRepository: TaskRepository,
    private val sprintTaskRepository: SprintTaskRepository,
    private val taskBranchRelationService: TaskBranchRelationService,
    private val jiraIntegrationFactory: JiraIntegrationFactory,
) {

    @Transactional
    fun activeSprint(user: User, request: ActiveSprintRequest): ActiveSprintResponse {
        val workspace = workspaceRepository.workspace(user, WorkspaceKind.SQUAD_APP)

        val sprint = workspace.sprints
            .filter { it.active }
            .sortedByDescending { it.updatedAt }
            .firstOrNull()
            ?: throw ApplicationException("Active sprint not found")

        val employees = request.employees?.map { if (it == emptyUuid) null else it } ?: emptyList()
        val areas = request.areas ?: emptyList()

        return ActiveSprintResponse(
            id = sprint.id!!,
            key = sprint.key,
            updatedAt = sprint.updatedAt,
            workspace = workspace.id!!,
            groups = sprint.sprintTasks
                .asSequence()
                .filter { employees.isEmpty() || it.task.assignee?.id in employees }
                .filter { areas.isEmpty()
                        || (it.task.properties().backend && DevelopmentArea.BACKEND in areas)
                        || (it.task.properties().frontend && DevelopmentArea.FRONTEND in areas) }
                .filter { request.performed != true || it.performed }
                .groupBy { it.task.status }
                .map { it.toGroup() }
                .sortedBy { it.status.ordinal }
        )
    }

    @Transactional
    fun updateTask(user: User, request: UpdateTaskRequest) {
        val sprintTask = sprintTaskRepository.task(user, request.taskId)

        sprintTask.task.status = request.status
        sprintTask.task.updatedAt = LocalDateTime.now()
        sprintTask.performed = request.performed
        sprintTask.updatedAt = LocalDateTime.now()
    }

    fun beginWorkJira(appUser: User, request: BeginWorkRequest) {
        val workspace = workspaceRepository.workspace(appUser, WorkspaceKind.SQUAD_APP)
        val task = taskRepository.task(appUser, request.taskId)
        val me = workspace.employees.find { it.me }

        val ( host, user, token, board ) = workspace.properties().jira
        val jiraIntegration = jiraIntegrationFactory.create(host, user, token, board)

        if (task.assignee == null && me != null) {
            jiraIntegration.issueSetAssignee(task.key, me.externalId)
        }

        if (request.sendToJira) {
            jiraIntegration.issueTransitionByName(task.key, JiraIssueStatus.IN_PROGRESS.value)
        }
    }

    @Transactional
    fun beginWork(user: User, request: BeginWorkRequest) {
        val workspace = workspaceRepository.workspace(user, WorkspaceKind.SQUAD_APP)
        val task = taskRepository.task(user, request.taskId)

        task.assignee = workspace.employees.find { it.me }
        task.status = TaskStatus.IN_PROGRESS
        task.updatedAt = LocalDateTime.now()

        linkToBranch(user, workspace, DevelopmentArea.BACKEND, task, request.backend, request.createBackend)
        linkToBranch(user, workspace, DevelopmentArea.FRONTEND, task, request.frontend, request.createFrontend)

        workspace.sprints
            .filter { it.active }
            .flatMap { it.sprintTasks }
            .filter { it.task.id == task.id }
            .onEach { it.performed = true }
    }

    private fun linkToBranch(user: User, workspace: Workspace, area: DevelopmentArea, task: Task, id: UUID?, createBranch: CreateBranchRecord?) {
        if (id != null) {
            taskBranchRelationService.linkToBranch(user, task, id)
        } else if (createBranch != null) {
            val repository = workspace.repositoryByType(area)
            val branch = taskBranchRelationService.linkToNewBranch(user, task, createBranch.name, createBranch.parent, repository.id!!)
            branch.properties = BranchProperties(BranchKind.PROD)
        }
    }

    private fun Map.Entry<TaskStatus, List<SprintTask>>.toGroup(): SprintTaskGroup = SprintTaskGroup(
        status = key,
        tasks = value
            .sortedWith(compareBy({ it.task.priority }, { it.task.key }))
            .map { it.toRecord() }
    )

    private fun SprintTask.toRecord() = SprintTaskRecord(
        id = id!!,
        key = task.key,
        summary = task.summary,
        url = task.url,
        status = task.status,
        externalStatus = externalStatus,
        assignee = task.assignee?.let { AssigneeRecord(it.id!!, it.name) },
        performed = performed,
        estimation = estimation,
        priority = task.priority,
        backend = task.properties().backend,
        frontend = task.properties().frontend,
    )

}