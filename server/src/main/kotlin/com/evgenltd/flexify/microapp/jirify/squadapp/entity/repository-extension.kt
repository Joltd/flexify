package com.evgenltd.flexify.microapp.jirify.squadapp.entity

import com.evgenltd.flexify.microapp.jirify.common.entity.Repository
import com.evgenltd.flexify.microapp.jirify.common.record.SelectRepositoryRecord
import com.evgenltd.flexify.microapp.jirify.squadapp.record.RepositoryRecord

fun Repository.toRecord(): RepositoryRecord = RepositoryRecord(
    id = id!!,
    name = name,
    type = properties().type,
)