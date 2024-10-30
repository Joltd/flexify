package com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab

import com.evgenltd.flexify.microapp.jirify.common.entity.MergeRequestStatus
import org.gitlab4j.api.models.MergeRequest

fun MergeRequest.resolveStatus(): MergeRequestStatus {
    when (state) {
        "closed" -> return MergeRequestStatus.CLOSED
        "merged" -> return MergeRequestStatus.MERGED
    }

    when (detailedMergeStatus) {
        "preparing", "checking" -> return MergeRequestStatus.WAITING
        "mergeable" -> return MergeRequestStatus.READY
    }

    return MergeRequestStatus.ERROR
}