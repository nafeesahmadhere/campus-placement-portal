package com.example.placement_portal.service;

import com.example.placement_portal.model.ApplicationStatus;
import com.example.placement_portal.model.DriveStatus;

import com.example.placement_portal.repository.PlacementApplicationRepository;
import com.example.placement_portal.repository.PlacementDriveRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final PlacementDriveRepository placementDriveRepository;

    private final PlacementApplicationRepository applicationRepository;

    @Autowired
    public DashboardService(
            PlacementDriveRepository placementDriveRepository,
            PlacementApplicationRepository applicationRepository) {

        this.placementDriveRepository =
                placementDriveRepository;

        this.applicationRepository =
                applicationRepository;
    }

    public Map<String, Long> getDashboardStats() {

        long totalDrives =
                placementDriveRepository.count();

        long openDrives =
                placementDriveRepository.countByStatus(
                        DriveStatus.OPEN
                );

        long totalApplications =
                applicationRepository.count();

        long selectedStudents =
                applicationRepository
                        .countDistinctStudentsByStatus(
                                ApplicationStatus.SELECTED
                        );

        long technicalInterviews =
                applicationRepository.countByStatus(
                        ApplicationStatus.TECHNICAL_INTERVIEW
                );

        long hrInterviews =
                applicationRepository.countByStatus(
                        ApplicationStatus.HR_INTERVIEW
                );

        long interviewStage =
                technicalInterviews + hrInterviews;

        Map<String, Long> stats =
                new LinkedHashMap<>();

        stats.put(
                "totalDrives",
                totalDrives
        );

        stats.put(
                "openDrives",
                openDrives
        );

        stats.put(
                "totalApplications",
                totalApplications
        );

        stats.put(
                "selectedStudents",
                selectedStudents
        );

        stats.put(
                "interviewStage",
                interviewStage
        );

        return stats;
    }
}