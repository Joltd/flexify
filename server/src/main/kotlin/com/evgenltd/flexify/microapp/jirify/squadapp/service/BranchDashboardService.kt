package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.*
import com.evgenltd.flexify.microapp.jirify.common.repository.*
import com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab.GitLabIntegration
import com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab.GitLabIntegrationFactory
import com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab.resolveStatus
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.JiraIssueStatus
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.properties
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.repositoryByType
import com.evgenltd.flexify.microapp.jirify.squadapp.record.*
import com.evgenltd.flexify.user.entity.User
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class BranchDashboardService(
    private val workspaceRepository: WorkspaceRepository,
    private val repositoryRepository: RepositoryRepository,
    private val branchRepository: BranchRepository,
    private val gitLabIntegrationFactory: GitLabIntegrationFactory,
    private val mergeRequestRepository: MergeRequestRepository,
) {

    fun branchDashboard(user: User, filter: BranchDashboardFilter): List<BranchDashboardEntry> {
        val workspace = workspaceRepository.workspace(user, WorkspaceKind.SQUAD_APP)
        val repository = workspace.repositoryByType(filter.area)

        return repository.branches
            .filter { filter.hidden == true || !it.hidden }
            .filter { !it.base }
            .map { branch ->
                BranchDashboardEntry(
                    id = branch.id!!,
                    name = branch.name,
                    description = branch.tasks.firstOrNull()?.summary ?: "",
                    readyToProd = branch.tasks.all { task -> task.isReadyToProd() },
                    hidden = branch.hidden,
                    mergeRequest = branch.mergeRequests
                        .asSequence()
                        .filter { !it.hidden }
                        .sortedByDescending { it.createdAt }
                        .firstOrNull()
                        ?.toMergeRequestEntry(),
                )
            }
            .filter { filter.readyToProd == null || it.readyToProd == filter.readyToProd }
    }

    fun branch(user: User, id: UUID): BranchDashboardBranchData {
        val branch = branchRepository.branch(user, id)
        return BranchDashboardBranchData(
            id = branch.id!!,
            name = branch.name,
            repository = branch.repository.id!!,
            parent = branch.parent?.id,
            tasks = branch.tasks.map { it.toRelationTaskEntry() },
            mergeRequests = branch.mergeRequests.filter { !it.hidden }.map { it.toMergeRequestEntry() }
        )
    }

    @Transactional
    fun saveBranch(user: User, data: BranchDashboardBranchCreateData) {
        val repository = repositoryRepository.repository(user, data.repository)
        val existedBranch = repository.branch(data.name)
        if (existedBranch != null) {
            throw ApplicationException("Branch with name '${data.name}' already exists")
        }

        val branch = Branch(
            name = data.name,
            repository = repository,
            parent = data.parent?.let { branchRepository.branch(user, it) },
        )
        branchRepository.save(branch)
    }

    @Transactional
    fun updateBranch(user: User, id: UUID, data: BranchDashboardBranchUpdateData) {
        val branch = branchRepository.branch(user, id)
        branch.repository
            .branches
            .find { it.name == data.name && it.id != id }
            ?.let { throw ApplicationException("Branch with name '${data.name}' already exists") }

        branch.name = data.name
        branch.hidden = data.hidden
        data.parent
            ?.let { branch.parent = branchRepository.branch(user, it) }
    }

    @Transactional
    fun branchRelation(user: User, id: UUID): List<BranchDashboardRelationEntry> {
        var branch = branchRepository.branch(user, id)
        val branches = mutableListOf<Branch>()

        while (true) {
            branches.add(branch)
            branch = branch.parent ?: break
        }

        return branches.reversed()
            .map { it.toRelationEntry() }
    }

    @Transactional
    fun mark(user: User, id: UUID, status: TaskStatus) {
        branchRepository.branch(user, id)
            .tasks
            .onEach { it.status = status }
    }

    fun getMergeRequest(user: User, id: UUID, externalId: String): BranchDashboardMergeRequestEntry {
        val mergeRequest = branchRepository.branch(user, id)
            .repository
            .gitLab()
            .getMergeRequest(externalId.toLong())
        return BranchDashboardMergeRequestEntry(
            externalId = mergeRequest.iid.toString(),
            externalStatus = mergeRequest.detailedMergeStatus,
            url = mergeRequest.webUrl,
            targetBranch = mergeRequest.targetBranch,
        )
    }

    fun createMergeRequest(user: User, id: UUID, request: BranchDashboardCreateMergeRequest): String {
        val branch = branchRepository.branch(user, id)
        val repository = branch.repository
        val gitLab = repository.gitLab()

        val targetBranch = repository.branchNotNull(request.targetBranch)

        val sourceBranchName = "${branch.name}${request.sourceBranchSuffix}"

        val openedMergeRequest = gitLab.findOpenedMergeRequest(sourceBranchName, targetBranch.name)
        if (openedMergeRequest != null) {
            return openedMergeRequest.iid.toString()
        }

        return gitLab.createMergeRequest(sourceBranchName, targetBranch.name)
            .iid.toString()
    }

    fun saveMergeRequest(user: User, id: UUID, externalId: String, request: BranchDashboardSaveMergeRequest) {
        val branch = branchRepository.branch(user, id)
        val repository = branch.repository
        val gitLab = repository.gitLab()

        val targetBranch = repository.branchNotNull(request.targetBranch)

        val mergeRequest = gitLab.getMergeRequest(externalId.toLong())
            .let {
                MergeRequest(
                    id = null,
                    status = it.resolveStatus(),
                    externalStatus = it.detailedMergeStatus,
                    externalId = it.iid.toString(),
                    url = it.webUrl,
                    sourceBranch = branch,
                    targetBranch = targetBranch,
                )
            }
        mergeRequestRepository.save(mergeRequest)
    }

    fun closeMergeRequest(user: User, id: UUID, externalId: String) {
        branchRepository.branch(user, id)
            .repository
            .gitLab()
            .closeMergeRequest(externalId.toLong())
    }

    private fun Task.isReadyToProd(): Boolean = externalStatus in listOf(JiraIssueStatus.READY_FOR_DEPLOY.value, JiraIssueStatus.DONE.value)

    private fun Branch.toRelationEntry(): BranchDashboardRelationEntry = BranchDashboardRelationEntry(
        id = id!!,
        name = name,
        tasks = tasks.map { it.toRelationTaskEntry() },
        readyToProd = tasks.all { it.isReadyToProd() },
    )

    private fun Task.toRelationTaskEntry(): BranchDashboardRelationTaskEntry = BranchDashboardRelationTaskEntry(
        id = id!!,
        key = key,
        summary = summary,
        url = url,
        externalStatus = externalStatus,
    )

    private fun MergeRequest.toMergeRequestEntry(): BranchDashboardMergeRequestEntry = BranchDashboardMergeRequestEntry(
        externalId = externalId,
        externalStatus = externalStatus,
        url = url,
        targetBranch = targetBranch.name,
    )

    private fun Repository.gitLab(): GitLabIntegration {
        val host = url ?: throw ApplicationException("Repository host is not set")
        val ( _, token, projectId ) = properties()
        return gitLabIntegrationFactory.create(host, token, projectId)
    }

}