package com.evgenltd.flexify.microapp.jirify.common.entity

import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "tasks")
data class Task(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var externalId: String,

    var key: String,

    var summary: String,

    var url: String,

    @Enumerated(EnumType.STRING)
    var status: TaskStatus = TaskStatus.UNKNOWN,

    var externalStatus: String? = null,

    var priority: Int? = null,

    var updatedAt: LocalDateTime? = null,

    @JdbcTypeCode(SqlTypes.JSON)
    var properties: Properties? = null,

    @ManyToOne
    var workspace: Workspace,

    @ManyToOne
    var assignee: Employee? = null,

    @ManyToMany
    @JoinTable(
        name = "task_branches",
        joinColumns = [JoinColumn(name = "task_id")],
        inverseJoinColumns = [JoinColumn(name = "branch_id")]
    )
    var branches: MutableList<Branch> = mutableListOf(),

) {

    @JsonTypeInfo(
        use = JsonTypeInfo.Id.CLASS,
        include = JsonTypeInfo.As.PROPERTY,
        property = "_class",
    )
    interface Properties

    fun branchByRepository(repositoryId: UUID): Branch? = branches
        .firstOrNull { it.repository.id == repositoryId }

    override fun toString(): String {
        return "Task(id=$id, " +
                "externalId='$externalId', " +
                "key='$key', " +
                "summary='$summary', " +
                "url='$url', " +
                "status=$status, " +
                "externalStatus=$externalStatus, " +
                "priority=$priority, " +
                "updatedAt=$updatedAt, " +
                "properties=$properties, " +
                "workspace=${workspace.id}, " +
                "assignee=${assignee?.id})"
    }

}