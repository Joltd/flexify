package com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab

import org.gitlab4j.api.GitLabApi
import org.springframework.stereotype.Service

@Service
class GitLabIntegrationFactory {

    fun create(host: String, token: String, projectId: Long): GitLabIntegration {
        val api = GitLabApi(host, token)
        return GitLabIntegration(api, projectId)
    }

}