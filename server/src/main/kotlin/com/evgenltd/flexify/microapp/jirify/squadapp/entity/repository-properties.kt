package com.evgenltd.flexify.microapp.jirify.squadapp.entity

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.DevelopmentArea
import com.evgenltd.flexify.microapp.jirify.common.entity.Repository

data class RepositoryProperties(
    var type: DevelopmentArea,
) : Repository.Properties

fun Repository.properties(): RepositoryProperties = properties as? RepositoryProperties
    ?: throw ApplicationException("Properties not found")