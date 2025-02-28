package com.evgenltd.flexify.microapp.entity.record

import com.evgenltd.flexify.microapp.MicroApp
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.JsonNode
import jakarta.persistence.metamodel.EntityType
import java.util.UUID

data class EntityMetadata(
    val name: String,
    val application: MicroApp,
    @JsonIgnore
    val type: EntityType<out Any>,
    val fields: List<EntityFieldMetadata>,
)

enum class EntityFieldKind(val order: Int) {
    ID(0),
    STRING(50),
    NUMBER(50),
    BOOLEAN(50),
    DATE(50),
    DATETIME(50),
    ENUM(10),
    REFERENCE(11),
    JSON(100),
}

data class EntityFieldMetadata(
    val name: String,
    val kind: EntityFieldKind,
    @JsonIgnore
    val type: Class<out Any>,
    val operators: List<EntityFilterOperator>,
    val entity: String? = null,
    val options: List<String> = emptyList(),
)

data class ReferenceRecord(
    val id: UUID?,
    val label: String?,
)

data class EntityListPage(
    val total: Long,
    val page: Int,
    val size: Int,
    val data: List<JsonNode>,
)

data class EntityListRequest(
    val page: Int = 0,
    val size: Int = 50,
    val filter: EntityFilterNode? = null,
    val sort: List<EntityListSort> = emptyList(),
)

data class EntityListSort(
    val field: String,
    val direction: Direction,
) {
    enum class Direction {
        ASC,
        DESC,
    }
}

data class EntityFilterNode(
    val combinator: EntityFilterCombinator? = null,
    val rules: List<EntityFilterNode>? = null,
    val not: Boolean? = false,
    val field: String? = null,
    val operator: EntityFilterOperator? = null,
    val value: JsonNode? = null,
)

enum class EntityFilterCombinator {
    AND,
    OR,
}

enum class EntityFilterOperator {
    EQUALS,
    GREATER,
    GREATER_EQUALS,
    LESS,
    LESS_EQUALS,
    LIKE,
//    BETWEEN,
    IN_LIST,
    IS_NULL,
}
