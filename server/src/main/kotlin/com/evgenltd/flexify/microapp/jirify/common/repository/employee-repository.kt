package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.microapp.jirify.common.entity.Employee
import com.evgenltd.flexify.microapp.jirify.common.entity.Workspace
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface EmployeeRepository : JpaRepository<Employee, UUID> {
    fun findByWorkspace(workspace: Workspace): List<Employee>
}