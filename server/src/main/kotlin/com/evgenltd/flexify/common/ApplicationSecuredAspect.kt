package com.evgenltd.flexify.common

import com.evgenltd.flexify.user.service.UserService
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component

@Aspect
@Component
class ApplicationSecuredAspect(
    private val userService: UserService,
) {

    @Before("@annotation(ApplicationSecured)")
    fun checkAccess(applicationSecured: ApplicationSecured) {
        val authentication = SecurityContextHolder.getContext().authentication
        if (!userService.hasApplication(authentication, applicationSecured.value)) {
            throw AccessDeniedException("Access denied")
        }
    }

}