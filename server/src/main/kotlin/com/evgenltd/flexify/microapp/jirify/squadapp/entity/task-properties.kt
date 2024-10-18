package com.evgenltd.flexify.microapp.jirify.squadapp.entity

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.Task

data class TaskProperties(
    var backend: Boolean = false,
    var frontend: Boolean = false,
) : Task.Properties

fun Task.properties(): TaskProperties = properties as? TaskProperties
    ?: throw ApplicationException("Properties not found")