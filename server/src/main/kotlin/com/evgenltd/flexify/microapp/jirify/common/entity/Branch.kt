package com.evgenltd.flexify.microapp.jirify.common.entity

import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.*

@Entity
@Table(name = "branches")
data class Branch(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var name: String,

    var base: Boolean = false,

    @JdbcTypeCode(SqlTypes.JSON)
    var properties: Properties? = null,

    @ManyToOne
    var repository: Repository,

    @ManyToOne
    var parent: Branch? = null,

    @OneToMany(mappedBy = "parent")
    var children: MutableList<Branch> = mutableListOf(),

    @ManyToMany(mappedBy = "branches")
    var tasks: MutableList<Task> = mutableListOf(),

) {

    @JsonTypeInfo(
        use = JsonTypeInfo.Id.CLASS,
        include = JsonTypeInfo.As.PROPERTY,
        property = "_class",
    )
    interface Properties

    override fun toString(): String {
        return "Branch(id=$id, " +
                "name='$name', " +
                "base=$base, " +
                "properties=$properties, " +
                "repository=${repository.id}, " +
                "parent=${parent?.id})"
    }

}
