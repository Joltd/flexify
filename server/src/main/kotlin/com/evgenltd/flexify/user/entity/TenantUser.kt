package com.evgenltd.flexify.user.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "tenant_users")
data class TenantUser(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var active: Boolean = false,

    @ManyToOne
    var tenant: Tenant,

    @ManyToOne
    var user: User,
)