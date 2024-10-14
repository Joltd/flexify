package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.SprintTask
import com.evgenltd.flexify.microapp.jirify.common.entity.TaskStatus
import com.evgenltd.flexify.microapp.jirify.common.entity.Workspace
import com.evgenltd.flexify.microapp.jirify.common.entity.WorkspaceKind
import com.evgenltd.flexify.microapp.jirify.common.repository.SprintRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.TaskRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.task
import com.evgenltd.flexify.microapp.jirify.common.service.TaskBranchRelationService
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.properties
import com.evgenltd.flexify.microapp.jirify.squadapp.record.ActiveSprintResponse
import com.evgenltd.flexify.microapp.jirify.squadapp.record.BeginWorkRequest
import com.evgenltd.flexify.microapp.jirify.squadapp.record.SprintTaskGroup
import com.evgenltd.flexify.microapp.jirify.squadapp.record.SprintTaskRecord
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class HomeService(
    private val workspaceRepository: WorkspaceRepository,
    private val sprintRepository: SprintRepository,
    private val taskRepository: TaskRepository,
    private val taskBranchRelationService: TaskBranchRelationService,
) {

    @Transactional
    fun activeSprint(user: User): ActiveSprintResponse {
        val workspace = workspace(user)

        val sprint = workspace.sprints
            .filter { it.active }
            .sortedByDescending { it.updatedAt }
            .firstOrNull()
            ?: throw ApplicationException("Active sprint not found")

        return ActiveSprintResponse(
            id = sprint.id!!,
            key = sprint.key,
            updatedAt = sprint.updatedAt,
            groups = sprint.sprintTasks
                .filter { it.task.assignee?.me == true }
                .groupBy { it.task.status }
                .map { it.toGroup() }
                .sortedBy { it.status.ordinal }
        )
    }

    @Transactional
    fun beginWork(user: User, request: BeginWorkRequest) {
        val task = taskRepository.task(user, request.taskId)

        // send to jira

        task.status = TaskStatus.IN_PROGRESS
        task.updatedAt = LocalDateTime.now()

        request.backend?.let {
            if (it.id != null) {
                taskBranchRelationService.linkToBranch(user, task, it.id)
            } else if (it.create != null) {
                taskBranchRelationService.linkToNewBranch(user, task, it.create.name, it.create.parent, it.create.repository)
            }
        }
        request.frontend?.let {
            if (it.id != null) {
                taskBranchRelationService.linkToBranch(user, task, it.id)
            } else if (it.create != null) {
                taskBranchRelationService.linkToNewBranch(user, task, it.create.name, it.create.parent, it.create.repository)
            }
        }

    }

    private fun Map.Entry<TaskStatus, List<SprintTask>>.toGroup(): SprintTaskGroup = SprintTaskGroup(
        status = key,
        tasks = value
            .sortedWith(compareBy({ it.task.priority }, { it.task.key }))
            .map { it.toRecord() }
    )

    private fun SprintTask.toRecord() = SprintTaskRecord(
        id = task.id!!,
        key = task.key,
        summary = task.summary,
        url = task.url,
        status = task.status,
        externalStatus = externalStatus,
        estimation = estimation,
        priority = task.priority,
        backend = task.properties().backend,
        frontend = task.properties().frontend,
    )

    private fun workspace(user: User): Workspace = workspaceRepository.findByUserAndKind(user, WorkspaceKind.SQUAD_APP)
        ?: throw ApplicationException("Workspace not found")

}