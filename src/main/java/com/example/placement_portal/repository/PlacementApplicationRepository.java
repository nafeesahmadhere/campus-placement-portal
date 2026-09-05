package com.example.placement_portal.repository;

import com.example.placement_portal.model.ApplicationStatus;
import com.example.placement_portal.model.PlacementApplication;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlacementApplicationRepository
        extends JpaRepository<PlacementApplication, Long> {

    boolean existsByStudentIdAndPlacementDriveId(
            Long studentId,
            Long placementDriveId
    );

    Page<PlacementApplication> findByStudentId(
            Long studentId,
            Pageable pageable
    );

    Page<PlacementApplication> findByPlacementDriveId(
            Long placementDriveId,
            Pageable pageable
    );

    // Count applications based on status
    long countByStatus(ApplicationStatus status);

    // Count unique students who received an offer
    @Query("""
            SELECT COUNT(DISTINCT p.student.id)
            FROM PlacementApplication p
            WHERE p.status = :status
            """)
    long countDistinctStudentsByStatus(
            @Param("status")
            ApplicationStatus status
    );
}