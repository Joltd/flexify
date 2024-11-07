package com.evgenltd.flexify.microapp.entity.controller

import com.evgenltd.flexify.microapp.entity.record.*
import com.evgenltd.flexify.microapp.entity.service.EntityService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
class EntityController(
    private val userService: UserService,
    private val entityService: EntityService,
) {

    @GetMapping("/api/app/entity")
    @PreAuthorize("isAuthenticated()")
    fun entityList(): List<String> {
        val user = userService.getCurrentUserNotNull()
        return entityService.entityList(user)
    }

    @GetMapping("/api/app/entity/reference")
    @PreAuthorize("isAuthenticated()")
    fun references(@RequestParam entity: String): List<ReferenceRecord> {
        val user = userService.getCurrentUserNotNull()
        return entityService.referenceList(user, entity)
    }

    @PostMapping("/api/app/entity")
    @PreAuthorize("isAuthenticated()")
    fun list(@RequestBody request: EntityListRequest): EntityListPage {
        val user = userService.getCurrentUserNotNull()
        return entityService.list(user, request)
    }

    @GetMapping("/api/app/entity/{id}")
    @PreAuthorize("isAuthenticated()")
    fun byId(@PathVariable id: UUID, @RequestParam entity: String): Map<String, Any?> {
        val user = userService.getCurrentUserNotNull()
        return entityService.byId(user, entity, id)
    }

    @PatchMapping("/api/app/entity")
    @PreAuthorize("isAuthenticated()")
    fun update(@RequestBody request: UpdateEntityRequest) {
        val user = userService.getCurrentUserNotNull()
        entityService.update(user, request)
    }

    @DeleteMapping("/api/app/entity/{id}")
    @PreAuthorize("isAuthenticated()")
    fun delete(@PathVariable id: UUID, @RequestParam entity: String) {
        val user = userService.getCurrentUserNotNull()
        entityService.delete(user, entity, id)
    }

}