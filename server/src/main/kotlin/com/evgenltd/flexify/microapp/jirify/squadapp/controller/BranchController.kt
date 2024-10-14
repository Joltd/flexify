package com.evgenltd.flexify.microapp.jirify.squadapp.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.squadapp.record.BranchRecord
import com.evgenltd.flexify.microapp.jirify.squadapp.record.CreateMergeRequestRequest
import com.evgenltd.flexify.microapp.jirify.squadapp.record.MergeRequestResponse
import com.evgenltd.flexify.microapp.jirify.squadapp.service.BranchService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController("squadAppBranchController")
class BranchController(
    private val userService: UserService,
    private val branchService: BranchService,
) {

    @GetMapping("/api/app/jirify/squad-app/branch")
    @JirifyAppSecured
    fun list(
        @RequestParam(name = "repository") repository: UUID
    ): List<BranchRecord> {
        val user = userService.getCurrentUserNotNull()
        return branchService.list(user, repository)
    }

    @GetMapping("/api/app/jirify/squad-app/branch/base")
    @JirifyAppSecured
    fun sendToReview(
        @RequestParam repository: UUID
    ): List<BranchRecord> {
        val user = userService.getCurrentUserNotNull()
        return branchService.baseBranches(user, repository)
    }

    @GetMapping("/api/app/jirify/squad-app/branch/merge-request")
    @JirifyAppSecured
    fun findMergeRequest(
        @RequestParam repository: UUID,
        @RequestParam(required = false) sourceBranch: UUID?,
        @RequestParam(required = false) targetBranch: UUID?,
        @RequestParam(required = false) iid: Long?,
    ): MergeRequestResponse? {
        val user = userService.getCurrentUserNotNull()
        return branchService.findMergeRequest(user, repository, sourceBranch, targetBranch, iid)
    }

    @PostMapping("/api/app/jirify/squad-app/branch/merge-request")
    @JirifyAppSecured
    fun createMergeRequest(
        @RequestBody request: CreateMergeRequestRequest
    ): MergeRequestResponse {
        val user = userService.getCurrentUserNotNull()
        return branchService.createMergeRequest(user, request.repository, request.sourceBranch, request.targetBranch)
    }

    @PostMapping("/api/app/jirify/squad-app/branch/merge-request/{id}")
    @JirifyAppSecured
    fun saveMergeRequest(
        @PathVariable id: Long,
        @RequestBody request: CreateMergeRequestRequest
    ) {
        val user = userService.getCurrentUserNotNull()
        branchService.saveMergeRequest(user, request.repository, request.sourceBranch, request.targetBranch, id)
    }

    @DeleteMapping("/api/app/jirify/squad-app/branch/merge-request/{iid}")
    @JirifyAppSecured
    fun closeMergeRequest(
        @RequestParam repository: UUID,
        @PathVariable iid: Long
    ) {
        val user = userService.getCurrentUserNotNull()
        branchService.closeMergeRequest(user, repository, iid)
    }

}