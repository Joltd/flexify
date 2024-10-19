package com.evgenltd.flexify.microapp.jirify.squadapp.entity

enum class JiraIssueStatus(val value: String) {
    UNKNOWN("Unknown"),
    TODO("К выполнению"),
    IN_PROGRESS("В работе"),
    READY_FOR_QA("Ready for QA"),
    TESTING("Тестирование"),
    READY_FOR_DEPLOY("Ready for deploy"),
    DONE("Готово"),
}