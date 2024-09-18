package com.evgenltd.flexify.microapp.jirify.common.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "branches")
data class Branch(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var key: String,

    @ManyToOne
    var repository: Repository

)
