package com.evgenltd.flexify.user.repository

import com.evgenltd.flexify.user.entity.Tenant
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TenantRepository : JpaRepository<Tenant, UUID> {
}