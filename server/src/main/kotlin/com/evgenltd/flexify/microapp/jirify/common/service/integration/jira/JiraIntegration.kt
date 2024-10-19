package com.evgenltd.flexify.microapp.jirify.common.service.integration.jira

import com.evgenltd.flexify.common.ApplicationException
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpMethod.*
import org.springframework.web.client.RestTemplate

class JiraIntegration(
    private val rest: RestTemplate,
    private val host: String,
    private val user: String,
    private val token: String,
    private val board: String,
) {

    private val logger = LoggerFactory.getLogger(javaClass)

    fun getActiveSprint(): JiraSprint? = exchange<Unit, JiraSprintResponse>(GET, "/rest/agile/1.0/board/$board/sprint?state=active")
            ?.values
            ?.firstOrNull()

    fun getSprintIssues(id: Int): List<JiraIssue> = exchange<Unit, JiraIssueResponse>(GET, "/rest/agile/1.0/board/$board/sprint/$id/issue?maxResults=200")
        ?.issues
        ?: emptyList()

    fun getIssue(key: String): JiraIssue = exchangeNotNull<Unit, JiraIssue>(GET, "/rest/agile/1.0/issue/$key")

    fun getIssueChangelog(key: String): String = exchangeNotNull<Unit, String>(GET, "/rest/api/3/issue/$key/changelog")

    fun getIssueEditMetadata(key: String): String = exchangeNotNull<Unit, String>(GET, "/rest/api/3/issue/$key/editmeta")

    fun issueEdit(key: String, edit: JiraIssueEditRequest) = exchange<JiraIssueEditRequest, String>(PUT, "/rest/api/3/issue/$key", edit)

    fun issueSetAssignee(key: String, accountIt: String) {
        val operation = JiraIssueUpdateFieldOperation(
            set = JiraIssueAssignee(accountId = accountIt)
        )
        val edit = JiraIssueEditRequest(
            update = mapOf("assignee" to listOf(operation))
        )
        issueEdit(key, edit)
    }

    fun getIssueTransitions(key: String): JiraIssueTransitionsResponse = exchangeNotNull<Unit, JiraIssueTransitionsResponse>(GET, "/rest/api/3/issue/$key/transitions")

    fun issueTransition(key: String, transitionId: String) = exchange<JiraIssueTransitionRequest, Unit>(
        POST, "/rest/api/3/issue/$key/transitions",
        JiraIssueTransitionRequest(
            transition = JiraIssueTransitionRequest.Transition(
                id = transitionId
            )
        )
    )

    fun issueTransitionByName(key: String, transitionName: String) {
        val transitionsResponse = getIssueTransitions(key)
        val transition = transitionsResponse.transitions.find { it.name == transitionName }
            ?: throw ApplicationException("Transition $transitionName not found")
        issueTransition(key, transition.id)
    }

    private inline fun <T,reified R> exchangeNotNull(method: HttpMethod, path: String, body: T? = null): R {
        val responseBody = exchange<T,R>(method, path, body)
        if (responseBody == null) {
            logger.error("Response $responseBody")
            throw ApplicationException("Unable to perform request to jira")
        }

        return responseBody
    }

    private inline fun <T,reified R> exchange(method: HttpMethod, path: String, body: T? = null): R? {
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

        return response.body
    }

}