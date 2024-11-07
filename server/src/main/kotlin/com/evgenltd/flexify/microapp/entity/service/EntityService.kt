package com.evgenltd.flexify.microapp.entity.service

import com.evgenltd.flexify.common.Application
import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.common.Label
import com.evgenltd.flexify.microapp.MicroApp
import com.evgenltd.flexify.microapp.entity.record.*
import com.evgenltd.flexify.user.entity.User
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.persistence.EntityManager
import jakarta.persistence.Id
import jakarta.persistence.metamodel.Attribute
import jakarta.persistence.metamodel.EntityType
import jakarta.persistence.metamodel.SingularAttribute
import jakarta.persistence.metamodel.Type
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID
import kotlin.reflect.KMutableProperty1
import kotlin.reflect.full.*
import kotlin.reflect.jvm.javaField

@Service
class EntityService(
    private val entityManager: EntityManager,
    private val mapper: ObjectMapper,
) {

    fun entityList(user: User): List<String> = user.entities().map { it.name }

    fun referenceList(user: User, entity: String): List<ReferenceRecord> {
        val entityType = user.entity(entity)
        val converter = toReferenceConverter(entityType)
        return entityManager.criteriaBuilder
            .createQuery()
            .also { it.from(entityType) }
            .let { entityManager.createQuery(it) }
            .resultList
            .map { converter(it) }
    }

    fun list(user: User, request: EntityListRequest): EntityListPage {
        val entityType = user.entity(request.entity)

        val cb = entityManager.criteriaBuilder

        val query = cb.createQuery()
        val root = query.from(entityType)
        query.orderBy(request.sort.map {
            when (it.direction) {
                EntityListSort.Direction.ASC -> cb.asc(root.get<Any>(it.field))
                EntityListSort.Direction.DESC -> cb.desc(root.get<Any>(it.field))
            }
        })

        val result = entityManager.createQuery(query)
            .setFirstResult(request.page * request.size)
            .setMaxResults(request.size)
            .resultList
            .map { toData(entityType, it) }

        return EntityListPage(
            total = 0,
            page = request.page,
            size = request.size,
            data = result
        )
    }

    fun byId(user: User, entity: String, id: UUID): Map<String, Any?> {
        val entityType = user.entity(entity)

        val data = entityManager.find(entityType.javaType, id)

        return toData(entityType, data)
    }

    @Transactional
    fun update(user: User, request: UpdateEntityRequest) {

        val entityType = entityManager.metamodel
            .entities
            .find { it.name == request.entity }
            ?: throw ApplicationException("Entity ${request.entity} not found")

        val restricted = user.tenants
            .filter { it.active }
            .none {
                val application = entityType.javaType
                    .kotlin
                    .findAnnotation<Application>()
                    ?.value
                    ?: MicroApp.ADMIN

                it.tenant.application == application
            }
        if (restricted) {
            throw ApplicationException("Entity ${request.entity} not found")
        }

        val id = request.id
        val body = request.body

        if (id == null) {

            val constructor = entityType.javaType.kotlin.primaryConstructor
                ?: throw ApplicationException("Primary constructor not found for entity: ${request.entity}")

            val parameters = constructor.parameters
                .filter { it.name == null }
                .associateWith {
                    val fieldAttribute = entityType.getAttribute(it.name)
                    val fieldNode = body[it.name]
                    convertField(it.name!!, fieldNode, fieldAttribute)
                }

            val entity = constructor.callBy(parameters)
            entityManager.persist(entity)

        } else {

            val entity = entityManager.find(entityType.javaType, request.id)
            entityType.javaType.kotlin.memberProperties
            for ((name, valueNode) in body.properties()) {
                val fieldAttribute = entityType.getAttribute(name)
                val value = convertField(name, valueNode, fieldAttribute)
                val entityProperty = entityType.javaType
                    .kotlin
                    .memberProperties
                    .find { it.name == name && it is KMutableProperty1 }
                    as? KMutableProperty1<*, *>
                    ?: throw ApplicationException("Field $name not found")
                entityProperty.setter.call(entity, value)
            }

        }

    }

    @Transactional
    fun delete(user: User, entity: String, id: UUID) {

    }

    private fun convertField(name: String, valueNode: JsonNode, fieldAttribute: Attribute<in Nothing, out Any>): Any? {
        if (fieldAttribute !is SingularAttribute) {
            throw ApplicationException("Field $name not found")
        }

        if (fieldAttribute.isId) {
            throw ApplicationException("Field $name not found")
        }

        if (fieldAttribute.name == "tenant") {
            throw ApplicationException("Field $name not found")
        }

        if (valueNode.isNull) {
            if (!fieldAttribute.isOptional) {
                throw ApplicationException("Field $name should not be null")
            }
            return null
        }

        if (fieldAttribute.type.persistenceType == Type.PersistenceType.ENTITY) {
            val id = valueNode["id"]
            if (id == null || id.isNull) {
                throw ApplicationException("Field $name should have id")
            }
            return entityManager.find(fieldAttribute.type.javaType, id.asText())
                ?: throw ApplicationException("Value for field $name not found")
        }

        if (fieldAttribute.type.persistenceType == Type.PersistenceType.BASIC) {
            try {
                return mapper.convertValue(valueNode, fieldAttribute.type.javaType)
            } catch (e: Exception) {
                throw ApplicationException("Field $name should be ${fieldAttribute.type.javaType.simpleName}", e)
            }
        }

        throw ApplicationException("Field $name not found")
    }

    private fun toData(entityType: EntityType<*>, entity: Any): Map<String, Any?> {
        val converter = toReferenceConverter(entityType)

        return entityType.singularAttributes
            .mapNotNull {
                when (it.type.persistenceType) {
                    Type.PersistenceType.ENTITY -> {
                        it.name to entityType.javaType
                            .kotlin
                            .memberProperties
                            .find { member -> member.name == it.name }
                            ?.getter
                            ?.call(it)
                            ?.let { converter(it) }
                    }
                    Type.PersistenceType.BASIC -> {
                        it.name to entityType.javaType
                            .kotlin
                            .memberProperties
                            .find { member -> member.name == it.name }
                            ?.getter
                            ?.call(it)
                    }
                    else -> {
                        null
                    }
                }
            }
            .associate { it }
    }

    private fun toReferenceConverter(entityType: EntityType<*>): (Any) -> ReferenceRecord {
        val members = entityType.javaType.kotlin.memberProperties

        val getId = members.find { it.javaField?.isAnnotationPresent(Id::class.java) == true }
            ?: throw ApplicationException("Entity ${entityType.name} should have id field")
        val getLabel = members.find { it.javaField?.isAnnotationPresent(Label::class.java) == true }
            ?: throw ApplicationException("Entity ${entityType.name} should have label field")

        return { entity ->
            ReferenceRecord(
                id = getId.call(entity) as UUID,
                label = getLabel.call(entity) as String
            )
        }
    }

    private fun User.entities(): List<EntityType<*>> {
        val allowedApplications = tenants
            .filter { it.active }
            .map { it.tenant.application }

        return entityManager.metamodel
            .entities
            .filter { MicroApp.ADMIN in allowedApplications || it.application() in allowedApplications }
    }

    private fun User.entity(entity: String): EntityType<*> = entities()
        .find { it.name == entity }
        ?: throw ApplicationException("Entity $entity not found")

    private fun EntityType<*>.application(): MicroApp = javaType.kotlin
        .findAnnotation<Application>()
        ?.value
        ?: MicroApp.ADMIN

}