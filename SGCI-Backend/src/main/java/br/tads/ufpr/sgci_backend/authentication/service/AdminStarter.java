package br.tads.ufpr.sgci_backend.authentication.service;

import br.tads.ufpr.sgci_backend.authentication.model.Role;
import br.tads.ufpr.sgci_backend.authentication.model.UserEntity;
import br.tads.ufpr.sgci_backend.authentication.repository.RoleRepository;
import br.tads.ufpr.sgci_backend.authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;

@Component
@Order(1)
public class AdminStarter implements CommandLineRunner {

    @Value("${app.admin.email:admin@sgci.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminStarter(UserRepository userRepository,
                        RoleRepository roleRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername(adminEmail).isPresent()) {
            System.out.println("Usuário administrador já existe: " + adminEmail);
            return;
        }

        Optional<Role> adminRoleOpt = roleRepository.findByName("ADMINISTRADOR");
        if (adminRoleOpt.isEmpty()) {
            System.out.println("Função ADMINISTRADOR não encontrada! Execute o RoleStarter primeiro.");
            return;
        }

        UserEntity admin = new UserEntity();
        admin.setUsername(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRoles(Collections.singletonList(adminRoleOpt.get()));
        userRepository.save(admin);

        System.out.println("Usuário administrador criado: " + adminEmail);
    }
}
