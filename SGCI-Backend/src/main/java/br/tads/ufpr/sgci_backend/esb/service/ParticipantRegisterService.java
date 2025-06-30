package br.tads.ufpr.sgci_backend.esb.service;

import br.tads.ufpr.sgci_backend.esb.DTO.ParticipantDTO;
import br.tads.ufpr.sgci_backend.experiment.model.ParticipantEntity;
import org.springframework.stereotype.Service;

@Service
public class ParticipantRegisterService {

    public ParticipantEntity registerParticipant(ParticipantDTO participantDTO) throws Exception {
        ParticipantEntity participant = new ParticipantEntity(
                participantDTO.name(),
                participantDTO.lastname(),
                participantDTO.phone(),
                participantDTO.email(),
                participantDTO.document(),
                participantDTO.observations(),
                participantDTO.genre(),
                participantDTO.dateOfBirth());
        System.out.println(participant);
        if (participant.hasNullFields()) {
            throw new Exception("Check required fields");
        }
        return participant;
    }

}
