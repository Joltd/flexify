package com.evgenltd.flexify.microapp.jirify.squadapp.controller

import com.evgenltd.flexify.microapp.jirify.JirifyAppSecured
import com.evgenltd.flexify.microapp.jirify.squadapp.record.ActiveSprintResponse
import com.evgenltd.flexify.microapp.jirify.squadapp.record.BeginWorkRequest
import com.evgenltd.flexify.microapp.jirify.squadapp.service.HomeService
import com.evgenltd.flexify.user.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class HomeController(
    private val userService: UserService,
    private val homeService: HomeService,
) {

    @GetMapping("/api/app/jirify/squad-app/home/active-sprint")
    @JirifyAppSecured
    fun activeSprint(): ActiveSprintResponse {
        val user = userService.getCurrentUserNotNull()
        return homeService.activeSprint(user)
    }

    @PostMapping("/api/app/jirify/squad-app/home/begin-work")
    @JirifyAppSecured
    fun beginWork(@RequestBody request: BeginWorkRequest) {
        val user = userService.getCurrentUserNotNull()
        homeService.beginWork(user, request)
    }

}