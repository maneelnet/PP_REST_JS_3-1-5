package ru.kata.spring.boot_security.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT DISTINCT u FROM User u JOIN FETCH u.roles")
    List<User> usersList();

    @Query(value = "SELECT DISTINCT u FROM User u JOIN FETCH u.roles WHERE u.email = ?1")
    User findByEmail(String email);

    @Query(value = "SELECT DISTINCT u FROM User u JOIN FETCH u.roles WHERE u.id = ?1")
    User showUser(Long id);

}
