package com.evgenltd.flexify.microapp.entity.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.entity.record.EntityFieldKind
import com.evgenltd.flexify.microapp.entity.record.EntityFilterOperator
import kotlin.reflect.KMutableProperty1
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.javaField

val allowedOperators = setOf(
    EntityFieldKind.ID to EntityFilterOperator.EQUALS,

    EntityFieldKind.STRING to EntityFilterOperator.EQUALS,
    EntityFieldKind.STRING to EntityFilterOperator.LIKE,

    EntityFieldKind.NUMBER to EntityFilterOperator.EQUALS,
    EntityFieldKind.NUMBER to EntityFilterOperator.GREATER,
    EntityFieldKind.NUMBER to EntityFilterOperator.GREATER_EQUALS,
    EntityFieldKind.NUMBER to EntityFilterOperator.LESS,
    EntityFieldKind.NUMBER to EntityFilterOperator.LESS_EQUALS,

    EntityFieldKind.BOOLEAN to EntityFilterOperator.EQUALS,

    EntityFieldKind.DATE to EntityFilterOperator.EQUALS,
    EntityFieldKind.DATE to EntityFilterOperator.GREATER,
    EntityFieldKind.DATE to EntityFilterOperator.GREATER_EQUALS,
    EntityFieldKind.DATE to EntityFilterOperator.LESS,
    EntityFieldKind.DATE to EntityFilterOperator.LESS_EQUALS,

    EntityFieldKind.DATETIME to EntityFilterOperator.GREATER,
    EntityFieldKind.DATETIME to EntityFilterOperator.GREATER_EQUALS,
    EntityFieldKind.DATETIME to EntityFilterOperator.LESS,
    EntityFieldKind.DATETIME to EntityFilterOperator.LESS_EQUALS,

    EntityFieldKind.ENUM to EntityFilterOperator.IN_LIST,

    EntityFieldKind.REFERENCE to EntityFilterOperator.IN_LIST,

    EntityFieldKind.JSON to EntityFilterOperator.LIKE,
)

operator fun <T> Any.get(name: String): T? {
    val getter = this::class
        .memberProperties
        .find { it.name == name }
        ?: throw ApplicationException("Property $name not found in ${this::class}")
    return getter.call(this) as T?
}

operator fun <T> Any.get(annotation: Class<out Annotation>): T? {
    val getter = this::class
        .memberProperties
        .find { it.javaField?.isAnnotationPresent(annotation) == true }
        ?: throw ApplicationException("Property $annotation not found in ${this::class}")
    return getter.call(this) as T?
}

operator fun <T> Any.set(name: String, value: T?) {
    val setter = this::class
        .memberProperties
        .find { it.name == name }
        as? KMutableProperty1<Any, T?>
        ?: throw ApplicationException("Property $name not found in ${this::class}")
    setter.set(this, value)
}