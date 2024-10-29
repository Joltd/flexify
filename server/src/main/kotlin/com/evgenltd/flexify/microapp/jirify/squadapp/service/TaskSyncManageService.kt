package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service

@Service
class TaskSyncManageService(
    private val syncService: TaskSyncService,
) {

    fun perform(user: User) {
        val integration = syncService.prepareJiraIntegration(user)
        val activeSprint = integration.getActiveSprint()
            ?: throw ApplicationException("Active sprint not found")
        val issues = integration.getSprintIssues(activeSprint.id)
        syncService.syncSprint(user, activeSprint, issues)
    }

}