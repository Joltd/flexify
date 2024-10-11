package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Repository
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
import java.util.*

@org.springframework.stereotype.Repository
interface RepositoryRepository : JpaRepository<Repository, UUID> {

}
