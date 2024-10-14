package com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab

import com.evgenltd.flexify.common.ApplicationException
import org.gitlab4j.api.Constants
import org.gitlab4j.api.GitLabApi
import org.gitlab4j.api.models.MergeRequest
import org.gitlab4j.api.models.MergeRequestFilter
import org.gitlab4j.api.models.MergeRequestParams
import org.slf4j.LoggerFactory

class GitLabIntegration(
    private val api: GitLabApi,
    private val projectId: Long,
) {

    private val logger = LoggerFactory.getLogger(javaClass)

    fun findOpenedMergeRequest(sourceBranch: String, targetBranch: String): MergeRequest? {
        val filter = MergeRequestFilter()
            .withProjectId(projectId)
            .withSourceBranch(sourceBranch)
            .withTargetBranch(targetBranch)
            .withState(Constants.MergeRequestState.OPENED)
        try {
            return api.mergeRequestApi.getMergeRequests(filter).firstOrNull()
        } catch (e: Exception) {
            throw ApplicationException("Failed to find opened merge request", e)
        }
    }

    fun getMergeRequest(mergeRequestIid: Long): MergeRequest =
        try {
            api.mergeRequestApi.getMergeRequest(projectId, mergeRequestIid)
        } catch (e: Exception) {
            throw ApplicationException("Failed to get merge request", e)
        }

    fun createMergeRequest(sourceBranch: String, targetBranch: String, description: String? = null): MergeRequest {
        val params = MergeRequestParams()
            .withSourceBranch(sourceBranch)
            .withTargetBranch(targetBranch)
            .withTitle(sourceBranch)
        if (description != null) {
            params.withDescription(description)
        }
        try {
            return api.mergeRequestApi.createMergeRequest(projectId, params)
        } catch (e: Exception) {
            throw ApplicationException("Failed to create merge request", e)
        }
    }

    fun closeMergeRequest(mergeRequestIid: Long): MergeRequest =
        try {
            val params = MergeRequestParams()
                .withStateEvent(Constants.StateEvent.CLOSE)
            api.mergeRequestApi.updateMergeRequest(projectId, mergeRequestIid, params)
        } catch (e: Exception) {
            throw ApplicationException("Failed to cancel merge request", e)
        }

}