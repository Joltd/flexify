package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.*
import com.evgenltd.flexify.microapp.jirify.common.repository.*
import com.evgenltd.flexify.microapp.jirify.common.service.integration.jira.*
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class TaskTrackerSyncService(
    private val workspaceRepository: WorkspaceRepository,
    private val sprintRepository: SprintRepository,
    private val sprintTaskRepository: SprintTaskRepository,
    private val taskRepository: TaskRepository,
    private val employeeRepository: EmployeeRepository,
    private val jiraIntegrationFactory: JiraIntegrationFactory,
) {

    fun prepareJiraIntegration(user: User): JiraIntegration {
        val workspace = getWorkspace(user)
        val taskTracker = workspace.taskTracker
            ?: throw ApplicationException("Task tracker properties not found")
        return jiraIntegrationFactory.create(taskTracker)
    }

    fun syncSprint(user: User, activeJiraSprint: JiraSprint, jiraIssues: List<JiraIssue>) {
        val workspace = getWorkspace(user)
        val taskTracker = workspace.getTaskTracker()
        val host = taskTracker[HOST]

        val activeSprint = sprintRepository.findByExternalId(activeJiraSprint.id.toString())
            ?.also { updateSprint(it) }
            ?: createSprint(activeJiraSprint, workspace)

        val sprintTasks = sprintTaskRepository.findBySprint(activeSprint)

        val jiraIssueIndex = jiraIssues.associateBy { it.key }
        val sprintTaskIndex = sprintTasks.associateBy { it.task.key }

        val employeeIndex = employeeRepository.findByWorkspace(workspace).associateBy { it.externalId }

        sprintTasks.filter { sprintTask -> !jiraIssueIndex.containsKey(sprintTask.task.key) }
            .onEach { sprintTaskRepository.delete(it) }

        for (jiraIssue in jiraIssues) {
            val key = jiraIssue.key

            val employee = jiraIssue.fields.assignee
                ?.let {
                    employeeIndex[it.accountId]
                        ?: createEmployee(it, workspace)
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
        workspace = workspace,
        updatedAt = LocalDateTime.now(),
    ).let { sprintRepository.save(it) }

    private fun updateSprint(sprint: Sprint) {
        sprint.updatedAt = LocalDateTime.now()
    }

    private fun createTask(jiraIssue: JiraIssue, workspace: Workspace, employee: Employee?, host: String?): Task = Task(
        externalId = jiraIssue.id,
        key = jiraIssue.key,
        summary = jiraIssue.fields.summary,
        url = "$host/browse/${jiraIssue.key}",
        status = mapping[jiraIssue.fields.status?.name] ?: TaskStatus.TODO,
        externalStatus = jiraIssue.fields.status?.name,
        priority = jiraIssue.fields.priority?.id?.toIntOrNull(),
        assignee = employee,
        workspace = workspace,
        updatedAt = LocalDateTime.now(),
    ).let { taskRepository.save(it) }

    private fun updateTask(jiraIssue: JiraIssue, task: Task, employee: Employee?, host: String?) {
        task.externalId = jiraIssue.id
        task.key = jiraIssue.key
        task.summary = jiraIssue.fields.summary
        task.url = "$host/browse/${jiraIssue.key}"
        task.externalStatus = jiraIssue.fields.status?.name
        task.priority = jiraIssue.fields.priority?.id?.toIntOrNull()
        task.assignee = employee
        task.updatedAt = LocalDateTime.now()
        transfers[task.externalStatus]
            ?.get(task.status)
            ?.let { task.status = it }
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
        sprintTask.updatedAt = LocalDateTime.now()
    }

    private fun getWorkspace(user: User): Workspace {
        return workspaceRepository.findByUserAndKind(user, WorkspaceKind.SQUAD_APP)
            ?: throw ApplicationException("Workspace not found")
    }

    private fun Workspace.getTaskTracker(): TaskTrackerParameters = taskTracker
        ?: throw ApplicationException("Task tracker properties not found")

    private companion object {
        const val HOST = "host"
    }

}