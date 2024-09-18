package com.evgenltd.flexify.microapp.jirify.common.entity

import com.evgenltd.flexify.user.entity.User
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.*

@Entity
@Table(name = "workspaces")
data class Workspace(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var name: String,

    @Enumerated(EnumType.STRING)
    var kind: WorkspaceKind,

    @JdbcTypeCode(SqlTypes.JSON)
    var taskTracker: TaskTrackerParameters? = null,

    @ManyToOne
    var user: User,
)
