package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.microapp.jirify.common.entity.Branch
import com.evgenltd.flexify.microapp.jirify.common.entity.MergeRequest
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface MergeRequestRepository : JpaRepository<MergeRequest, UUID> {

    fun deleteByExternalId(externalId: String)

    fun deleteBySourceBranchAndTargetBranch(sourceBranch: Branch, targetBranch: Branch)

}