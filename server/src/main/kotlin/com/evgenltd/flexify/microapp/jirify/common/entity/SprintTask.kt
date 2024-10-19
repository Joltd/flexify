package com.evgenltd.flexify.microapp.jirify.common.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "sprint_tasks")
data class SprintTask(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var externalStatus: String? = null,

    var estimation: Int? = 0,

    var performed: Boolean = false,

    var updatedAt: LocalDateTime? = null,

    @ManyToOne
    var sprint: Sprint,

    @ManyToOne
    var task: Task,

)
