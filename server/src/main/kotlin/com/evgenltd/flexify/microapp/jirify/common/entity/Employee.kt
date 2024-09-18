package com.evgenltd.flexify.microapp.jirify.common.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "employees")
data class Employee(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var externalId: String,

    var name: String,

    var me: Boolean = false,

    @ManyToOne
    var workspace: Workspace
)
