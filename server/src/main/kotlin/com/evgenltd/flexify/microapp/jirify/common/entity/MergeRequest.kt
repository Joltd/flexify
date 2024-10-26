package com.evgenltd.flexify.microapp.jirify.common.entity

import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "merge_requests")
data class MergeRequest(

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    var externalId: String,

    var url: String,

    var externalStatus: String,

    var hidden: Boolean = false,

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