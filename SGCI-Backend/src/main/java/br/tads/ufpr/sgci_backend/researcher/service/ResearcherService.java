package br.tads.ufpr.sgci_backend.researcher.service;

import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.researcher.repository.ResearcherRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResearcherService {

    private final ResearcherRepository researcherRepository;

    public ResearcherService(ResearcherRepository researcherRepository) {
        this.researcherRepository = researcherRepository;
    }

    public ResearcherEntity createResearcher(ResearcherEntity researcher) {
        if (researcher.hasNullFields()) {
            throw new IllegalArgumentException("Todos os campos obrigatórios devem ser preenchidos.");
        }
        return researcherRepository.save(researcher);
    }

    public ResearcherEntity getResearcherById(Long id) {
        return researcherRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Pesquisador com ID " + id + " não encontrado."));
    }

    public ResearcherEntity getResearcherByEmail(String email) {
        return researcherRepository.findByEmail(email).orElseThrow(() ->
                new IllegalArgumentException("Pesquisador com e-mail " + email + " não encontrado."));
    }

    public ResearcherEntity getResearcherByDocument(String document) {
        return researcherRepository.findByDocument(document).orElseThrow(() ->
                new IllegalArgumentException("Pesquisador com cpf " + document + " não encontrado."));
    }

    public List<ResearcherEntity> getAllResearchers() {
        return researcherRepository.listAllResearchers();
    }

    public List<ResearcherEntity> searchResearchersByName(String name) {
        return researcherRepository.findByName(name);
    }

    public ResearcherEntity updateResearcher(Long id, ResearcherEntity updatedData) {
        ResearcherEntity existingResearcher = researcherRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Pesquisador com ID " + id + " não encontrado."));

        existingResearcher.setName(updatedData.getName());
        existingResearcher.setLastname(updatedData.getLastname());
        existingResearcher.setPhone(updatedData.getPhone());
        existingResearcher.setEmail(updatedData.getEmail());
        existingResearcher.setDocument(updatedData.getDocument());
        existingResearcher.setType(updatedData.getType());
        existingResearcher.setInstitution(updatedData.getInstitution());

        return researcherRepository.save(existingResearcher);
    }

    public void deleteResearcher(Long id) {
        if (!researcherRepository.existsById(id)) {
            throw new IllegalArgumentException("Pesquisador com ID " + id + " não encontrado.");
        }
        researcherRepository.deleteById(id);
    }
}