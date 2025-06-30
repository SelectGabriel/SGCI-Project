package br.tads.ufpr.sgci_backend.experiment.model;

import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_experimentos")
public class ExperimentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "researcher_id", nullable = false)
    private ResearcherEntity researcher;

    @ManyToOne
    @JoinColumn(name = "participant_id", nullable = false)
    private ParticipantEntity participant;

    @Column(name = "experiment_start_date")
    private LocalDateTime experimentStartDate;
    private String observations;

    @JsonIgnore
    @OneToMany(mappedBy = "experiment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WalkEntity> walks = new ArrayList<>();

    @Column(nullable = false)
    private String status;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ResearcherEntity getResearcher() {
        return researcher;
    }

    public void setResearcher(ResearcherEntity researcher) {
        this.researcher = researcher;
    }

    public ParticipantEntity getParticipant() {
        return participant;
    }

    public void setParticipant(ParticipantEntity participant) {
        this.participant = participant;
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

    public List<WalkEntity> getWalks() {
        return walks;
    }

    public void setWalks(List<WalkEntity> walks) {
        this.walks = walks;
    }
}
