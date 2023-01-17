package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("api/admin")
public class AdminController {

    private RoleService roleService;
    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setRoleService(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping()
    public Map<String, Object> showUsers(Principal principal) {
        Map<String, Object> mp = new HashMap<>();

        mp.put("users", userService.usersList());
        mp.put("allRoles", roleService.rolesList());
        mp.put("currentUser", userService.findByEmail(principal.getName()));

        return mp;
    }

    @PostMapping()
    public List<User> addUser(@RequestBody User user) {
        userService.saveUser(user);
        return userService.usersList();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable("id") Long userId) {
        return userService.showUser(userId);
    }


    @PutMapping()
    public List<User> updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return userService.usersList();
    }

    @DeleteMapping("/{id}")
    public List<User> deleteUser(@PathVariable("id") Long userId) {
        userService.deleteUser(userId);
        return userService.usersList();
    }

}
