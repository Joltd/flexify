package com.evgenltd.flexify.microapp.admin.controller

import com.evgenltd.flexify.microapp.MicroApp
import com.evgenltd.flexify.microapp.admin.AdminAppSecured
import com.evgenltd.flexify.microapp.admin.record.CreateUserRequest
import com.evgenltd.flexify.microapp.admin.record.UpdateUserRequest
import com.evgenltd.flexify.microapp.admin.record.UserRecord
import com.evgenltd.flexify.microapp.admin.service.AdminService
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
class AdminController(
    private val adminService: AdminService,
) {

    @GetMapping("/api/app/admin/application")
    @AdminAppSecured
    fun applicationList(): List<MicroApp> = MicroApp.entries

    @GetMapping("/api/app/admin/user")
    @AdminAppSecured
    fun userList(): List<UserRecord> = adminService.userList()

    @GetMapping("/api/app/admin/user/{id}")
    @AdminAppSecured
    fun userById(@PathVariable id: UUID): UserRecord = adminService.userById(id)

    @PostMapping("/api/app/admin/user")
    @AdminAppSecured
    fun updateUser(
        @RequestBody request: CreateUserRequest
    ) = adminService.saveUser(request)

    @PatchMapping("/api/app/admin/user/{id}")
    @AdminAppSecured
    fun deleteUser(
        @PathVariable id: UUID,
        @RequestBody request: UpdateUserRequest
    ) = adminService.updateUser(id, request)

}