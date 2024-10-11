package com.evgenltd.flexify.microapp.jirify.common.entity

import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.*

@Entity
@Table(name = "repositories")
data class Repository(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var name: String,

    @JdbcTypeCode(SqlTypes.JSON)
    var properties: Properties? = null,

    @ManyToOne
    var workspace: Workspace,

    @OneToMany(mappedBy = "repository")
    var branches: List<Branch> = emptyList(),
) {

    @JsonTypeInfo(
        use = JsonTypeInfo.Id.CLASS,
        include = JsonTypeInfo.As.PROPERTY,
        property = "_class",
    )
    interface Properties

    override fun toString(): String = "Repository(" +
            "id=$id, " +
            "name='$name', " +
            "workspace=${workspace.id}, " +
            "properties=$properties)"

}
