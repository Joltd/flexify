package com.evgenltd.flexify.microapp.jirify.common.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "repositories")
data class Repository(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @ManyToOne
    var workspace: Workspace

)
