package com.evgenltd.flexify.user.entity

import com.evgenltd.flexify.common.Label
import com.evgenltd.flexify.microapp.MicroApp
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.*

@Entity
@Table(name = "users")
data class User(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Label
    var login: String,

    var password: String,

    var deleted: Boolean = false,

    @JdbcTypeCode(SqlTypes.JSON)
    var applications: MutableSet<MicroApp> = mutableSetOf(),

    @OneToMany(mappedBy = "user")
    var tenants: MutableList<TenantUser> = mutableListOf(),

) {
    override fun toString(): String = "User(id=$id, login='$login', password='$password', deleted=$deleted)"
}
