package com.evgenltd.flexify.microapp.jirify.common.repository

import com.evgenltd.flexify.microapp.jirify.common.entity.Sprint
import com.evgenltd.flexify.microapp.jirify.common.entity.SprintTask
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface SprintTaskRepository : JpaRepository<SprintTask, UUID> {
    fun findBySprint(sprint: Sprint): List<SprintTask>
}