package com.evgenltd.flexify.common

import org.springframework.http.HttpStatus
import org.springframework.web.ErrorResponseException

class ApplicationException : ErrorResponseException {

    constructor() : this(null, null)

    constructor(message: String) : this(message, null)

    constructor(exception: Throwable) : this(null, exception)

    constructor(message: String?, exception: Throwable?) : super(
        HttpStatus.BAD_REQUEST,
        exception
    ) {
        body.detail = message
    }

}