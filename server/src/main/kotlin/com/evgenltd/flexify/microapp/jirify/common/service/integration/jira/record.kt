package com.evgenltd.flexify.microapp.jirify.common.service.integration.jira

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

data class JiraSprintResponse(
    val values: List<JiraSprint>,
)

data class JiraSprint(
    val id: Int,
    val name: String,
    val state: String,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class JiraIssueResponse(
    val issues: List<JiraIssue>,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class JiraIssue(
    val id: String,
    val key: String,
//    val fields: Map<String,Any>,
    val fields: JiraIssueFields,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class JiraIssueFields(
    val assignee: JiraIssueAssignee?,
    val priority: JiraIssuePriority?,
    val labels: List<String> = emptyList(),
    @JsonProperty("timeestimate")
    val timeEstimate: Int?,
    val status: JiraIssueStatus?,
    val description: String?,
    val summary: String,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class JiraIssueAssignee(
    val accountId: String,
    val displayName: String,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class JiraIssuePriority(
    val id: String,
    val name: String,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class JiraIssueStatus(
    val id: String,
    val name: String,
)