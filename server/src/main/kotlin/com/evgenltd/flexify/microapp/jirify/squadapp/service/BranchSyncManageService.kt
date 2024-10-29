package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.MergeRequestStatus
import com.evgenltd.flexify.microapp.jirify.common.entity.Repository
import com.evgenltd.flexify.microapp.jirify.common.entity.WorkspaceKind
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab.GitLabIntegration
import com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab.GitLabIntegrationFactory
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.properties
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service

@Service
class BranchSyncManageService(
    private val workspaceRepository: WorkspaceRepository,
    private val gitLabIntegrationFactory: GitLabIntegrationFactory,
    private val branchSyncService: BranchSyncService,
) {

    fun perform(user: User) {
        val workspace = workspaceRepository.workspace(user, WorkspaceKind.SQUAD_APP)
        for (repository in workspace.repositories) {
            val gitLab = repository.gitLab()

            val mergeRequests = repository.branches
                .flatMap { it.mergeRequests }
                .filter { !it.hidden }
                .filter { it.status != MergeRequestStatus.MERGED && it.status != MergeRequestStatus.CLOSED }
                .map { gitLab.getMergeRequest(it.externalId.toLong()) }

            branchSyncService.updateMergeRequests(mergeRequests)
        }
    }

    private fun Repository.gitLab(): GitLabIntegration {
        val host = url ?: throw ApplicationException("Repository host is not set")
        val ( _, token, projectId ) = properties()
        return gitLabIntegrationFactory.create(host, token, projectId)
    }

}