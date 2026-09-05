package com.example.placement_portal.controller;

import com.example.placement_portal.model.DriveStatus;
import com.example.placement_portal.model.PlacementDrive;

import com.example.placement_portal.service.PlacementDriveService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/drives")
public class PlacementDriveController {

    private final PlacementDriveService placementDriveService;

    @Autowired
    public PlacementDriveController(
            PlacementDriveService placementDriveService) {

        this.placementDriveService =
                placementDriveService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<PlacementDrive> createDrive(
            @RequestBody PlacementDrive placementDrive) {

        return ResponseEntity.ok(
                placementDriveService
                        .createDrive(placementDrive)
        );
    }

    // GET ALL
    // PAGINATION + SORTING + FILTERING
    @GetMapping
    public ResponseEntity<Page<PlacementDrive>> getAllDrives(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size,

            @RequestParam(defaultValue = "createdAt")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction,

            @RequestParam(required = false)
            String company,

            @RequestParam(required = false)
            String role,

            @RequestParam(required = false)
            String location,

            @RequestParam(required = false)
            Double studentCgpa) {

        return ResponseEntity.ok(
                placementDriveService.getAllDrives(
                        page,
                        size,
                        sortBy,
                        direction,
                        company,
                        role,
                        location,
                        studentCgpa
                )
        );
    }

    // GET ONE
    @GetMapping("/{id}")
    public ResponseEntity<PlacementDrive> getDriveById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                placementDriveService
                        .getDriveById(id)
        );
    }

    // UPDATE DETAILS
    @PutMapping("/{id}")
    public ResponseEntity<PlacementDrive> updateDrive(

            @PathVariable Long id,

            @RequestBody PlacementDrive placementDrive) {

        return ResponseEntity.ok(
                placementDriveService
                        .updateDrive(
                                id,
                                placementDrive
                        )
        );
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<PlacementDrive> updateDriveStatus(

            @PathVariable Long id,

            @RequestParam DriveStatus status) {

        return ResponseEntity.ok(
                placementDriveService
                        .updateDriveStatus(
                                id,
                                status
                        )
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDrive(
            @PathVariable Long id) {

        placementDriveService
                .deleteDrive(id);

        return ResponseEntity.ok(
                "Placement drive deleted successfully"
        );
    }
}