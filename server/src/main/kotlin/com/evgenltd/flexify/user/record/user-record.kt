package com.evgenltd.flexify.user.record

import com.evgenltd.flexify.microapp.MicroApp
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

data class AuthenticationRequest(val login: String, val password: String)

data class AuthenticationResponse(val token: String)

class ApplicationUser(
    private val login: String,
    private val password: String,
    private val deleted: Boolean,
    private val roles: MutableList<GrantedAuthority>,
    val applications: List<MicroApp>,
) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> = roles

    override fun getPassword(): String = password

    override fun getUsername(): String = login

    override fun isEnabled(): Boolean = !deleted
}