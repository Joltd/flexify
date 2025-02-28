package com.evgenltd.flexify.microapp.entity.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.common.Label
import com.evgenltd.flexify.microapp.entity.record.*
import com.evgenltd.flexify.user.entity.User
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.treeToValue
import jakarta.persistence.EntityManager
import jakarta.persistence.Id
import org.hibernate.Session
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID
import kotlin.reflect.full.*

@Service
class EntityService(
    private val entityMetadataService: EntityMetadataService,
    private val entityFilterService: EntityFilterService,
    private val entityManager: EntityManager,
    private val mapper: ObjectMapper,
) {

    fun entityList(user: User): List<EntityMetadata> = user.entities()

    fun referenceList(user: User, entity: String, search: String?): List<ReferenceRecord> {
        val entityMetadata = user.entity(entity)
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery()
        val root = query.from(entityMetadata.type)
        query.where(entityFilterService.buildPredicateByLabel(entityMetadata, root, search))
        return entityManager.createQuery(query)
            .setMaxResults(10)
            .resultList
            .filterNotNull()
            .map { it.toReference() }
    }

    fun list(user: User, entity: String, request: EntityListRequest): EntityListPage {
        val entityMetadata = user.entity(entity)

        val session = entityManager.unwrap(Session::class.java)
        session.disableFilter("_tenantId")

        val cb = entityManager.criteriaBuilder

        //

        val countQuery = cb.createQuery(Long::class.java)
        val countRoot = countQuery.from(entityMetadata.type)
        countQuery.where(entityFilterService.buildPredicate(entityMetadata, request.filter, countRoot))
        countQuery.select(cb.count(countRoot))
        val count = entityManager.createQuery(countQuery).singleResult

        //

        val query = cb.createQuery()
        val root = query.from(entityMetadata.type)
        query.where(entityFilterService.buildPredicate(entityMetadata, request.filter, root))
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
            .map { toData(entityMetadata, it) }

        return EntityListPage(
            total = count,
            page = request.page,
            size = request.size,
            data = result
        )
    }

    fun byId(user: User, entity: String, id: UUID): JsonNode {
        val entityMetadata = user.entity(entity)

        val data = entityManager.find(entityMetadata.type.javaType, id)

        return toData(entityMetadata, data)
    }

    @Transactional
    fun update(user: User, entityName: String, request: JsonNode) {
        val entityMetadata = user.entity(entityName)

        val id = request["id"]?.asText()?.let { UUID.fromString(it) }

        if (id == null) {

            val constructor = entityMetadata.type
                .javaType
                .kotlin
                .primaryConstructor
                ?: throw ApplicationException("Primary constructor not found for entity: $entityName")

            val parameters = constructor.parameters
                .filter { it.name == null }
                .associateWith { parameter ->
                    val entityFieldMetadata = entityMetadata.fields
                        .find { it.name == parameter.name }
                        ?: throw ApplicationException("Field metadata ${parameter.name} not found")
                    request[parameter.name]?.toValue(entityFieldMetadata)
                }

            val entity = constructor.callBy(parameters)
            entityManager.persist(entity)

        } else {

            val entity = entityManager.find(entityMetadata.type.javaType, id)
            for ((name, fieldNode) in request.properties()) {
                val entityFieldMetadata = entityMetadata.fields
                    .find { it.name == name }
                    ?: throw ApplicationException("Field metadata $name not found")
                entity[name] = fieldNode?.toValue(entityFieldMetadata)
            }

        }

    }

    fun delete(user: User, entity: String, id: UUID) {
        val entityMetadata = user.entity(entity)

        entityManager.createQuery("delete from ${entityMetadata.name} e where e.id = :id")
            .setParameter("id", id)
            .executeUpdate()
    }

    private fun toData(entityMetadata: EntityMetadata, entity: Any): ObjectNode {
        val result = mapper.createObjectNode()
        for (field in entityMetadata.fields) {
            var value = entity.get<Any>(field.name)
            if (field.kind == EntityFieldKind.REFERENCE) {
                value = value?.toReference()
            }
            val node = mapper.valueToTree<JsonNode>(value)
            result.putIfAbsent(field.name, node)
        }
        return result
    }

    private fun Any.toReference(): ReferenceRecord = ReferenceRecord(
        id = this[Id::class.java],
        label = this[Label::class.java],
    )

    private fun JsonNode.toValue(metadata: EntityFieldMetadata): Any? =
        if (metadata.kind == EntityFieldKind.REFERENCE) {
            entityManager.find(metadata.type, mapper.treeToValue<ReferenceRecord>(this).id)
        } else {
            mapper.treeToValue(this, metadata.type)
        }

    private fun User.entities(): List<EntityMetadata> {
        val allowedApplications = tenants
            .filter { it.active }
            .map { it.tenant.application }
        return entityMetadataService.entityByApplications(allowedApplications)
    }

    private fun User.entity(entity: String): EntityMetadata = entities()
        .find { it.name == entity }
        ?: throw ApplicationException("Entity $entity not found")

}