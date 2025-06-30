package br.tads.ufpr.sgci_backend.experiment.service;

import br.tads.ufpr.sgci_backend.experiment.model.ParticipantEntity;
import br.tads.ufpr.sgci_backend.experiment.repository.ParticipantRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    public void createParticipant(ParticipantEntity participant) {
        if (participant.hasNullFields()) {
            throw new IllegalArgumentException("Todos os campos obrigatórios devem ser preenchidos.");
        }
        if (participantRepository.existsByDocument(participant.getDocument())) {
            throw new IllegalArgumentException("Um participante com este CPF já está cadastrado.");
        }
        participantRepository.save(participant);
    }

    public ParticipantEntity getParticipantById(Long id) {
        return participantRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Participante não encontrado com ID: " + id));
    }

    public List<ParticipantEntity> getAllParticipants() {
        return participantRepository.findAll();
    }

    public List<ParticipantEntity> getParticipantsByName(String name) {
        return participantRepository.findByNameContainingIgnoreCase(name);
    }

    public ParticipantEntity updateParticipant(Long id, ParticipantEntity updatedParticipant) {
        ParticipantEntity existingParticipant = participantRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Participante não encontrado com ID: " + id));

        existingParticipant.setName(updatedParticipant.getName());
        existingParticipant.setLastname(updatedParticipant.getLastname());
        existingParticipant.setPhone(updatedParticipant.getPhone());
        existingParticipant.setEmail(updatedParticipant.getEmail());
        existingParticipant.setDocument(updatedParticipant.getDocument());
        existingParticipant.setGenre(updatedParticipant.getGenre());
        existingParticipant.setDateOfBirth(updatedParticipant.getDateOfBirth());
        existingParticipant.setObservations(updatedParticipant.getObservations());

        return participantRepository.save(existingParticipant);
    }

    public void deleteParticipant(Long id) {
        ParticipantEntity participant = participantRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Participante não encontrado com ID: " + id));

        System.out.println("Removendo participante: " + participant);

        participantRepository.deleteById(id);
    }
}
