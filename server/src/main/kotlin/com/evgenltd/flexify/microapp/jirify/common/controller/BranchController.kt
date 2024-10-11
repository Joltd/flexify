package com.evgenltd.flexify.microapp.jirify.common.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.common.record.SelectBranchRecord
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

    @GetMapping("/api/app/jirify/branch/select")
    @JirifyAppSecured
    fun select(
        @RequestParam(name = "workspace") workspace: UUID,
        @RequestParam(name = "repository", required = false) repository: UUID?,
    ): List<SelectBranchRecord> {
        val user = userService.getCurrentUserNotNull()
        return branchService.select(user, workspace, repository)
    }

}