package com.evgenltd.flexify.microapp.jirify.squadapp.service

import com.evgenltd.flexify.microapp.jirify.common.entity.TaskStatus

const val ON_HOLD = "On hold"
const val TODO = "К выполнению"
const val IN_PROGRESS = "В работе"
const val READY_FOR_TESTING = "Ready for QA"
const val TESTING = "Тестирование"
const val READY_FOR_PROD = "Ready for deploy"
const val DONE = "Готово"
const val CANCELLED = "Отменено"

val mapping = mapOf(
    ON_HOLD to TaskStatus.ON_HOLD,
    TODO to TaskStatus.TODO,
    IN_PROGRESS to TaskStatus.IN_PROGRESS,
    READY_FOR_TESTING to TaskStatus.TESTING,
    TESTING to TaskStatus.TESTING,
    READY_FOR_PROD to TaskStatus.READY_TO_PROD,
    DONE to TaskStatus.DONE,
    CANCELLED to TaskStatus.CANCELLED,
)

val transfers = mapOf(
    TODO to mapOf(
        TaskStatus.TESTING to TaskStatus.TODO,
    ),
    READY_FOR_TESTING to mapOf(
        TaskStatus.IN_PROGRESS to TaskStatus.TESTING,
        TaskStatus.REVIEW to TaskStatus.TESTING,
    ),
    TESTING to mapOf(
        TaskStatus.IN_PROGRESS to TaskStatus.TESTING,
        TaskStatus.REVIEW to TaskStatus.TESTING,
    ),
    READY_FOR_PROD to mapOf(
        TaskStatus.TESTING to TaskStatus.READY_TO_PROD,
    ),
    DONE to mapOf(
        TaskStatus.REVIEW to TaskStatus.DONE,
        TaskStatus.READY_TO_PROD to TaskStatus.DONE,
    ),
    CANCELLED to mapOf(
        TaskStatus.TODO to TaskStatus.CANCELLED,
        TaskStatus.ON_HOLD to TaskStatus.CANCELLED,
    )
)
