package br.tads.ufpr.sgci_backend.esb.orchestrator;

import br.tads.ufpr.sgci_backend.authentication.model.UserEntity;
import br.tads.ufpr.sgci_backend.authentication.repository.UserRepository;
import br.tads.ufpr.sgci_backend.esb.DTO.RegisterDTO;
import br.tads.ufpr.sgci_backend.esb.service.AuthRegisterService;
import br.tads.ufpr.sgci_backend.esb.service.ResearcherRegisterService;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.researcher.repository.ResearcherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UserResearcherRegisterOrchestrator implements Orchestrator{
    private final AuthRegisterService authRegisterService;
    private final ResearcherRegisterService researcherRegisterService;
    private final ResearcherRepository researcherRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserResearcherRegisterOrchestrator(AuthRegisterService authRegisterService, ResearcherRegisterService researcherRegisterService, ResearcherRepository researcherRepository, UserRepository userRepository) {
        this.authRegisterService = authRegisterService;
        this.researcherRegisterService = researcherRegisterService;
        this.researcherRepository = researcherRepository;
        this.userRepository = userRepository;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void orchestrate(Record register) throws Exception {
        UserEntity user = authRegisterService.registerUser((RegisterDTO) register);
        user = userRepository.save(user);
        ResearcherEntity researcher = researcherRegisterService.registerResearcher((RegisterDTO) register, user.getId());
        researcherRepository.save(researcher);
    }

    @Override
    public void orchestrate(Long input) throws Exception {
        System.out.println("Try Again");
    }
}
