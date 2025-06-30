package br.tads.ufpr.sgci_backend.esb.routes;

import br.tads.ufpr.sgci_backend.esb.DTO.ExperimentDTO;
import br.tads.ufpr.sgci_backend.experiment.model.ExperimentEntity;
import br.tads.ufpr.sgci_backend.experiment.service.ExperimentService;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.experiment.model.ParticipantEntity;
import br.tads.ufpr.sgci_backend.researcher.service.ResearcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/api/experiments")
public class EsbExperimentRoutesController {

    private final ExperimentService experimentService;
    private final ResearcherService researcherService;

    @Autowired
    public EsbExperimentRoutesController(ExperimentService experimentService, ResearcherService researcherService) {
        this.experimentService = experimentService;
        this.researcherService = researcherService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllExperiments() {
        try {
            List<ExperimentEntity> experiments = experimentService.getAllExperiments();
            return new ResponseEntity<>(experiments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving experiments: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/researcher/{researcherId}")
    public ResponseEntity<?> getExperimentsByResearcher(@PathVariable Long researcherId) {
        try {
            List<ExperimentEntity> experiments = experimentService.getExperimentsByResearcher(researcherId);
            return new ResponseEntity<>(experiments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving experiments for researcher: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExperimentById(@PathVariable Long id) {
        try {
            ExperimentEntity experiment = experimentService.getExperimentById(id);
            return new ResponseEntity<>(experiment, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving experiment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/researcher/{researcherId}")
    public ResponseEntity<?> getExperimentByIdForResearcher(
            @PathVariable Long id,
            @PathVariable Long researcherId) {
        try {
            ExperimentEntity experiment = experimentService.getExperimentByIdForResearcher(id, researcherId);
            return new ResponseEntity<>(experiment, HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving experiment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterExperiments(
            @RequestParam(required = false) Long participantId,
            @RequestParam(required = false) Long researcherId,
            @RequestParam(required = false) String status) {
        try {
            ParticipantEntity participant = null;
            if (participantId != null) {
                participant = new ParticipantEntity();
                participant.setId(participantId);
            }

            ResearcherEntity researcher = null;
            if (researcherId != null) {
                researcher = new ResearcherEntity();
                researcher.setId(researcherId);
            }

            List<ExperimentEntity> experiments = experimentService.filterExperiments(participant, researcher, status);
            return new ResponseEntity<>(experiments, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error filtering experiments: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createExperiment(@RequestBody ExperimentDTO experimentDTO, @AuthenticationPrincipal UserDetails loggedInUser) {
        try {
            checkCreatePermission(experimentDTO.getResearcherId(), loggedInUser);

            ExperimentEntity experiment = experimentDTO.toEntity();
            ExperimentEntity createdExperiment = experimentService.createExperiment(experiment);
            return new ResponseEntity<>(createdExperiment, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>("Permission denied: " + e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Validation error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating experiment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteExperiment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails loggedInUser) {
        try {
            checkOwnershipPermission(id, loggedInUser);

            experimentService.deleteExperiment(id);
            return new ResponseEntity<>("Experiment deleted successfully", HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>("Permission denied: " + e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting experiment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateExperiment(
            @PathVariable Long id,
            @RequestBody ExperimentDTO experimentDTO,
            @AuthenticationPrincipal UserDetails loggedInUser) {
        try {
            checkOwnershipPermission(id, loggedInUser);
            ExperimentEntity updatedExperimentData = experimentDTO.toEntity();
            ExperimentEntity updatedExperiment = experimentService.updateExperiment(id, updatedExperimentData);
            return new ResponseEntity<>(updatedExperiment, HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>("Permission denied: " + e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Validation error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating experiment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void checkOwnershipPermission(Long experimentId, UserDetails loggedInUser) {
        boolean isAdmin = loggedInUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ADMINISTRADOR"));

        if (isAdmin) {
            return;
        }

        ResearcherEntity loggedResearcher = researcherService.getResearcherByEmail(loggedInUser.getUsername());
        ExperimentEntity experiment = experimentService.getExperimentById(experimentId);

        if (!Objects.equals(experiment.getResearcher().getId(), loggedResearcher.getId())) {
            throw new IllegalStateException("O pesquisador não tem permissão para modificar este experimento.");
        }
    }

    private void checkCreatePermission(Long targetResearcherId, UserDetails loggedInUser) {
        boolean isAdmin = loggedInUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ADMINISTRADOR"));

        if (isAdmin) {
            return;
        }

        ResearcherEntity loggedResearcher = researcherService.getResearcherByEmail(loggedInUser.getUsername());

        if (!Objects.equals(loggedResearcher.getId(), targetResearcherId)) {
            throw new IllegalStateException("Um pesquisador só pode criar experimentos para si mesmo.");
        }
    }
}
