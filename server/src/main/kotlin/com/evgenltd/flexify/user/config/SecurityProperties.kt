package com.evgenltd.flexify.user.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "security")
data class SecurityProperties(
    val secret: String,
    val validitySeconds: Long
)