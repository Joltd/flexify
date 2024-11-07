package com.evgenltd.flexify.microapp.jirify.common.entity

import com.evgenltd.flexify.common.Application
import com.evgenltd.flexify.common.Label
import com.evgenltd.flexify.microapp.MicroApp
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "branches")
@Application(MicroApp.JIRIFY)
data class Branch(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Label
    var name: String,

    var base: Boolean = false,

    var hidden: Boolean = false,

    @JdbcTypeCode(SqlTypes.JSON)
    var properties: Properties? = null,

    @CreatedDate
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @LastModifiedDate
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @ManyToOne
    var repository: Repository,

    @ManyToOne
    var parent: Branch? = null,

    @OneToMany(mappedBy = "parent")
    var children: MutableList<Branch> = mutableListOf(),

    @ManyToMany(mappedBy = "branches")
    var tasks: MutableList<Task> = mutableListOf(),

    @OneToMany(mappedBy = "sourceBranch")
    var mergeRequests: MutableList<MergeRequest> = mutableListOf(),

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
