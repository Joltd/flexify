package com.evgenltd.flexify.user.service

import com.evgenltd.flexify.microapp.MicroApp
import com.evgenltd.flexify.user.config.SecurityConfig
import com.evgenltd.flexify.user.config.SecurityProperties
import org.springframework.security.oauth2.jwt.*
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class TokenProvider(
    private val properties: SecurityProperties,
    private val encoder: JwtEncoder,
) {

    fun createToken(login: String, applications: List<MicroApp>): String {
        val now = Instant.now()
        val validity = now.plusSeconds(properties.validitySeconds)

        val claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(login)
            .claim(SecurityConfig.APPLICATIONS, applications)
//            .claim(SecurityConfig.AUTHORITIES, "")
            .build()
        val header = JwsHeader.with(SecurityConfig.ALGORITHM).build()
        val parameters = JwtEncoderParameters.from(header, claims)

        return encoder.encode(parameters).tokenValue
    }

}