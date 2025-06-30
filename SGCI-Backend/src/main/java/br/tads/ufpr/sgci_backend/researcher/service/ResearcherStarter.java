package br.tads.ufpr.sgci_backend.researcher.service;

import br.tads.ufpr.sgci_backend.authentication.model.UserEntity;
import br.tads.ufpr.sgci_backend.authentication.repository.UserRepository;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherType;
import br.tads.ufpr.sgci_backend.researcher.repository.ResearcherRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class ResearcherStarter implements CommandLineRunner {

    @Value("${app.admin.email:admin@sgci.com}")
    private String adminEmail;

    private final ResearcherRepository researcherRepository;
    private final UserRepository userRepository;

    public ResearcherStarter(
            ResearcherRepository researcherRepository,
            UserRepository userRepository
    ) {
        this.researcherRepository = researcherRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        // Busca o usuário admin pelo email
        UserEntity adminUser = userRepository.findByUsername(adminEmail)
                .orElse(null);

        if (adminUser == null) {
            System.err.println("Usuário admin não encontrado, não foi possível criar o pesquisador.");
            return;
        }

        // Garante que ainda não existe um pesquisador com esse email
        if (researcherRepository.findByEmail(adminEmail).isPresent()) {
            System.out.println("Pesquisador admin já existe.");
            return;
        }

        // Cria o pesquisador vinculado ao usuário admin
        ResearcherEntity researcher = new ResearcherEntity();
        researcher.setName("Administrador");
        researcher.setLastname("SGCI");
        researcher.setPhone("000000000");
        researcher.setEmail(adminEmail);
        researcher.setInstitution("Instituição SGCI");
        researcher.setType(ResearcherType.Teacher);
        researcher.setDocument("000.000.000-00");
        researcher.setUUID(adminUser.getId());

        researcherRepository.save(researcher);

        System.out.println("Pesquisador admin criado e vinculado ao usuário admin.");
    }
}
