package com.evgenltd.flexify.user.entity

import com.evgenltd.flexify.common.Label
import com.evgenltd.flexify.microapp.MicroApp
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "tenants")
data class Tenant(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Label
    var name: String,

    @Enumerated(EnumType.STRING)
    var application: MicroApp,
) {

    companion object {
        val DEFAULT = UUID.fromString("00000000-0000-0000-0000-000000000000")
    }

}