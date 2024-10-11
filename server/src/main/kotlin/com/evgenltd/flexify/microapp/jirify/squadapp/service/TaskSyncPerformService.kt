package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.user.entity.User
import com.evgenltd.flexify.user.repository.UserRepository
import com.evgenltd.flexify.user.service.UserService
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
//        val changelog = integration.getIssueChangelog("SQUAD-3553")
//        println(changelog)
//    }

    fun perform(user: User) {
        val integration = taskSyncService.prepareJiraIntegration(user)
        val activeSprint = integration.getActiveSprint()
            ?: throw ApplicationException("Active sprint not found")
        val issues = integration.getSprintIssues(activeSprint.id)
        taskSyncService.syncSprint(user, activeSprint, issues)
    }

}