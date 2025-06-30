package br.tads.ufpr.sgci_backend.experiment.repository;

import br.tads.ufpr.sgci_backend.experiment.model.ExperimentEntity;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.experiment.model.ParticipantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExperimentRepository extends JpaRepository<ExperimentEntity, Long> {

    @Query("SELECT e FROM ExperimentEntity e ORDER BY e.experimentStartDate DESC")
    List<ExperimentEntity> findAllExperiments();

    @Query("SELECT e FROM ExperimentEntity e WHERE e.researcher = :researcher ORDER BY e.experimentStartDate DESC")
    List<ExperimentEntity> findByResearcher(@Param("researcher") ResearcherEntity researcher);

    @Query("SELECT e FROM ExperimentEntity e " +
            "WHERE (:participant IS NULL OR e.participant = :participant) " +
            "AND (:researcher IS NULL OR e.researcher = :researcher) " +
            "AND (:status IS NULL OR " +
            "(CASE WHEN (SELECT COUNT(w) FROM WalkEntity w WHERE w.experiment = e AND (w.thermalCameraVideo IS NULL OR w.skeletonizationVideo IS NULL)) > 0 THEN 'Incompleto' ELSE 'Completo' END) = :status)")
    List<ExperimentEntity> filterExperiments(
            @Param("participant") ParticipantEntity participant,
            @Param("researcher") ResearcherEntity researcher,
            @Param("status") String status
    );

    @Query("SELECT COUNT(w) > 0 FROM WalkEntity w WHERE w.experiment.id = :experimentId")
    boolean hasAssociatedWalks(@Param("experimentId") Long experimentId);
    Optional<ExperimentEntity> findByIdAndResearcherId(Long experimentId, Long researcherId);

}
