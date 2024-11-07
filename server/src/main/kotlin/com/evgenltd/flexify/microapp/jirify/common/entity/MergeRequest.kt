package com.evgenltd.flexify.microapp.jirify.common.entity

import com.evgenltd.flexify.common.Application
import com.evgenltd.flexify.common.Label
import com.evgenltd.flexify.microapp.MicroApp
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "merge_requests")
@Application(MicroApp.JIRIFY)
data class MergeRequest(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Label
    var externalId: String,

    var url: String,

    @Enumerated(EnumType.STRING)
    var status: MergeRequestStatus,

    var externalStatus: String,

    var hidden: Boolean = false,

    @CreatedDate
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @LastModifiedDate
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @ManyToOne
    var sourceBranch: Branch,

    @ManyToOne
    var targetBranch: Branch,

) {

    @JsonTypeInfo(
        use = JsonTypeInfo.Id.CLASS,
        include = JsonTypeInfo.As.PROPERTY,
        property = "_class",
    )
    interface Properties

    override fun toString(): String {
        return "MergeRequest(id=$id, " +
                "externalId='$externalId', " +
                "sourceBranch=${sourceBranch.id}, " +
                "targetBranch=${targetBranch.id})"
    }

}