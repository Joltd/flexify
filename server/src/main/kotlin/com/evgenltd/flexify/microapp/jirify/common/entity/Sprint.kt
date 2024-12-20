package com.evgenltd.flexify.microapp.jirify.common.entity

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "sprints")
data class Sprint(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var key: String,

    var externalId: String,

    var active: Boolean = false,

    @CreatedDate
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @LastModifiedDate
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @ManyToOne
    var workspace: Workspace,

    @OneToMany(mappedBy = "sprint")
    var sprintTasks: List<SprintTask> = emptyList(),

) {
    override fun toString(): String {
        return "Sprint(id=$id, key='$key', externalId='$externalId', active=$active, updatedAt=$updatedAt, workspace=$workspace)"
    }
}
