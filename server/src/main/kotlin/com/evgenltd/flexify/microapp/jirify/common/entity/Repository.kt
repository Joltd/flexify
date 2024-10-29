package com.evgenltd.flexify.microapp.jirify.common.entity

import com.evgenltd.flexify.common.ApplicationException
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "repositories")
data class Repository(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var name: String,

    var url: String? = null,

    @JdbcTypeCode(SqlTypes.JSON)
    var properties: Properties? = null,

    @CreatedDate
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @LastModifiedDate
    var updatedAt: LocalDateTime = LocalDateTime.now(),

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

    fun branch(id: UUID): Branch? = branch { it.id == id }

    fun branchNotNull(id: UUID): Branch = branch(id) ?: throw ApplicationException("Branch not found")

    fun branch(name: String): Branch? = branch { it.name == name.trim() }

    private fun branch(condition: (Branch) -> Boolean): Branch? {
        val result = branches.filter(condition)
        if (result.size > 1) {
            throw ApplicationException("Multiple branches with the same condition")
        }

        return result.firstOrNull()
    }

    override fun toString(): String = "Repository(" +
            "id=$id, " +
            "name='$name', " +
            "workspace=${workspace.id}, " +
            "properties=$properties)"

}
