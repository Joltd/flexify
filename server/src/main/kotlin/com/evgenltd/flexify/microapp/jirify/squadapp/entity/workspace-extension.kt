package com.evgenltd.flexify.microapp.jirify.squadapp.entity

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.jirify.common.entity.DevelopmentArea
import com.evgenltd.flexify.microapp.jirify.common.entity.Repository
import com.evgenltd.flexify.microapp.jirify.common.entity.Workspace

fun Workspace.repositoryByType(type: DevelopmentArea): Repository = repositories
    .find { it.properties().type == type }
    ?: throw ApplicationException("Repository not found")