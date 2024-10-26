package com.evgenltd.flexify.microapp.jirify.common.controller

import com.evgenltd.flexify.common.FieldRecord
import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.common.service.EmployeeService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class EmployeeController(
    private val userService: UserService,
    private val employeeService: EmployeeService,
) {

    @GetMapping("/api/app/jirify/employee/field")
    @JirifyAppSecured
    fun field(
        @RequestParam(name = "workspace") workspace: UUID,
    ): List<FieldRecord> {
        val user = userService.getCurrentUserNotNull()
        return employeeService.field(user, workspace)
    }

}