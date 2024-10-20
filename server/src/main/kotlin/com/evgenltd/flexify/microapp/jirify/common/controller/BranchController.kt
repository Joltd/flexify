package com.evgenltd.flexify.microapp.jirify.common.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.common.record.CreateBranchRequest
import com.evgenltd.flexify.microapp.jirify.common.record.SelectBranchRecord
import com.evgenltd.flexify.microapp.jirify.common.record.UpdateBranchRequest
import com.evgenltd.flexify.microapp.jirify.common.service.BranchService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
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

    @PostMapping("/api/app/jirify/branch")
    @JirifyAppSecured
    fun create(
        @RequestBody request: CreateBranchRequest
    ) {
        val user = userService.getCurrentUserNotNull()
        branchService.create(user, request.name, request.parent, request.repository)
    }

    @PostMapping("/api/app/jirify/branch/{id}")
    @JirifyAppSecured
    fun update(
        @RequestBody request: UpdateBranchRequest
    ) {
        val user = userService.getCurrentUserNotNull()
    }

}