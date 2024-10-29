package com.evgenltd.flexify.microapp.jirify.common.entity

import com.evgenltd.flexify.user.entity.User
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "workspaces")
data class Workspace(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var name: String,

    @Enumerated(EnumType.STRING)
    var kind: WorkspaceKind,

    @JdbcTypeCode(SqlTypes.JSON)
    var properties: Properties? = null,

    @CreatedDate
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @LastModifiedDate
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @ManyToOne
    var user: User,

    @OneToMany(mappedBy = "workspace")
    var employees: List<Employee> = emptyList(),

    @OneToMany(mappedBy = "workspace")
    var sprints: List<Sprint> = emptyList(),

    @OneToMany(mappedBy = "workspace")
    var repositories: List<Repository> = emptyList()
) {

    @JsonTypeInfo(
        use = JsonTypeInfo.Id.CLASS,
        include = JsonTypeInfo.As.PROPERTY,
        property = "_class",
    )
    interface Properties

    override fun toString(): String {
        return "Workspace(id=$id, " +
                "name='$name', " +
                "kind=$kind, " +
                "properties=$properties, " +
                "user=${user.id})"
    }


}
