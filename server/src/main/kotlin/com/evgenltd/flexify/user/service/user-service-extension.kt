package com.evgenltd.flexify.user.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.user.config.SecurityConfig
import com.evgenltd.flexify.user.record.TenantEntry
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import java.util.*

fun Authentication.getCurrentTenant(mapper: ObjectMapper): TenantEntry? {
    val principal = principal as? Jwt
    return principal?.getClaimAsString(SecurityConfig.TENANTS)
        ?.let { mapper.readValue<List<TenantEntry>>(it) }
        ?.firstOrNull { it.active }
}

fun getCurrentTenant(mapper: ObjectMapper): UUID? = SecurityContextHolder.getContext()
    .authentication
    ?.getCurrentTenant(mapper)
    ?.id

fun getCurrentTenantNotNull(mapper: ObjectMapper): UUID = getCurrentTenant(mapper)
    ?: throw ApplicationException("Tenant not found")