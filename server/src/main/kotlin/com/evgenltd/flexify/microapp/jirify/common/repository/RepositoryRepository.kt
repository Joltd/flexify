package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.microapp.jirify.common.entity.Repository
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository as Repo
import java.util.UUID

@Repo
interface RepositoryRepository : JpaRepository<Repository, UUID> {
}