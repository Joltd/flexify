package com.evgenltd.flexify.microapp.jirify.common.entity

import jakarta.persistence.*
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
    var status: TaskStatus? = null,

    var externalStatus: String? = null,

    var priority: Int? = null,

    var updatedAt: LocalDateTime? = null,

    @ManyToOne
    var workspace: Workspace,

    @ManyToOne
    var assignee: Employee? = null,

) {}