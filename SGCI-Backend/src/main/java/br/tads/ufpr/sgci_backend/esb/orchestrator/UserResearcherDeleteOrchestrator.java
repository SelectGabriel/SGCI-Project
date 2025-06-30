package br.tads.ufpr.sgci_backend.esb.orchestrator;

import br.tads.ufpr.sgci_backend.authentication.repository.UserRepository;
import br.tads.ufpr.sgci_backend.researcher.repository.ResearcherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UserResearcherDeleteOrchestrator implements Orchestrator {
    private final ResearcherRepository researcherRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserResearcherDeleteOrchestrator(ResearcherRepository researcherRepository, UserRepository userRepository) {
        this.researcherRepository = researcherRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void orchestrate(Record input) throws Exception {
        System.out.println("Try Again");
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void orchestrate(Long id) throws Exception {

        var researcher = researcherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Researcher not found with ID: " + id));
        userRepository.deleteFromUsuarioFuncoesByUserId(id);
        researcherRepository.delete(researcher);
        userRepository.deleteById(id);
    }
}
