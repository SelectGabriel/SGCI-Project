package br.tads.ufpr.sgci_backend.esb.service;

import br.tads.ufpr.sgci_backend.esb.DTO.RegisterDTO;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherType;
import org.springframework.stereotype.Service;

@Service
public class ResearcherRegisterService {

    public ResearcherEntity registerResearcher(RegisterDTO register, long idUser) throws Exception {
        ResearcherEntity researcher = new ResearcherEntity();
        researcher.setName(register.name());
        researcher.setLastname(register.lastname());
        researcher.setPhone(register.phone());
        researcher.setEmail(register.email());
        researcher.setDocument(register.document());
        researcher.setType(ResearcherType.valueOf(register.type()));
        researcher.setUUID(idUser);
        researcher.setInstitution(register.institution());
        System.out.println(researcher);
        if (researcher.hasNullFields()) {
            throw new Exception("Check required fields");
        }
        return researcher;
    }
}
