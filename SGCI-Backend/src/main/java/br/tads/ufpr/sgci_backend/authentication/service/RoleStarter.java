package br.tads.ufpr.sgci_backend.authentication.service;

import br.tads.ufpr.sgci_backend.authentication.model.Role;
import br.tads.ufpr.sgci_backend.authentication.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(0)
public class RoleStarter implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleStarter(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        if (roleRepository.findByName("ADMINISTRADOR").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ADMINISTRADOR");
            roleRepository.save(adminRole);
            System.out.println("Role ADMINISTRADOR criada.");
        }

        if (roleRepository.findByName("USUARIO").isEmpty()) {
            Role userRole = new Role();
            userRole.setName("USUARIO");
            roleRepository.save(userRole);
            System.out.println("Role USUARIO criada.");
        }
    }
}
