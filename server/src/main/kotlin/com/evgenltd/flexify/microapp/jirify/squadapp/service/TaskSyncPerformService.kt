package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.squadapp.entity.JiraIssueStatus
import com.evgenltd.flexify.user.entity.User
import com.evgenltd.flexify.user.repository.UserRepository
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Service

@Service
class TaskSyncPerformService(
    private val userRepository: UserRepository,
    private val taskSyncService: TaskSyncService,
) {

//    @PostConstruct
//    fun postConstruct() {
//        val user = userRepository.findByLoginAndDeletedIsFalse("admin") ?: return
//        val integration = taskSyncService.prepareJiraIntegration(user)
//        val result = integration.issueSetAssignee("SQUAD-3676", "712020:0c1f4e6d-7f21-4af8-927b-21f933554d66")
////        val result = integration.getIssue("SQUAD-3816")
//        println(result)
//    }

    fun perform(user: User) {
        val integration = taskSyncService.prepareJiraIntegration(user)
        val activeSprint = integration.getActiveSprint()
            ?: throw ApplicationException("Active sprint not found")
        val issues = integration.getSprintIssues(activeSprint.id)
        taskSyncService.syncSprint(user, activeSprint, issues)
    }

}