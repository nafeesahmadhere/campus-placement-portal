package com.example.placement_portal.repository;

import com.example.placement_portal.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentProfileRepository
        extends JpaRepository<StudentProfile, Long> {

}