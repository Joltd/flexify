package com.evgenltd.flexify.microapp.entity.controller

import com.evgenltd.flexify.microapp.entity.EntityAppSecured
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class EntityController {

    @GetMapping("/api/app/entity/list")
    @EntityAppSecured
    fun list(): String {
        return "entity Test"
    }

}