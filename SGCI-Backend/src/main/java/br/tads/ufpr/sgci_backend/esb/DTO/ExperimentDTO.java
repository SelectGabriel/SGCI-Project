package br.tads.ufpr.sgci_backend.esb.DTO;

import br.tads.ufpr.sgci_backend.experiment.model.ExperimentEntity;
import br.tads.ufpr.sgci_backend.experiment.model.ParticipantEntity;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;

import java.time.LocalDateTime;

public class ExperimentDTO {
    private Long researcherId;
    private Long participantId;
    private LocalDateTime experimentStartDate;
    private String observations;
    private String status;

    public ExperimentDTO() {
    }

    public ExperimentDTO(ExperimentEntity experiment) {
        this.researcherId = experiment.getResearcher().getId();
        this.participantId = experiment.getParticipant().getId();
        this.experimentStartDate = experiment.getExperimentStartDate();
        this.observations = experiment.getObservations();
        this.status = experiment.getStatus();
    }

    public Long getResearcherId() {
        return researcherId;
    }

    public void setResearcherId(Long researcherId) {
        this.researcherId = researcherId;
    }

    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public LocalDateTime getExperimentStartDate() {
        return experimentStartDate;
    }

    public void setExperimentStartDate(LocalDateTime experimentStartDate) {
        this.experimentStartDate = experimentStartDate;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ExperimentEntity toEntity() {
        ExperimentEntity experiment = new ExperimentEntity();
        ResearcherEntity researcher = new ResearcherEntity();
        researcher.setId(this.researcherId);
        experiment.setResearcher(researcher);

        ParticipantEntity participant = new ParticipantEntity();
        participant.setId(this.participantId);
        experiment.setParticipant(participant);

        experiment.setExperimentStartDate(this.experimentStartDate);
        experiment.setObservations(this.observations);

        experiment.setStatus(this.status);
        return experiment;
    }
}
