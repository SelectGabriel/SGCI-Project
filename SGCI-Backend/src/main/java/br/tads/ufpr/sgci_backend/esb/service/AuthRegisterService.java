package br.tads.ufpr.sgci_backend.esb.service;

import br.tads.ufpr.sgci_backend.authentication.model.Role;
import br.tads.ufpr.sgci_backend.authentication.model.UserEntity;
import br.tads.ufpr.sgci_backend.authentication.repository.RoleRepository;
import br.tads.ufpr.sgci_backend.authentication.repository.UserRepository;
import br.tads.ufpr.sgci_backend.esb.DTO.RegisterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthRegisterService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public AuthRegisterService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity registerUser(RegisterDTO register) throws Exception {
        if (register.username() == null || register.password() == null){
            throw new Exception("User or password cannot be null");
        }
        if (userRepository.existsByUsername(register.username())){
            throw new Exception("User already exists!");
        }
        UserEntity user = new UserEntity();
        user.setUsername(register.username());
        user.setPassword(passwordEncoder.encode(register.password()));
        if (roleRepository.findByName("USUARIO").isEmpty()){
            throw new Exception("role USUARIO does not exists in the DB");
        }
        Role roles = roleRepository.findByName("USUARIO").get();
        user.setRoles(Collections.singletonList(roles));
        return user;
    }
}
