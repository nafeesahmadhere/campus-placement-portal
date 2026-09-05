package com.example.placement_portal.repository;

import com.example.placement_portal.model.DriveStatus;
import com.example.placement_portal.model.PlacementDrive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlacementDriveRepository
        extends JpaRepository<PlacementDrive, Long> {

    @Query("""
            SELECT p
            FROM PlacementDrive p
            WHERE
            (:company IS NULL
                OR LOWER(p.companyName)
                LIKE LOWER(CONCAT('%', :company, '%')))

            AND
            (:role IS NULL
                OR LOWER(p.role)
                LIKE LOWER(CONCAT('%', :role, '%')))

            AND
            (:location IS NULL
                OR LOWER(p.location)
                LIKE LOWER(CONCAT('%', :location, '%')))

            AND
            (:studentCgpa IS NULL
                OR p.minimumCgpa <= :studentCgpa)
            """)
    Page<PlacementDrive> searchDrives(

            @Param("company")
            String company,

            @Param("role")
            String role,

            @Param("location")
            String location,

            @Param("studentCgpa")
            Double studentCgpa,

            Pageable pageable
    );

    // Count OPEN or CLOSED drives
    long countByStatus(DriveStatus status);
}