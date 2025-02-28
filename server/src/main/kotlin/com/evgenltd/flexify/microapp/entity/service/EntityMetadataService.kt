package com.evgenltd.flexify.microapp.entity.service

import com.evgenltd.flexify.common.Application
import com.evgenltd.flexify.microapp.MicroApp
import com.evgenltd.flexify.microapp.entity.record.EntityFieldMetadata
import com.evgenltd.flexify.microapp.entity.record.EntityFieldKind
import com.evgenltd.flexify.microapp.entity.record.EntityFilterOperator
import com.evgenltd.flexify.microapp.entity.record.EntityMetadata
import jakarta.annotation.PostConstruct
import jakarta.persistence.EntityManager
import jakarta.persistence.metamodel.EntityType
import jakarta.persistence.metamodel.SingularAttribute
import jakarta.persistence.metamodel.Type
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import kotlin.reflect.full.findAnnotation

@Service
class EntityMetadataService(
    private val entityManager: EntityManager
) {

    private lateinit var index: Map<String, EntityMetadata>

    @PostConstruct
    fun postConstruct() {
        index = entityManager.metamodel
            .entities
            .map { it.toEntityMetadata() }
            .associateBy { it.name }
    }

    fun entityByApplications(applications: List<MicroApp>): List<EntityMetadata> = index
        .values
        .filter { MicroApp.ADMIN in applications || it.application in applications }

    private fun EntityType<*>.toEntityMetadata(): EntityMetadata = EntityMetadata(
        name = name,
        application = javaType.kotlin
            .findAnnotation<Application>()
            ?.value
            ?: MicroApp.ADMIN,
        type = this,
        fields = singularAttributes.mapNotNull { it.toFieldMetadata() }
            .sortedBy {
                when (it.name) {
                    "name" -> 20
                    "createdAt","updatedAt" -> 200
                    else -> it.kind.order
                }
            }
    )

    private fun SingularAttribute<*, *>.toFieldMetadata(): EntityFieldMetadata? {

        val kind = when {
            isId -> EntityFieldKind.ID
            type.javaType.isEnum -> EntityFieldKind.ENUM
            type.persistenceType == Type.PersistenceType.ENTITY -> EntityFieldKind.REFERENCE
            hasSqlType(SqlTypes.JSON) -> EntityFieldKind.JSON
            type.persistenceType == Type.PersistenceType.BASIC ->
                when (type.javaType) {
                    String::class.java -> EntityFieldKind.STRING
                    Int::class.java, Long::class.java, Double::class.java, Float::class.java -> EntityFieldKind.NUMBER
                    Boolean::class.java -> EntityFieldKind.BOOLEAN
                    LocalDate::class.java, LocalDateTime::class.java -> EntityFieldKind.DATE
                    else -> return null
                }
            else -> return null
        }

        var operators = allowedOperators.filter { it.first == kind }
            .map { it.second }

        if (isOptional) {
            operators = operators + EntityFilterOperator.IS_NULL
        }

        val entity = type.takeIf { it.persistenceType == Type.PersistenceType.ENTITY }
            ?.javaType
            ?.simpleName // maybe we need to take name from entityManager

        val values = type.javaType.takeIf { it.isEnum }
            ?.enumConstants
            ?.map(Any::toString)
            ?: emptyList()

        return EntityFieldMetadata(name, kind, type.javaType, operators, entity, values)
    }

    private fun SingularAttribute<*, *>.hasSqlType(sqlType: Int): Boolean {
        val entityType = this.declaringType.javaType
        val field = entityType.getDeclaredField(name)
        val jdbcTypeAnnotation = field.getAnnotation(JdbcTypeCode::class.java)
        return jdbcTypeAnnotation?.value == sqlType
    }

}