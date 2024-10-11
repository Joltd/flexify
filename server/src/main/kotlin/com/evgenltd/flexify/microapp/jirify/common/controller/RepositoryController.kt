package com.evgenltd.flexify.microapp.jirify.common.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.common.record.SelectRepositoryRecord
import com.evgenltd.flexify.microapp.jirify.common.service.RepositoryService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class RepositoryController(
    private val userService: UserService,
    private val repositoryService: RepositoryService,
) {

    @GetMapping("/api/app/jirify/repository/select")
    @JirifyAppSecured
    fun select(
        @RequestParam(name = "workspace") workspace: UUID,
    ): List<SelectRepositoryRecord> {
        val user = userService.getCurrentUserNotNull()
        return repositoryService.select(user, workspace)
    }

}