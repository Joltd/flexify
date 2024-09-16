package com.evgenltd.flexify.microapp.entity

import org.springframework.security.access.prepost.PreAuthorize

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.TYPE)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("isAuthenticated() and @userService.hasApplication(authentication, T(com.evgenltd.flexify.microapp.MicroApp).ENTITY)")
annotation class EntityAppSecured
