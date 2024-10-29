package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.microapp.jirify.common.repository.MergeRequestRepository
import com.evgenltd.flexify.microapp.jirify.common.service.integration.gitlab.resolveStatus
import org.gitlab4j.api.models.MergeRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class BranchSyncService(
    private val mergeRequestRepository: MergeRequestRepository,
) {

    fun updateMergeRequests(mergeRequests: List<MergeRequest>) {
        val index = mergeRequests.associateBy { it.iid.toString() }

        mergeRequestRepository.findByExternalIdIn(index.keys)
            .onEach { mergeRequest ->
                index[mergeRequest.externalId]?.let {
                    mergeRequest.status = it.resolveStatus()
                    mergeRequest.externalStatus = it.detailedMergeStatus
                }
            }
    }

}