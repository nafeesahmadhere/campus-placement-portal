package com.example.placement_portal.controller;

import com.example.placement_portal.service.DashboardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService =
                dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {

        return ResponseEntity.ok(
                dashboardService.getDashboardStats()
        );
    }
}