package com.evgenltd.flexify.microapp.jirify.common.entity

import jakarta.persistence.*
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

    var updatedAt: LocalDateTime? = null,

    @ManyToOne
    var workspace: Workspace,

)
