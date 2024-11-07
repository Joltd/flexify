package com.evgenltd.flexify.microapp.entity.record

import com.fasterxml.jackson.databind.JsonNode
import java.util.UUID

data class ReferenceRecord(
    val id: UUID,
    val label: String,
)

data class EntityListPage(
    val total: Int,
    val page: Int,
    val size: Int,
    val data: List<Map<String,Any?>>,
)

data class EntityListRequest(
    val entity: String,
    val page: Int = 0,
    val size: Int = 50,
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

//data class EntityListFilter(
//
//)

data class UpdateEntityRequest(
    val entity: String,
    val id: UUID?,
    val body: JsonNode,
)
