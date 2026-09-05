package com.example.placement_portal.service;

import com.example.placement_portal.exception.ResourceNotFoundException;

import com.example.placement_portal.model.DriveStatus;
import com.example.placement_portal.model.PlacementDrive;

import com.example.placement_portal.repository.PlacementDriveRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository placementDriveRepository;

    @Autowired
    public PlacementDriveService(
            PlacementDriveRepository placementDriveRepository) {

        this.placementDriveRepository =
                placementDriveRepository;
    }

    // CREATE
    public PlacementDrive createDrive(
            PlacementDrive placementDrive) {

        placementDrive.setStatus(
                DriveStatus.OPEN
        );

        return placementDriveRepository
                .save(placementDrive);
    }

    // PAGINATION + SORTING + FILTERING
    public Page<PlacementDrive> getAllDrives(

            int page,
            int size,
            String sortBy,
            String direction,

            String company,
            String role,
            String location,
            Double studentCgpa) {

        Sort sort;

        if (direction.equalsIgnoreCase("desc")) {

            sort = Sort.by(sortBy)
                    .descending();

        } else {

            sort = Sort.by(sortBy)
                    .ascending();
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        sort
                );

        return placementDriveRepository
                .searchDrives(
                        company,
                        role,
                        location,
                        studentCgpa,
                        pageable
                );
    }

    // READ BY ID
    public PlacementDrive getDriveById(
            Long id) {

        return placementDriveRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Placement drive not found with id: "
                                        + id
                        )
                );
    }

    // UPDATE DRIVE DETAILS
    public PlacementDrive updateDrive(
            Long id,
            PlacementDrive updatedDrive) {

        PlacementDrive drive =
                getDriveById(id);

        drive.setCompanyName(
                updatedDrive.getCompanyName()
        );

        drive.setRole(
                updatedDrive.getRole()
        );

        drive.setDescription(
                updatedDrive.getDescription()
        );

        drive.setPackageLpa(
                updatedDrive.getPackageLpa()
        );

        drive.setLocation(
                updatedDrive.getLocation()
        );

        drive.setMinimumCgpa(
                updatedDrive.getMinimumCgpa()
        );

        drive.setMaxBacklogs(
                updatedDrive.getMaxBacklogs()
        );

        drive.setDeadline(
                updatedDrive.getDeadline()
        );

        drive.getEligibleDepartments().clear();

        if (updatedDrive.getEligibleDepartments() != null) {

            drive.getEligibleDepartments().addAll(
                    updatedDrive.getEligibleDepartments()
            );
        }

        return placementDriveRepository
                .save(drive);
    }

    // UPDATE ONLY DRIVE STATUS
    public PlacementDrive updateDriveStatus(
            Long id,
            DriveStatus status) {

        PlacementDrive drive =
                getDriveById(id);

        drive.setStatus(status);

        return placementDriveRepository
                .save(drive);
    }

    // DELETE
    public void deleteDrive(
            Long id) {

        PlacementDrive drive =
                getDriveById(id);

        placementDriveRepository
                .delete(drive);
    }
}