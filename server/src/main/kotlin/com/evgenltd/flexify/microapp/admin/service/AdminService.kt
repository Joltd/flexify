package com.evgenltd.flexify.microapp.admin.service

import com.evgenltd.flexify.common.ApplicationException
import com.evgenltd.flexify.microapp.admin.record.CreateUserRequest
import com.evgenltd.flexify.microapp.admin.record.UpdateUserRequest
import com.evgenltd.flexify.microapp.admin.record.UserRecord
import com.evgenltd.flexify.user.entity.User
import com.evgenltd.flexify.user.repository.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
open class AdminService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
) {

    fun userList(): List<UserRecord> {
//        Thread.sleep(2000)
//        throw ApplicationException("Test exception")
        return userRepository.findAll()
            .map { it -> UserRecord(
                it.id,
                it.login,
                it.deleted,
                it.applications.toList(),
            ) }
    }

    fun userById(id: UUID): UserRecord {
        val user = getUser(id)

        return UserRecord(
            id = user.id,
            login = user.login,
            deleted = user.deleted,
            applications = user.applications.toList()
        )
    }

    fun saveUser(request: CreateUserRequest) {
        checkLoginAvailable(request.login)

        val user = User(
            login = request.login,
            password = request.password,
            applications = request.applications.toMutableSet()
        )
        userRepository.save(user)
    }

    @Transactional
    open fun updateUser(id: UUID, request: UpdateUserRequest) {
        val user = getUser(id)

        if (user.login != request.login) {
            checkLoginAvailable(request.login)
        }

        user.login = request.login
        request.password?.let {
            user.password = passwordEncoder.encode(it)
        }
        user.deleted = request.deleted
        user.applications = request.applications.toMutableSet()
    }

    private fun getUser(id: UUID): User = userRepository.findByIdOrNull(id)
        ?: throw ApplicationException("User not found")

    private fun checkLoginAvailable(login: String) {
        val existedUser = userRepository.findByLoginAndDeletedIsFalse(login)
        if (existedUser != null) {
            throw ApplicationException("User with login $login already exists")
        }
    }

}