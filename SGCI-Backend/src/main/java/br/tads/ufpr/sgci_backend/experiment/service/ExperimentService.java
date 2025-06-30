package br.tads.ufpr.sgci_backend.experiment.service;

import br.tads.ufpr.sgci_backend.experiment.model.ExperimentEntity;
import br.tads.ufpr.sgci_backend.experiment.repository.ExperimentRepository;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.experiment.model.ParticipantEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExperimentService {

    private final ExperimentRepository experimentRepository;

    public ExperimentService(ExperimentRepository experimentRepository) {
        this.experimentRepository = experimentRepository;
    }

    public List<ExperimentEntity> getAllExperiments() {
        return experimentRepository.findAllExperiments();
    }

    public List<ExperimentEntity> getExperimentsByResearcher(Long researcherId) {
        ResearcherEntity researcher = new ResearcherEntity();
        researcher.setId(researcherId);
        return experimentRepository.findByResearcher(researcher);
    }

    public List<ExperimentEntity> filterExperiments(ParticipantEntity participant, ResearcherEntity researcher, String status) {
        return experimentRepository.filterExperiments(participant, researcher, status);
    }

    @Transactional
    public ExperimentEntity createExperiment(ExperimentEntity experiment) {
        if (experiment.getResearcher() == null || experiment.getParticipant() == null ||
                experiment.getExperimentStartDate() == null || experiment.getObservations() == null) {
            throw new IllegalArgumentException("Todos os campos obrigatórios do experimento devem ser preenchidos.");
        }
        updateStatus(experiment);
        return experimentRepository.save(experiment);
    }

    @Transactional
    public ExperimentEntity updateExperiment(Long id, ExperimentEntity updatedExperiment) {
        ExperimentEntity existingExperiment = experimentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Experimento com ID " + id + " não encontrado."));

        existingExperiment.setParticipant(updatedExperiment.getParticipant());
        existingExperiment.setExperimentStartDate(updatedExperiment.getExperimentStartDate());
        existingExperiment.setObservations(updatedExperiment.getObservations());

        updateStatus(existingExperiment);

        return experimentRepository.save(existingExperiment);
    }

    @Transactional
    public void deleteExperiment(Long id) {
        ExperimentEntity experiment = experimentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Experimento com ID " + id + " não encontrado."));

        if (experimentRepository.hasAssociatedWalks(id)) {
            throw new IllegalStateException("Não é possível excluir o experimento, pois existem caminhadas associadas.");
        }

        experimentRepository.deleteById(id);
    }

    public ExperimentEntity getExperimentById(Long id) {
        return experimentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Experiment with ID " + id + " not found."));
    }

    public ExperimentEntity getExperimentByIdForResearcher(Long experimentId, Long researcherId) {
        return experimentRepository.findByIdAndResearcherId(experimentId, researcherId)
                .orElseThrow(() -> new IllegalStateException("Experiment with ID " + experimentId + " not found or does not belong to researcher with ID " + researcherId));
    }

    public void updateStatus(ExperimentEntity experiment) {
        if (experiment.getWalks() == null || experiment.getWalks().isEmpty()) {
            experiment.setStatus("Incompleto");
            return;
        }

        boolean hasAnyIncompleteWalk = experiment.getWalks().stream()
                .anyMatch(walk ->
                        isNullOrEmpty(walk.getThermalCameraVideo()) ||
                                isNullOrEmpty(walk.getSkeletonizationVideo()) ||
                                isNullOrEmpty(walk.getObservations()) // 'Observations' representa o arquivo CSV
                );

        experiment.setStatus(hasAnyIncompleteWalk ? "Incompleto" : "Completo");
    }

    @Transactional
    public void updateStatusById(Long experimentId) {
        ExperimentEntity experiment = experimentRepository.findById(experimentId)
                .orElseThrow(() -> new IllegalArgumentException("Experimento com ID " + experimentId + " não encontrado."));
        experiment.getWalks().size();
        updateStatus(experiment);
        experimentRepository.save(experiment);
    }

    private boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
