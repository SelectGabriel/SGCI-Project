package br.tads.ufpr.sgci_backend.experiment.repository;

import br.tads.ufpr.sgci_backend.experiment.model.WalkEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface WalkRepository extends JpaRepository<WalkEntity, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM WalkEntity w WHERE w.id = :id")
    void deleteById(Long id);

    default WalkEntity insertEmptyWalk() {
        WalkEntity walk = new WalkEntity();
        return save(walk);
    }

    @Transactional
    @Modifying
    @Query("UPDATE WalkEntity w SET w.thermalCameraVideo = null, w.skeletonizationVideo = null WHERE w.id = :id")
    void removeVideosFromWalk(Long id);

    @Transactional
    @Modifying
    @Query("UPDATE WalkEntity w SET w.observations = null WHERE w.id = :id")
    void removeCsvFromWalk(Long id);

    @Transactional
    @Modifying
    @Query("UPDATE WalkEntity w SET w.thermalCameraVideo = :thermalVideo, w.skeletonizationVideo = :skeletonVideo WHERE w.id = :id")
    void addVideosToWalk(Long id, String thermalVideo, String skeletonVideo);

    @Transactional
    @Modifying
    @Query("UPDATE WalkEntity w SET w.observations = :csvData WHERE w.id = :id")
    void addCsvToWalk(Long id, String csvData);

    List<WalkEntity> findByExperimentId(Long experimentId);
}
