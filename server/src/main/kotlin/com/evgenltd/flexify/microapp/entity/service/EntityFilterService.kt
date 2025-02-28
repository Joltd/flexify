package com.evgenltd.flexify.microapp.entity.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.common.Label
import com.evgenltd.flexify.microapp.entity.record.*
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.treeToValue
import jakarta.persistence.EntityManager
import jakarta.persistence.criteria.*
import org.springframework.stereotype.Service
import java.util.UUID
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.javaField

@Service
class EntityFilterService(
    private val entityManager: EntityManager,
    private val mapper: ObjectMapper,
) {

    fun buildPredicateByLabel(metadata: EntityMetadata, root: Root<out Any>, search: String?): Predicate {
        val cb = entityManager.criteriaBuilder
        if (search.isNullOrBlank() || search.length < 3) {
            return cb.conjunction()
        }
        val labelFieldName = metadata.type
            .javaType
            .kotlin
            .memberProperties
            .find { it.javaField?.isAnnotationPresent(Label::class.java) == true }
            ?.name
            ?: return cb.conjunction()

        return cb.like(cb.lower(root.get(labelFieldName)), "%${search.lowercase()}%")
    }

    fun buildPredicate(metadata: EntityMetadata, node: EntityFilterNode?, root: Root<out Any>): Predicate {
        val cb = entityManager.criteriaBuilder
        if (node == null) {
            return cb.conjunction()
        }

        if (node.combinator != null && node.rules != null) {
            val nodes = node.rules.map { buildPredicate(metadata, it, root) }
            val predicate = when (node.combinator) {
                EntityFilterCombinator.AND -> cb.and(*nodes.toTypedArray())
                EntityFilterCombinator.OR -> cb.or(*nodes.toTypedArray())
            }
            return if (node.not == true) {
                cb.not(predicate)
            } else {
                predicate
            }
        }

        if (node.field == null || node.operator == null) {
            throw ApplicationException("Field and operator are required for condition")
        }

        val field = metadata.field(node.field)

        if (node.operator !in field.operators)
            throw ApplicationException("Operator ${node.operator} is not allowed for field ${metadata.name}.${field.name}")

        val path = root.path(field)

        return cb.condition(path, node.operator, field, node.value)
    }

    private fun EntityMetadata.field(name: String): EntityFieldMetadata = fields
        .find { it.name == name }
        ?: throw ApplicationException("Field ${this.name}.$name not found")

    private fun Root<out Any>.path(field: EntityFieldMetadata): Path<out Any> =
        if (field.kind == EntityFieldKind.REFERENCE) {
            get<Any>(field.name).get<UUID>("id")
        } else {
            get(field.name)
        }

    private fun CriteriaBuilder.condition(path: Path<out Any>, operator: EntityFilterOperator, field: EntityFieldMetadata, value: JsonNode?): Predicate {
        if (operator == EntityFilterOperator.IS_NULL) {
            return isNull(path)
        }

        if (value == null || value.isNull) {
            throw ApplicationException("Value is required for operator $operator")
        }

        if (operator == EntityFilterOperator.IN_LIST) {
            if (!value.isArray) {
                throw ApplicationException("Value for IN_LIST operator should be a list")
            }

            val actualValues = value.map { it.toValue(field) }

            return path.`in`(actualValues)
        }

        val actualValue = value.toValue(field)

        return when (operator) {
            EntityFilterOperator.EQUALS -> equal(path, actualValue)
            EntityFilterOperator.GREATER -> greaterThan(path as Path<Comparable<Any>>, actualValue as Comparable<Any>)
            EntityFilterOperator.GREATER_EQUALS -> greaterThanOrEqualTo(path as Path<Comparable<Any>>, actualValue as Comparable<Any>)
            EntityFilterOperator.LESS -> lessThan(path as Path<Comparable<Any>>, actualValue as Comparable<Any>)
            EntityFilterOperator.LESS_EQUALS -> lessThanOrEqualTo(path as Path<Comparable<Any>>, actualValue as Comparable<Any>)
            EntityFilterOperator.LIKE -> like(path as Path<String>, "%$actualValue%")
            else -> throw ApplicationException("Unsupported operator $operator")
        }
    }

    private fun JsonNode.toValue(metadata: EntityFieldMetadata): Any? =
        if (metadata.kind == EntityFieldKind.REFERENCE) {
            mapper.treeToValue<ReferenceRecord>(this).id
        } else {
            mapper.treeToValue(this, metadata.type)
        }

}