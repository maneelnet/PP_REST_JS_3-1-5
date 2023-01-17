package ru.kata.spring.boot_security.demo.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService extends UserDetailsService {

    List<User> usersList();

    void saveUser(User user);

    void deleteUser(Long id);

    void updateUser(User user);

    User showUser(Long id);

    User findByEmail(String email);


}
