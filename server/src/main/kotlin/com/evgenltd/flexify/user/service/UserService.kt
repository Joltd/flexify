package com.evgenltd.flexify.user.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.MicroApp
import com.evgenltd.flexify.user.config.SecurityConfig
import com.evgenltd.flexify.user.entity.User
import com.evgenltd.flexify.user.record.ApplicationUser
import com.evgenltd.flexify.user.repository.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
) : UserDetailsService {

    fun getCurrentUser(): User? {
        val authentication = SecurityContextHolder.getContext().authentication
        return userRepository.findByLoginAndDeletedIsFalse(authentication.name)
    }

    fun getCurrentUserNotNull(): User {
        return getCurrentUser() ?: throw ApplicationException("User not found")
    }

    override fun loadUserByUsername(username: String?): ApplicationUser {
        if (username == null) {
            throw ApplicationException("Username is not specified")
        }
        val user = userRepository.findByLoginAndDeletedIsFalse(username) ?: throw ApplicationException("User not found")

        return ApplicationUser(
            user.login,
            user.password,
            user.deleted,
            mutableListOf(),
            user.applications.toList(),
        )
    }

    fun hasApplication(authentication: Authentication, application: MicroApp): Boolean {
        val principal = authentication.principal
        if (principal !is Jwt) {
            return false
        }
        // todo if applications changed this will be invalid
        val applications = principal.claims?.get(SecurityConfig.APPLICATIONS)
        if (applications !is List<*>) {
            return false
        }
        return applications.contains(application.name)
    }

}