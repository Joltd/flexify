package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Branch
import com.evgenltd.flexify.microapp.jirify.common.entity.MergeRequest
import com.evgenltd.flexify.microapp.jirify.common.entity.Repository
import com.evgenltd.flexify.microapp.jirify.common.entity.Task
import com.evgenltd.flexify.microapp.jirify.common.repository.*
import com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab.GitLabIntegration
import com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab.GitLabIntegrationFactory
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.JiraIssueStatus
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.properties
import com.evgenltd.flexify.microapp.jirify.squadapp.record.*
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service("squadAppBranchService")
class BranchService(
    private val repositoryRepository: RepositoryRepository,
    private val branchRepository: BranchRepository,
    private val mergeRequestRepository: MergeRequestRepository,
    private val gitLabIntegrationFactory: GitLabIntegrationFactory,
) {

    fun list(user: User, repositoryId: UUID, readyToProd: Boolean?): List<BranchRecord> =
        repositoryRepository.repository(user, repositoryId)
            .branches
            .filter { !it.base }
            .map {
                BranchRecord(
                    it.id!!,
                    it.name,
                    it.properties().kind,
                    it.tasks.all { task -> task.isReadyToProd() },
                )
            }
            .filter { readyToProd != true || it.readyToProd }

    fun baseBranches(user: User, repositoryId: UUID): List<BranchRecord> =
        repositoryRepository.repository(user, repositoryId)
            .branches
            .filter { it.base }
            .map {
                BranchRecord(
                    it.id!!,
                    it.name,
                    it.properties().kind,
                    false,
                )
            }

    fun analysis(user: User, branchId: UUID): List<BranchAnalysisRecord> {
        var branch = branchRepository.branch(user, branchId)
        val branches = mutableListOf<Branch>()

        while (true) {
            branches.add(branch)
            branch = branch.parent ?: break
        }

        return branches.reversed()
            .map { it.toBranchAnalysisRecord() }
    }

    fun findMergeRequest(user: User, repositoryId: UUID, sourceBranchId: UUID?, targetBranchId: UUID?, mergeRequestIid: Long?): MergeRequestResponse? {
        val repository = repositoryRepository.repository(user, repositoryId)
        val gitLab = repository.gitLab()

        if (mergeRequestIid != null) {
            return gitLab.getMergeRequest(mergeRequestIid)
                .let {
                    MergeRequestResponse(it.iid, it.detailedMergeStatus, it.webUrl)
                }
        }

        if (sourceBranchId == null || targetBranchId == null) {
            return null
        }

        val sourceBranch = repository.branch(sourceBranchId) ?: throw ApplicationException("Source branch not found")
        val targetBranch = repository.branch(targetBranchId) ?: throw ApplicationException("Target branch not found")

        return gitLab.findOpenedMergeRequest(sourceBranch.name, targetBranch.name)
            ?.let { MergeRequestResponse(it.iid, it.detailedMergeStatus, it.webUrl) }
    }

    fun createMergeRequest(user: User, repositoryId: UUID, sourceBranchId: UUID, targetBranchId: UUID): MergeRequestResponse {
        val repository = repositoryRepository.repository(user, repositoryId)
        val sourceBranch = repository.branch(sourceBranchId) ?: throw ApplicationException("Source branch not found")
        val targetBranch = repository.branch(targetBranchId) ?: throw ApplicationException("Target branch not found")

        val gitLab = repository.gitLab()
        val mergeRequest = gitLab.createMergeRequest(sourceBranch.name, targetBranch.name)
        return MergeRequestResponse(
            mergeRequest.iid,
            mergeRequest.detailedMergeStatus,
            mergeRequest.webUrl,
        )
    }

    fun closeMergeRequest(user: User, repositoryId: UUID, mergeRequestIId: Long) {
        val repository = repositoryRepository.repository(user, repositoryId)

        val gitLab = repository.gitLab()
        gitLab.closeMergeRequest(mergeRequestIId)

        mergeRequestRepository.deleteByExternalId(mergeRequestIId.toString())
    }

    @Transactional
    fun saveMergeRequest(user: User, repositoryId: UUID, sourceBranchId: UUID, targetBranchId: UUID, mergeRequestIid: Long) {
        val repository = repositoryRepository.repository(user, repositoryId)
        val sourceBranch = repository.branch(sourceBranchId) ?: throw ApplicationException("Source branch not found")
        val targetBranch = repository.branch(targetBranchId) ?: throw ApplicationException("Target branch not found")

        mergeRequestRepository.deleteBySourceBranchAndTargetBranch(sourceBranch, targetBranch)

        val mergeRequest = MergeRequest(null, mergeRequestIid.toString(), sourceBranch, targetBranch)
        mergeRequestRepository.save(mergeRequest)

        // move status for all linked tasks
    }

    private fun Branch.toBranchAnalysisRecord(): BranchAnalysisRecord = BranchAnalysisRecord(
        id = id!!,
        name = name,
        tasks = tasks.map { it.toBranchAnalysisTaskRecord() },
        readyToProd = tasks.all { it.isReadyToProd() },
    )

    private fun Task.toBranchAnalysisTaskRecord(): BranchAnalysisTaskRecord = BranchAnalysisTaskRecord(
        id = id!!,
        key = key,
        summary = summary,
        url = url,
        externalStatus = externalStatus,
    )

    private fun Task.isReadyToProd(): Boolean = externalStatus in listOf(JiraIssueStatus.READY_FOR_DEPLOY.value, JiraIssueStatus.DONE.value)

    private fun Repository.gitLab(): GitLabIntegration {
        val host = url ?: throw ApplicationException("Repository host is not set")
        val ( _, token, projectId ) = properties()
        return gitLabIntegrationFactory.create(host, token, projectId)
    }

}