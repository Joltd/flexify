package com.evgenltd.flexify.microapp.jirify.common.entity

import com.evgenltd.flexify.common.Application
import com.evgenltd.flexify.microapp.MicroApp
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "sprint_tasks")
@Application(MicroApp.JIRIFY)
data class SprintTask(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var externalStatus: String? = null,

    var estimation: Int? = 0,

    var performed: Boolean = false,

    @CreatedDate
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @LastModifiedDate
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @ManyToOne
    var sprint: Sprint,

    @ManyToOne
    var task: Task,

)
