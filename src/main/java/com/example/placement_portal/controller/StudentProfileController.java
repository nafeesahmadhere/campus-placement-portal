package com.example.placement_portal.controller;

import com.example.placement_portal.model.StudentProfile;
import com.example.placement_portal.service.StudentProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    @Autowired
    public StudentProfileController(
            StudentProfileService studentProfileService) {

        this.studentProfileService =
                studentProfileService;
    }

    // CREATE STUDENT
    @PostMapping
    public ResponseEntity<StudentProfile> createStudent(
            @RequestBody StudentProfile studentProfile) {

        StudentProfile createdStudent =
                studentProfileService
                        .createStudent(studentProfile);

        return ResponseEntity.ok(createdStudent);
    }

    // GET ALL STUDENTS
    @GetMapping
    public ResponseEntity<List<StudentProfile>> getAllStudents() {

        return ResponseEntity.ok(
                studentProfileService.getAllStudents()
        );
    }

    // GET STUDENT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentProfile> getStudentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                studentProfileService.getStudentById(id)
        );
    }

    // UPDATE STUDENT
    @PutMapping("/{id}")
    public ResponseEntity<StudentProfile> updateStudent(

            @PathVariable Long id,

            @RequestBody StudentProfile studentProfile) {

        return ResponseEntity.ok(
                studentProfileService.updateStudent(
                        id,
                        studentProfile
                )
        );
    }

    // DELETE STUDENT
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id) {

        studentProfileService.deleteStudent(id);

        return ResponseEntity.ok(
                "Student deleted successfully"
        );
    }
}