package com.evgenltd.flexify.microapp.jirify.squadapp.entity

import com.evgenltd.flexify.microapp.jirify.common.entity.Branch
import com.evgenltd.flexify.microapp.jirify.common.entity.DevelopmentArea
import com.evgenltd.flexify.microapp.jirify.common.entity.Task

fun Task.branchByType(type: DevelopmentArea): Branch? = branches
    .find { it.repository.properties().type == type }