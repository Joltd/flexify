package com.evgenltd.flexify.microapp.jirify.common.controller

import com.evgenltd.flexify.common.FieldRecord
import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
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

    @GetMapping("/api/app/jirify/repository/field")
    @JirifyAppSecured
    fun field(
        @RequestParam(name = "workspace") workspace: UUID,
    ): List<FieldRecord> {
        val user = userService.getCurrentUserNotNull()
        return repositoryService.field(user, workspace)
    }

}