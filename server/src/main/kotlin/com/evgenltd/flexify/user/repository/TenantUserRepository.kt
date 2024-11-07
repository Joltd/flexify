package com.evgenltd.flexify.user.repository

import com.evgenltd.flexify.user.entity.TenantUser
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TenantUserRepository : JpaRepository<TenantUser, UUID> {
}