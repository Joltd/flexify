package com.evgenltd.flexify.microapp.jirify.squadapp.entity

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Workspace

data class WorkspaceProperties(
    var jira: JiraProperties,
) : Workspace.Properties

fun Workspace.properties(): WorkspaceProperties = properties as? WorkspaceProperties
    ?: throw ApplicationException("Properties not found")

data class JiraProperties(
    var host: String,
    var user: String,
    var token: String,
    var board: String,
)