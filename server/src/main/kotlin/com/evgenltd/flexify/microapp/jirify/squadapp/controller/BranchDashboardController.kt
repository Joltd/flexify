package com.evgenltd.flexify.microapp.jirify.squadapp.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.squadapp.record.*
import com.evgenltd.flexify.microapp.jirify.squadapp.service.BranchDashboardService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class BranchDashboardController(
    private val userService: UserService,
    private val branchDashboardService: BranchDashboardService,
) {

    @GetMapping("/api/app/jirify/squad-app/branch-dashboard")
    @JirifyAppSecured
    fun branchDashboard(filter: BranchDashboardFilter): List<BranchDashboardEntry> {
        val user = userService.getCurrentUserNotNull()
        return branchDashboardService.branchDashboard(user, filter)
    }

    @GetMapping("/api/app/jirify/squad-app/branch-dashboard/branch/{id}")
    @JirifyAppSecured
    fun branch(@PathVariable id: UUID): BranchDashboardBranchData {
        val user = userService.getCurrentUserNotNull()
        return branchDashboardService.branch(user, id)
    }

    @PostMapping("/api/app/jirify/squad-app/branch-dashboard/branch")
    @JirifyAppSecured
    fun branch(@RequestBody request: BranchDashboardBranchCreateData) {
        val user = userService.getCurrentUserNotNull()
        branchDashboardService.saveBranch(user, request)
    }

    @PutMapping("/api/app/jirify/squad-app/branch-dashboard/branch/{id}")
    @JirifyAppSecured
    fun branch(@PathVariable id: UUID, @RequestBody request: BranchDashboardBranchUpdateData) {
        val user = userService.getCurrentUserNotNull()
        branchDashboardService.updateBranch(user, id, request)
    }

    @GetMapping("/api/app/jirify/squad-app/branch-dashboard/branch/{id}/relation")
    @JirifyAppSecured
    fun branchRelation(@PathVariable id: UUID): List<BranchDashboardRelationEntry> {
        val user = userService.getCurrentUserNotNull()
        return branchDashboardService.branchRelation(user, id)
    }

    @GetMapping("/api/app/jirify/squad-app/branch-dashboard/branch/{id}/merge-request/{mergeRequestId}")
    @JirifyAppSecured
    fun getMergeRequest(@PathVariable id: UUID, @PathVariable mergeRequestId: String): BranchDashboardMergeRequestEntry {
        val user = userService.getCurrentUserNotNull()
        return branchDashboardService.getMergeRequest(user, id, mergeRequestId)
    }

    @PostMapping("/api/app/jirify/squad-app/branch-dashboard/branch/{id}/merge-request")
    @JirifyAppSecured
    fun createMergeRequest(@PathVariable id: UUID, @RequestBody request: BranchDashboardCreateMergeRequest): String {
        val user = userService.getCurrentUserNotNull()
        return branchDashboardService.createMergeRequest(user, id, request)
    }

    @PutMapping("/api/app/jirify/squad-app/branch-dashboard/branch/{id}/merge-request/{mergeRequestId}")
    @JirifyAppSecured
    fun saveMergeRequest(@PathVariable id: UUID, @PathVariable mergeRequestId: String, @RequestBody request: BranchDashboardSaveMergeRequest) {
        val user = userService.getCurrentUserNotNull()
        branchDashboardService.saveMergeRequest(user, id, mergeRequestId, request)
    }

    @DeleteMapping("/api/app/jirify/squad-app/branch-dashboard/branch/{id}/merge-request/{mergeRequestId}")
    @JirifyAppSecured
    fun closeMergeRequest(@PathVariable id: UUID, @PathVariable mergeRequestId: String) {
        val user = userService.getCurrentUserNotNull()
        branchDashboardService.closeMergeRequest(user, id, mergeRequestId)
    }

}