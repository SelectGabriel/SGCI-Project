package br.tads.ufpr.sgci_backend.experiment.service;

import br.tads.ufpr.sgci_backend.experiment.model.ExperimentEntity;
import br.tads.ufpr.sgci_backend.experiment.model.WalkEntity;
import br.tads.ufpr.sgci_backend.experiment.repository.ExperimentRepository;
import br.tads.ufpr.sgci_backend.experiment.repository.WalkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WalkService {

    private final WalkRepository walkRepository;
    private final ExperimentRepository experimentRepository;
    private final ExperimentService experimentService;

    public WalkService(WalkRepository walkRepository, ExperimentRepository experimentRepository, ExperimentService experimentService) {
        this.walkRepository = walkRepository;
        this.experimentRepository = experimentRepository;
        this.experimentService = experimentService;
    }

    public WalkEntity createEmptyWalk() {
        WalkEntity walk = new WalkEntity();
        return walkRepository.save(walk);
    }

    @Transactional
    public WalkEntity updateWalk(Long id, WalkEntity updatedWalk) {
        WalkEntity existingWalk = walkRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Caminhada com ID " + id + " não encontrada."));

        existingWalk.setThermalCameraVideo(updatedWalk.getThermalCameraVideo());
        existingWalk.setSkeletonizationVideo(updatedWalk.getSkeletonizationVideo());
        existingWalk.setObservations(updatedWalk.getObservations());
        existingWalk.setOrder(updatedWalk.getOrder());
        existingWalk.setDateTime(updatedWalk.getDateTime());

        WalkEntity saved = walkRepository.save(existingWalk);

        experimentService.updateStatusById(saved.getExperiment().getId());

        return saved;
    }

    @Transactional
    public void deleteWalk(Long id) {
        WalkEntity walk = walkRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Caminhada com ID " + id + " não encontrada."));
        walkRepository.deleteById(id);

        experimentService.updateStatusById(walk.getExperiment().getId());
    }

    @Transactional
    public WalkEntity removeVideos(Long id) {
        WalkEntity walk = walkRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Caminhada com ID " + id + " não encontrada."));
        walk.setThermalCameraVideo(null);
        walk.setSkeletonizationVideo(null);
        WalkEntity saved = walkRepository.save(walk);

        experimentService.updateStatusById(saved.getExperiment().getId());

        return saved;
    }

    @Transactional
    public WalkEntity removeCsv(Long id) {
        WalkEntity walk = walkRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Caminhada com ID " + id + " não encontrada."));
        walk.setObservations(null);
        WalkEntity saved = walkRepository.save(walk);

        experimentService.updateStatusById(saved.getExperiment().getId());

        return saved;
    }

    @Transactional
    public WalkEntity addVideos(Long id, String thermalCameraVideo, String skeletonizationVideo) {
        WalkEntity walk = walkRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Caminhada com ID " + id + " não encontrada."));
        walk.setThermalCameraVideo(thermalCameraVideo);
        walk.setSkeletonizationVideo(skeletonizationVideo);
        WalkEntity saved = walkRepository.save(walk);

        experimentService.updateStatusById(saved.getExperiment().getId());

        return saved;
    }

    @Transactional
    public WalkEntity addCsv(Long id, String csvData) {
        WalkEntity walk = walkRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Caminhada com ID " + id + " não encontrada."));
        walk.setObservations(csvData);
        WalkEntity saved = walkRepository.save(walk);

        experimentService.updateStatusById(saved.getExperiment().getId());

        return saved;
    }

    public List<WalkEntity> getAllWalks() {
        return walkRepository.findAll();
    }

    public WalkEntity getWalkById(Long id) {
        return walkRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Caminhada com ID " + id + " não encontrada."));
    }

    @Transactional
    public WalkEntity createEmptyWalk(Long experimentId) {
        ExperimentEntity experiment = experimentRepository.findById(experimentId)
                .orElseThrow(() -> new IllegalArgumentException("Experimento não encontrado com ID: " + experimentId));

        WalkEntity walk = new WalkEntity();
        walk.setExperiment(experiment);
        walk.setOrder(0); //Define ordem padrão inicial
        WalkEntity saved = walkRepository.save(walk);

        experimentService.updateStatusById(experimentId);

        return saved;
    }

    public List<WalkEntity> getWalksByExperimentId(Long experimentId) {
        if (!experimentRepository.existsById(experimentId)) {
            throw new IllegalArgumentException("Experimento com ID " + experimentId + " não encontrado.");
        }

        return walkRepository.findByExperimentId(experimentId);
    }

    @Transactional
    public WalkEntity createWalk(Long experimentId, WalkEntity walkDetails) {
        ExperimentEntity experiment = experimentRepository.findById(experimentId)
                .orElseThrow(() -> new IllegalArgumentException("Experimento com ID " + experimentId + " não encontrado."));
        WalkEntity walk = new WalkEntity();
        walk.setExperiment(experiment);
        walk.setThermalCameraVideo(walkDetails.getThermalCameraVideo());
        walk.setSkeletonizationVideo(walkDetails.getSkeletonizationVideo());
        walk.setOrder(walkDetails.getOrder());
        walk.setDateTime(walkDetails.getDateTime());
        walk.setObservations(walkDetails.getObservations());
        WalkEntity saved = walkRepository.save(walk);

        experimentService.updateStatusById(experimentId);

        return saved;
    }
}
