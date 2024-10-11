package com.evgenltd.flexify.microapp.jirify.squadapp.entity

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Branch

data class BranchProperties(
    var kind: BranchKind,
) : Branch.Properties

fun Branch.properties(): BranchProperties = properties as? BranchProperties
    ?: throw ApplicationException("Properties not found")