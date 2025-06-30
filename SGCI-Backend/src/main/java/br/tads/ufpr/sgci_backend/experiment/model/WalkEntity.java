package br.tads.ufpr.sgci_backend.experiment.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_caminhadas")
public class WalkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "thermal_camera_video", nullable = true)
    private String thermalCameraVideo;

    @Column(name = "skeletonization_video", nullable = true)
    private String skeletonizationVideo;

    @Column(name = "sequence_number", nullable = false)
    private int order; //Apenas para ordenação

    @Column(name = "date_time", nullable = true)
    private LocalDateTime dateTime;

    @Column(name = "observations", nullable = true)
    private String observations;

    @ManyToOne
    @JoinColumn(name = "experiment_id", nullable = false)
    private ExperimentEntity experiment;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getThermalCameraVideo() {
        return thermalCameraVideo;
    }

    public void setThermalCameraVideo(String thermalCameraVideo) {
        this.thermalCameraVideo = thermalCameraVideo;
    }

    public String getSkeletonizationVideo() {
        return skeletonizationVideo;
    }

    public void setSkeletonizationVideo(String skeletonizationVideo) {
        this.skeletonizationVideo = skeletonizationVideo;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public ExperimentEntity getExperiment() {
        return experiment;
    }

    public void setExperiment(ExperimentEntity experiment) {
        this.experiment = experiment;
    }
}