package com.evgenltd.flexify.microapp.jirify

import org.springframework.security.access.prepost.PreAuthorize

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.TYPE)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("isAuthenticated() and @userService.hasApplication(authentication, T(com.evgenltd.flexify.microapp.MicroApp).JIRIFY)")
annotation class JirifyAppSecured