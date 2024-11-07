package com.evgenltd.flexify.common

import com.evgenltd.flexify.microapp.MicroApp
import org.springframework.security.access.prepost.PreAuthorize

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class Application(
    val value: MicroApp
)

@Target(AnnotationTarget.FUNCTION, AnnotationTarget.TYPE)
@Retention(AnnotationRetention.RUNTIME)
@PreAuthorize("isAuthenticated()")
annotation class ApplicationSecured(
    val value: MicroApp
)

@Target(AnnotationTarget.FIELD)
@Retention(AnnotationRetention.RUNTIME)
annotation class Label