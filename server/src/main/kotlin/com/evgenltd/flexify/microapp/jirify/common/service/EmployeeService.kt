package com.evgenltd.flexify.microapp.jirify.common.service

import com.evgenltd.flexify.common.emptyUuid
import com.evgenltd.flexify.microapp.jirify.common.record.SelectEmployeeRecord
import com.evgenltd.flexify.microapp.jirify.common.repository.EmployeeRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.WorkspaceRepository
import com.evgenltd.flexify.microapp.jirify.common.repository.workspace
import com.evgenltd.flexify.user.entity.User
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class EmployeeService(
    private val workspaceRepository: WorkspaceRepository,
    private val employeeRepository: EmployeeRepository,
) {

    fun select(user: User, workspaceId: UUID): List<SelectEmployeeRecord> {
        val workspace = workspaceRepository.workspace(user, workspaceId)
        return employeeRepository.findByWorkspace(workspace)
            .map {
                SelectEmployeeRecord(
                    id = it.id!!,
                    name = it.name,
                    me = it.me,
                )
            }
    }

}