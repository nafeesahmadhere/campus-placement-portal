package com.example.placement_portal.service;

import com.example.placement_portal.exception.ResourceNotFoundException;

import com.example.placement_portal.model.StudentProfile;
import com.example.placement_portal.model.UserRole;

import com.example.placement_portal.repository.StudentProfileRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;

    @Autowired
    public StudentProfileService(
            StudentProfileRepository studentProfileRepository) {

        this.studentProfileRepository =
                studentProfileRepository;
    }

    // CREATE STUDENT
    public StudentProfile createStudent(
            StudentProfile studentProfile) {

        studentProfile
                .getUser()
                .setRole(UserRole.STUDENT);

        return studentProfileRepository
                .save(studentProfile);
    }

    // GET ALL STUDENTS
    public List<StudentProfile> getAllStudents() {

        return studentProfileRepository
                .findAll();
    }

    // GET STUDENT BY ID
    public StudentProfile getStudentById(
            Long id) {

        return studentProfileRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: "
                                        + id
                        )
                );
    }

    // UPDATE STUDENT
    public StudentProfile updateStudent(
            Long id,
            StudentProfile updatedStudent) {

        StudentProfile student =
                getStudentById(id);

        student.getUser().setName(
                updatedStudent
                        .getUser()
                        .getName()
        );

        student.getUser().setEmail(
                updatedStudent
                        .getUser()
                        .getEmail()
        );

        student.setDepartment(
                updatedStudent.getDepartment()
        );

        student.setCgpa(
                updatedStudent.getCgpa()
        );

        student.setBacklogs(
                updatedStudent.getBacklogs()
        );

        student.setGraduationYear(
                updatedStudent.getGraduationYear()
        );

        return studentProfileRepository
                .save(student);
    }

    // DELETE STUDENT
    public void deleteStudent(Long id) {

        StudentProfile student =
                getStudentById(id);

        studentProfileRepository
                .delete(student);
    }
}