package com.evgenltd.flexify.microapp.jirify.common.service.integration.jira

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.TaskTrackerParameters
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class JiraIntegrationFactory(
    private val rest: RestTemplate
) {

    fun create(taskTrackerParameters: TaskTrackerParameters): JiraIntegration {
        val host = taskTrackerParameters[HOST] ?: throw ApplicationException("Host is not specified")
        val user = taskTrackerParameters[USER] ?: throw ApplicationException("User is not specified")
        val token = taskTrackerParameters[TOKEN] ?: throw ApplicationException("Token is not specified")
        val board = taskTrackerParameters[BOARD] ?: throw ApplicationException("Board is not specified")
        return JiraIntegration(rest, host, user, token, board)
    }

    private companion object {
        const val HOST = "host"
        const val USER = "user"
        const val TOKEN = "token"
        const val BOARD = "board"
    }

}