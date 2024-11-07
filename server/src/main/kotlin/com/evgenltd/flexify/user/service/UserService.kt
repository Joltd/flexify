package com.evgenltd.flexify.user.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.MicroApp
import com.evgenltd.flexify.user.entity.User
import com.evgenltd.flexify.user.record.ApplicationUser
import com.evgenltd.flexify.user.record.TenantEntry
import com.evgenltd.flexify.user.repository.UserRepository
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UserService(
    private val userRepository: UserRepository,
    private val mapper: ObjectMapper,
) : UserDetailsService {

    fun getCurrentUser(): User? {
        val authentication = SecurityContextHolder.getContext().authentication
        return userRepository.findByLoginAndDeletedIsFalse(authentication.name)
    }

    fun getCurrentUserNotNull(): User = getCurrentUser()
        ?: throw ApplicationException("User not found")

    override fun loadUserByUsername(username: String?): ApplicationUser {
        if (username == null) {
            throw ApplicationException("Username is not specified")
        }
        val user = userRepository.findByLoginAndDeletedIsFalse(username) ?: throw ApplicationException("User not found")
        val tenants = user.tenants.map {
            TenantEntry(
                id = it.tenant.id!!,
                name = it.tenant.name,
                application = it.tenant.application,
                active = it.active,
            )
        }

        return ApplicationUser(
            login = user.login,
            password = user.password,
            deleted = user.deleted,
            roles = mutableListOf(),
            applications = user.applications.toList(),
            tenants = tenants,
        )
    }

    fun changeTenant(tenantId: UUID): ApplicationUser {
        val user = getCurrentUserNotNull()
        val targetTenant = user.tenants.find { it.tenant.id == tenantId }
            ?: throw ApplicationException("Tenant not found")

        user.tenants
            .filter { it.tenant.application == targetTenant.tenant.application }
            .onEach { it.active = false }
        targetTenant.active = true

        val tenants = user.tenants.map {
            TenantEntry(
                id = it.tenant.id!!,
                name = it.tenant.name,
                application = it.tenant.application,
                active = it.active,
            )
        }

        return ApplicationUser(
            login = user.login,
            password = user.password,
            deleted = user.deleted,
            roles = mutableListOf(),
            applications = user.applications.toList(),
            tenants = tenants,
        )
    }

    fun hasApplication(authentication: Authentication, application: MicroApp): Boolean =
        authentication.getCurrentTenant(mapper)?.application == application

}