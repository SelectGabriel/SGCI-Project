package br.tads.ufpr.sgci_backend.experiment.repository;

import br.tads.ufpr.sgci_backend.experiment.model.ParticipantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<ParticipantEntity, Long> {
    ParticipantEntity findByEmail(String email);
    List<ParticipantEntity> findByNameContainingIgnoreCase(String name);
    boolean existsByDocument(String document);
}