package com.evgenltd.flexify.user.controller

import com.evgenltd.flexify.microapp.admin.record.UserRecord
import com.evgenltd.flexify.user.record.ApplicationUser
import com.evgenltd.flexify.user.record.AuthenticationRequest
import com.evgenltd.flexify.user.record.AuthenticationResponse
import com.evgenltd.flexify.user.repository.UserRepository
import com.evgenltd.flexify.user.service.TokenProvider
import com.evgenltd.flexify.user.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(
    private val authenticationManager: AuthenticationManager,
    private val tokenProvider: TokenProvider,
    private val userService: UserService,
) {

    @GetMapping("/api/user")
    fun user(): ResponseEntity<UserRecord> {
        val user = userService.getCurrentUser()
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED.value()).build()
        val response = UserRecord(
            id = user.id,
            login = user.login,
            deleted = user.deleted,
            applications = user.applications.toList()
        )
        return ResponseEntity.ok(response)
    }

    @PostMapping("/api/user/login")
    fun login(@RequestBody request: AuthenticationRequest): ResponseEntity<AuthenticationResponse> {
        val authRequest = UsernamePasswordAuthenticationToken.unauthenticated(request.login, request.password)
        val authResponse = authenticationManager.authenticate(authRequest)
        val user = authResponse.principal as ApplicationUser
        val token = tokenProvider.createToken(user.username, user.applications)
        return ResponseEntity.ok(AuthenticationResponse(token))
    }

}