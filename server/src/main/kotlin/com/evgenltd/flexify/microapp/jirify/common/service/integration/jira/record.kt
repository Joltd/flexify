package com.evgenltd.flexify.microapp.jirify.common.service.integration.jira

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
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
    val displayName: String = "",
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

@JsonInclude(JsonInclude.Include.NON_NULL)
data class JiraIssueUpdateFieldOperation(
    val add: Any? = null,
    val copy: Any? = null,
    val edit: Any? = null,
    val remove: Any? = null,
    val set: Any? = null,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class JiraIssueEditRequest(
    val update: Map<String,List<JiraIssueUpdateFieldOperation>>? = null,
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class JiraIssueTransitionsResponse(
    val transitions: List<Transition>,
) {
    data class Transition(
        val id: String,
        val name: String,
    )
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class JiraIssueTransitionRequest(
    val transition: Transition? = null,
    val update: Map<String,List<JiraIssueUpdateFieldOperation>>? = null,
) {
    data class Transition(val id: String)
}
