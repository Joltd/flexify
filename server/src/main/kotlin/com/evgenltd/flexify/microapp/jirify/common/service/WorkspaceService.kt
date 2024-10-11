package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Workspace
import com.evgenltd.flexify.microapp.jirify.common.entity.WorkspaceKind
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.JiraProperties
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.WorkspaceProperties
import com.evgenltd.flexify.user.entity.User
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import jakarta.annotation.PostConstruct
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class WorkspaceService(
    private val workspaceRepository: WorkspaceRepository
) {

}