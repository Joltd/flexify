package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.microapp.jirify.common.entity.Branch
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BranchRepository : JpaRepository<Branch, UUID> {
}