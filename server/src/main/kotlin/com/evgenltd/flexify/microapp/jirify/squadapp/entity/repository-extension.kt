package com.evgenltd.flexify.microapp.jirify.squadapp.entity

import com.evgenltd.flexify.microapp.jirify.common.entity.Repository
import com.evgenltd.flexify.microapp.jirify.common.record.SelectRepositoryRecord

fun Repository.toSelect(): SelectRepositoryRecord = SelectRepositoryRecord(
    id = id!!,
    name = name,
)