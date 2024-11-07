package com.evgenltd.flexify.microapp.jirify.common.entity

import com.evgenltd.flexify.common.Application
import com.evgenltd.flexify.common.Label
import com.evgenltd.flexify.microapp.MicroApp
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "employees")
@Application(MicroApp.JIRIFY)
data class Employee(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var externalId: String,

    @Label
    var name: String,

    var me: Boolean = false,

    @CreatedDate
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @LastModifiedDate
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @ManyToOne
    var workspace: Workspace
)
