package com.evgenltd.flexify.microapp.jirify.common.controller

import com.evgenltd.flexify.common.FieldRecord
import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.common.service.BranchService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class BranchController(
    private val userService: UserService,
    private val branchService: BranchService,
) {

    @GetMapping("/api/app/jirify/branch/field")
    @JirifyAppSecured
    fun field(
        @RequestParam workspace: UUID,
        @RequestParam repository: UUID,
        @RequestParam(required = false) base: Boolean,
        @RequestParam(required = false) common: Boolean,
        @RequestParam(required = false) hidden: Boolean,
    ): List<FieldRecord> {
        val user = userService.getCurrentUserNotNull()
        return branchService.field(user, workspace, repository, hidden, common, base)
    }

}