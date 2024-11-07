package com.evgenltd.flexify.user.service

import com.evgenltd.flexify.user.entity.Tenant
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.hibernate.context.spi.CurrentTenantIdentifierResolver
import java.util.UUID

class TenantResolver : CurrentTenantIdentifierResolver<UUID> {

    private val mapper: ObjectMapper = jacksonObjectMapper()

    override fun resolveCurrentTenantIdentifier(): UUID? = getCurrentTenant(mapper) ?: Tenant.DEFAULT

    override fun validateExistingCurrentSessions(): Boolean = true

}