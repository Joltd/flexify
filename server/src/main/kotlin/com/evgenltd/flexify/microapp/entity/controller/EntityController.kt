package com.evgenltd.flexify.microapp.entity.controller

import com.evgenltd.flexify.common.pascalCase
import com.evgenltd.flexify.microapp.entity.record.*
import com.evgenltd.flexify.microapp.entity.service.EntityService
import com.evgenltd.flexify.user.service.UserService
import com.fasterxml.jackson.databind.JsonNode
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
    fun entityList(): List<EntityMetadata> {
        val user = userService.getCurrentUserNotNull()
        return entityService.entityList(user)
    }

    @GetMapping("/api/app/entity/{entity}/reference")
    @PreAuthorize("isAuthenticated()")
    fun references(@PathVariable entity: String, @RequestParam(required = false) search: String?): List<ReferenceRecord> {
        val user = userService.getCurrentUserNotNull()
        return entityService.referenceList(user, entity.pascalCase(), search)
    }

    @PostMapping("/api/app/entity/{entity}")
    @PreAuthorize("isAuthenticated()")
    fun list(@PathVariable entity: String, @RequestBody request: EntityListRequest): EntityListPage {
        val user = userService.getCurrentUserNotNull()
        return entityService.list(user, entity.pascalCase(), request)
    }

    @GetMapping("/api/app/entity/{entity}/{id}")
    @PreAuthorize("isAuthenticated()")
    fun byId(@PathVariable entity: String, @PathVariable id: UUID): JsonNode {
        val user = userService.getCurrentUserNotNull()
        return entityService.byId(user, entity.pascalCase(), id)
    }

    @PatchMapping("/api/app/entity/{entity}")
    @PreAuthorize("isAuthenticated()")
    fun update(@PathVariable entity: String, @RequestBody request: JsonNode) {
        val user = userService.getCurrentUserNotNull()
        entityService.update(user, entity.pascalCase(), request)
    }

    @DeleteMapping("/api/app/entity/{entity}/{id}")
    @PreAuthorize("isAuthenticated()")
    fun delete(@PathVariable entity: String, @PathVariable id: UUID) {
        val user = userService.getCurrentUserNotNull()
        entityService.delete(user, entity.pascalCase(), id)
    }

}