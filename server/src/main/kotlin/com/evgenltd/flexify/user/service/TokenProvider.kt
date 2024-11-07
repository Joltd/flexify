package com.evgenltd.flexify.user.service

import com.evgenltd.flexify.microapp.MicroApp
import com.evgenltd.flexify.user.config.SecurityConfig
import com.evgenltd.flexify.user.config.SecurityProperties
import com.evgenltd.flexify.user.record.TenantEntry
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.security.oauth2.jwt.*
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class TokenProvider(
    private val properties: SecurityProperties,
    private val encoder: JwtEncoder,
    private val mapper: ObjectMapper,
) {

    fun createToken(login: String, applications: List<MicroApp>, tenants: List<TenantEntry>): String {
        val now = Instant.now()
        val validity = now.plusSeconds(properties.validitySeconds)

        val claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(login)
            .claim(SecurityConfig.APPLICATIONS, applications)
            .claim(SecurityConfig.TENANTS, mapper.writeValueAsString(tenants))
            .build()
        val header = JwsHeader.with(SecurityConfig.ALGORITHM).build()
        val parameters = JwtEncoderParameters.from(header, claims)

        return encoder.encode(parameters).tokenValue
    }

}