package com.evgenltd.flexify.microapp.jirify.common.service.integration.jira

import com.evgenltd.flexify.common.ApplicationException
import org.slf4j.LoggerFactory
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpMethod.GET
import org.springframework.web.client.RestTemplate

class JiraIntegration(
    private val rest: RestTemplate,
    private val host: String,
    private val user: String,
    private val token: String,
    private val board: String,
) {

    private val logger = LoggerFactory.getLogger(javaClass)

    fun getActiveSprint(): JiraSprint? {
        val response = exchange<Unit, JiraSprintResponse>(GET, "/rest/agile/1.0/board/$board/sprint?state=active")
        if (response.values.isEmpty()) {
            return null
        }
        return response.values.firstOrNull()
    }

    fun getSprintIssues(id: Int): List<JiraIssue> =
        exchange<Unit, JiraIssueResponse>(GET, "/rest/agile/1.0/board/$board/sprint/$id/issue?maxResults=200").issues

    fun getIssue(key: String): JiraIssue = exchange<Unit, JiraIssue>(GET, "/rest/agile/1.0/issue/$key")

    private inline fun <T,reified R> exchange(method: HttpMethod, path: String, body: T? = null): R {
        val headers = HttpHeaders().apply {
            setBasicAuth(user, token)
        }
        val entity = HttpEntity(body, headers)

        val response = rest.exchange(
            "$host$path",
            method,
            entity,
            object : ParameterizedTypeReference<R>() {}
        )

        if (!response.statusCode.is2xxSuccessful) {
            logger.error("Response $response")
            throw ApplicationException("Unable to perform request to jira")
        }

        val responseBody = response.body
        if (responseBody == null) {
            logger.error("Response $response")
            throw ApplicationException("Unable to perform request to jira")
        }

        return responseBody
    }

}