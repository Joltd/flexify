package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.common.ApplicationException
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.findByIdOrNull
import java.util.UUID

inline fun <reified T> JpaRepository<T, UUID>.findByIdNotNull(id: UUID): T =
    findByIdOrNull(id) ?: throw ApplicationException("${T::class.simpleName} not found")