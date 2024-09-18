package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service

@Service
class TaskTrackerSyncPerformService(
    private val taskTrackerSyncService: TaskTrackerSyncService,
) {

    fun perform(user: User) {
        val integration = taskTrackerSyncService.prepareJiraIntegration(user)
        val activeSprint = integration.getActiveSprint()
            ?: throw ApplicationException("Active sprint not found")
        val issues = integration.getSprintIssues(activeSprint.id)
        taskTrackerSyncService.syncSprint(user, activeSprint, issues)
    }

}