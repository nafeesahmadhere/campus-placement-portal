package com.example.placement_portal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "placement_applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "student_id",
                                "placement_drive_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlacementApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private StudentProfile student;

    @ManyToOne
    @JoinColumn(
            name = "placement_drive_id",
            nullable = false
    )
    private PlacementDrive placementDrive;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private LocalDateTime appliedAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void beforeCreate() {

        appliedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = ApplicationStatus.APPLIED;
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();
    }
}