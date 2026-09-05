package com.example.placement_portal.controller;

import com.example.placement_portal.model.ApplicationStatus;
import com.example.placement_portal.model.PlacementApplication;
import com.example.placement_portal.service.PlacementApplicationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class PlacementApplicationController {

    private final PlacementApplicationService applicationService;

    @Autowired
    public PlacementApplicationController(
            PlacementApplicationService applicationService) {

        this.applicationService = applicationService;
    }

    // STUDENT APPLIES
    @PostMapping("/apply")
    public ResponseEntity<PlacementApplication> applyForDrive(

            @RequestParam Long studentId,
            @RequestParam Long driveId) {

        PlacementApplication application =
                applicationService.applyForDrive(
                        studentId,
                        driveId
                );

        return ResponseEntity.ok(application);
    }

    // STUDENT VIEWS THEIR APPLICATIONS
    @GetMapping("/student/{studentId}")
    public ResponseEntity<Page<PlacementApplication>>
    getStudentApplications(

            @PathVariable Long studentId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        return ResponseEntity.ok(
                applicationService.getStudentApplications(
                        studentId,
                        page,
                        size
                )
        );
    }

    // COORDINATOR VIEWS APPLICANTS FOR A DRIVE
    @GetMapping("/drive/{driveId}")
    public ResponseEntity<Page<PlacementApplication>>
    getDriveApplications(

            @PathVariable Long driveId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        return ResponseEntity.ok(
                applicationService.getDriveApplications(
                        driveId,
                        page,
                        size
                )
        );
    }

    // GET ONE APPLICATION
    @GetMapping("/{id}")
    public ResponseEntity<PlacementApplication>
    getApplicationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                applicationService.getApplicationById(id)
        );
    }

    // COORDINATOR CHANGES APPLICATION STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<PlacementApplication>
    updateApplicationStatus(

            @PathVariable Long id,

            @RequestParam ApplicationStatus status) {

        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(
                        id,
                        status
                )
        );
    }
}