package com.evgenltd.flexify.microapp.jirify.common.service.integration.jira

import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class JiraIntegrationFactory(
    private val rest: RestTemplate
) {

    fun create(
        host: String,
        user: String,
        token: String,
        board: String
    ): JiraIntegration = JiraIntegration(rest, host, user, token, board)

}