package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.microapp.jirify.common.entity.*
import com.evgenltd.flexify.microapp.jirify.common.repository.*
import com.evgenltd.flexify.microapp.jirify.common.service.integration.jira.*
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.JiraIssueStatus
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.TaskProperties
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.properties
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.UUID

@Service
@Transactional
class TaskSyncService(
    private val workspaceRepository: WorkspaceRepository,
    private val sprintRepository: SprintRepository,
    private val sprintTaskRepository: SprintTaskRepository,
    private val taskRepository: TaskRepository,
    private val employeeRepository: EmployeeRepository,
    private val branchRepository: BranchRepository,
    private val jiraIntegrationFactory: JiraIntegrationFactory,
) {

    fun prepareJiraIntegration(appUser: User): JiraIntegration {
        val ( host, user, token, board ) = workspaceRepository.workspace(appUser, WorkspaceKind.SQUAD_APP)
            .properties()
            .jira
        return jiraIntegrationFactory.create(host, user, token, board)
    }

    fun markTaskDone(appUser: User, branchId: UUID) {
        val branch = branchRepository.branch(appUser, branchId)
        val jira = prepareJiraIntegration(appUser)
        for (task in branch.tasks) {
            jira.issueTransitionByName(task.key, JiraIssueStatus.DONE.value)
        }
    }

    fun syncSprint(user: User, activeJiraSprint: JiraSprint, jiraIssues: List<JiraIssue>) {
        val workspace = workspaceRepository.workspace(user, WorkspaceKind.SQUAD_APP)
        val host = workspace.properties().jira.host

        val activeSprint = sprintRepository.findByExternalId(activeJiraSprint.id.toString())
            ?.also { updateSprint(it) }
            ?: createSprint(activeJiraSprint, workspace)

        val sprintTasks = sprintTaskRepository.findBySprint(activeSprint)

        val jiraIssueIndex = jiraIssues.associateBy { it.key }
        val sprintTaskIndex = sprintTasks.associateBy { it.task.key }

        val employeeIndex = employeeRepository.findByWorkspace(workspace)
            .associateBy { it.externalId }
            .toMutableMap()

        sprintTasks.filter { sprintTask -> !jiraIssueIndex.containsKey(sprintTask.task.key) }
            .onEach { sprintTaskRepository.delete(it) }

        for (jiraIssue in jiraIssues) {
            val key = jiraIssue.key

            val employee = jiraIssue.fields.assignee
                ?.let { assignee ->
                    employeeIndex[assignee.accountId]
                        ?: createEmployee(assignee, workspace)
                            .also { employeeIndex[it.externalId] = it }
                }

            val task = taskRepository.findByKey(key)
                ?.also { updateTask(jiraIssue, it, employee, host) }
                ?: createTask(jiraIssue, workspace, employee, host)

            sprintTaskIndex[key]
                ?.also { updateSprintTask(jiraIssue, it) }
                ?: createSprintTask(jiraIssue, task, activeSprint)
        }
    }

    private fun createEmployee(jiraEmployee: JiraIssueAssignee, workspace: Workspace): Employee = Employee(
        externalId = jiraEmployee.accountId,
        name = jiraEmployee.displayName,
        workspace = workspace
    ).let { employeeRepository.save(it) }

    private fun createSprint(jiraSprint: JiraSprint, workspace: Workspace): Sprint = Sprint(
        key = jiraSprint.name,
        externalId = jiraSprint.id.toString(),
        active = true,
        workspace = workspace,
    ).let {
        workspace.sprints.onEach { it.active = false }
        sprintRepository.save(it)
    }

    private fun updateSprint(sprint: Sprint) {
        sprint.updatedAt = LocalDateTime.now()
    }

    private fun createTask(jiraIssue: JiraIssue, workspace: Workspace, employee: Employee?, host: String?): Task {
        val backend = "Backend" in jiraIssue.fields.labels
        val frontend = "Frontend" in jiraIssue.fields.labels
        return Task(
            externalId = jiraIssue.id,
            key = jiraIssue.key,
            summary = jiraIssue.fields.summary,
            url = "$host/browse/${jiraIssue.key}",
            status = mapping[jiraIssue.fields.status?.name] ?: TaskStatus.UNKNOWN,
            externalStatus = jiraIssue.fields.status?.name,
            priority = jiraIssue.fields.priority?.id?.toIntOrNull(),
            assignee = employee,
            workspace = workspace,
            updatedAt = LocalDateTime.now(),
            properties = TaskProperties(backend, frontend)
        ).let { taskRepository.save(it) }
    }

    private fun updateTask(jiraIssue: JiraIssue, task: Task, employee: Employee?, host: String?) {
        task.externalId = jiraIssue.id
        task.key = jiraIssue.key
        task.summary = jiraIssue.fields.summary
        task.url = "$host/browse/${jiraIssue.key}"
        task.externalStatus = jiraIssue.fields.status?.name
        task.priority = jiraIssue.fields.priority?.id?.toIntOrNull()
        task.assignee = employee
        transfers[task.externalStatus]
            ?.get(task.status)
            ?.let { task.status = it }
        val backend = "Backend" in jiraIssue.fields.labels
        val frontend = "Frontend" in jiraIssue.fields.labels
        if (task.properties == null) {
            task.properties = TaskProperties()
        }
        task.properties()
            .let {
                it.backend = backend
                it.frontend = frontend
            }
    }

    private fun createSprintTask(jiraIssue: JiraIssue, task: Task, sprint: Sprint): SprintTask = SprintTask(
        sprint = sprint,
        task = task,
        externalStatus = task.externalStatus,
        estimation = jiraIssue.fields.timeEstimate,
        updatedAt = LocalDateTime.now(),
    ).let { sprintTaskRepository.save(it) }

    private fun updateSprintTask(jiraIssue: JiraIssue, sprintTask: SprintTask) {
        sprintTask.externalStatus = jiraIssue.fields.status?.name
        sprintTask.estimation = jiraIssue.fields.timeEstimate
    }

}