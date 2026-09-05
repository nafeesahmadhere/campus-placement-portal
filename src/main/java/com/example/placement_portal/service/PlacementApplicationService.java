package com.example.placement_portal.service;

import com.example.placement_portal.exception.BusinessException;
import com.example.placement_portal.exception.ResourceNotFoundException;

import com.example.placement_portal.model.ApplicationStatus;
import com.example.placement_portal.model.DriveStatus;
import com.example.placement_portal.model.PlacementApplication;
import com.example.placement_portal.model.PlacementDrive;
import com.example.placement_portal.model.StudentProfile;

import com.example.placement_portal.repository.PlacementApplicationRepository;
import com.example.placement_portal.repository.PlacementDriveRepository;
import com.example.placement_portal.repository.StudentProfileRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PlacementApplicationService {

    private final PlacementApplicationRepository applicationRepository;

    private final StudentProfileRepository studentProfileRepository;

    private final PlacementDriveRepository placementDriveRepository;

    @Autowired
    public PlacementApplicationService(
            PlacementApplicationRepository applicationRepository,
            StudentProfileRepository studentProfileRepository,
            PlacementDriveRepository placementDriveRepository) {

        this.applicationRepository =
                applicationRepository;

        this.studentProfileRepository =
                studentProfileRepository;

        this.placementDriveRepository =
                placementDriveRepository;
    }

    // STUDENT APPLIES FOR DRIVE
    public PlacementApplication applyForDrive(
            Long studentId,
            Long driveId) {

        StudentProfile student =
                studentProfileRepository
                        .findById(studentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found with id: "
                                                + studentId
                                )
                        );

        PlacementDrive drive =
                placementDriveRepository
                        .findById(driveId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Placement drive not found with id: "
                                                + driveId
                                )
                        );

        // 1. DRIVE STATUS CHECK
        if (drive.getStatus() != null
                && drive.getStatus() != DriveStatus.OPEN) {

            throw new BusinessException(
                    "Applications are closed for this placement drive"
            );
        }

        // 2. DEADLINE CHECK
        if (drive.getDeadline() != null
                && drive.getDeadline()
                .isBefore(LocalDate.now())) {

            throw new BusinessException(
                    "Application deadline has already passed"
            );
        }

        // 3. CGPA CHECK
        if (drive.getMinimumCgpa() != null
                && student.getCgpa()
                < drive.getMinimumCgpa()) {

            throw new BusinessException(
                    "Student is not eligible. "
                            + "Minimum CGPA required: "
                            + drive.getMinimumCgpa()
                            + ", Student CGPA: "
                            + student.getCgpa()
            );
        }

        // 4. BACKLOG CHECK
        if (drive.getMaxBacklogs() != null
                && student.getBacklogs()
                > drive.getMaxBacklogs()) {

            throw new BusinessException(
                    "Student is not eligible. "
                            + "Maximum backlogs allowed: "
                            + drive.getMaxBacklogs()
                            + ", Student backlogs: "
                            + student.getBacklogs()
            );
        }

        // 5. DEPARTMENT CHECK
        if (drive.getEligibleDepartments() != null
                && !drive.getEligibleDepartments().isEmpty()) {

            boolean departmentAllowed =
                    drive.getEligibleDepartments()
                            .stream()
                            .anyMatch(department ->
                                    department.equalsIgnoreCase(
                                            student.getDepartment()
                                    )
                            );

            if (!departmentAllowed) {

                throw new BusinessException(
                        "Student department "
                                + student.getDepartment()
                                + " is not eligible for this drive. "
                                + "Eligible departments: "
                                + drive.getEligibleDepartments()
                );
            }
        }

        // 6. DUPLICATE APPLICATION CHECK
        boolean alreadyApplied =
                applicationRepository
                        .existsByStudentIdAndPlacementDriveId(
                                studentId,
                                driveId
                        );

        if (alreadyApplied) {

            throw new BusinessException(
                    "Student has already applied "
                            + "for this placement drive"
            );
        }

        // ALL CHECKS PASSED
        PlacementApplication application =
                new PlacementApplication();

        application.setStudent(student);

        application.setPlacementDrive(drive);

        application.setStatus(
                ApplicationStatus.APPLIED
        );

        return applicationRepository
                .save(application);
    }

    public Page<PlacementApplication> getStudentApplications(
            Long studentId,
            int page,
            int size) {

        if (!studentProfileRepository.existsById(studentId)) {

            throw new ResourceNotFoundException(
                    "Student not found with id: "
                            + studentId
            );
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("appliedAt")
                                .descending()
                );

        return applicationRepository
                .findByStudentId(
                        studentId,
                        pageable
                );
    }

    public Page<PlacementApplication> getDriveApplications(
            Long driveId,
            int page,
            int size) {

        if (!placementDriveRepository.existsById(driveId)) {

            throw new ResourceNotFoundException(
                    "Placement drive not found with id: "
                            + driveId
            );
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("appliedAt")
                                .descending()
                );

        return applicationRepository
                .findByPlacementDriveId(
                        driveId,
                        pageable
                );
    }

    public PlacementApplication getApplicationById(
            Long id) {

        return applicationRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: "
                                        + id
                        )
                );
    }

    public PlacementApplication updateApplicationStatus(
            Long id,
            ApplicationStatus status) {

        PlacementApplication application =
                getApplicationById(id);

        application.setStatus(status);

        return applicationRepository
                .save(application);
    }
}