package com.example.placement_portal.model;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "placement_drives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String role;

    @Column(length = 1500)
    private String description;

    private Double packageLpa;

    private String location;

    private Double minimumCgpa;

    private Integer maxBacklogs;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    private DriveStatus status;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "drive_eligible_departments",
            joinColumns = @JoinColumn(name = "drive_id")
    )
    @Column(name = "department")
    private Set<String> eligibleDepartments =
            new HashSet<>();

    private LocalDateTime createdAt;

    @PrePersist
    public void beforeCreate() {

        createdAt = LocalDateTime.now();

        if (status == null) {
            status = DriveStatus.OPEN;
        }
    }
}