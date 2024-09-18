package com.evgenltd.flexify.microapp.jirify.common.service.integration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.ClientHttpResponse
import org.springframework.web.client.ResponseErrorHandler
import org.springframework.web.client.RestTemplate

@Configuration
class RestConfig {

    @Bean
    fun restTemplate(): RestTemplate = RestTemplate().apply {
        errorHandler = object : ResponseErrorHandler {
            override fun hasError(response: ClientHttpResponse): Boolean = false

            override fun handleError(response: ClientHttpResponse) {}
        }
    }

}