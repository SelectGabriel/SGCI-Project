package br.tads.ufpr.sgci_backend.esb.routes;

import br.tads.ufpr.sgci_backend.esb.DTO.ResearcherDTO;
import br.tads.ufpr.sgci_backend.esb.orchestrator.UserResearcherDeleteOrchestrator;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.researcher.service.ResearcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/api/researchers")
public class EsbResearcherRoutesController {

    private final ResearcherService researcherService;
    private final UserResearcherDeleteOrchestrator userResearcherDeleteOrchestrator;

    @Autowired
    public EsbResearcherRoutesController(ResearcherService researcherService, UserResearcherDeleteOrchestrator userResearcherDeleteOrchestrator) {
        this.researcherService = researcherService;
        this.userResearcherDeleteOrchestrator = userResearcherDeleteOrchestrator;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllResearchers() {
        try {
            List<ResearcherEntity> researchers = researcherService.getAllResearchers();
            return new ResponseEntity<>(researchers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving researchers: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResearcherById(@PathVariable Long id) {
        try {
            ResearcherEntity researcher = researcherService.getResearcherById(id);
            return new ResponseEntity<>(researcher, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Erro: " + e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro ao buscar pesquisador: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterResearchersByName(@RequestParam String name) {
        try {
            List<ResearcherEntity> researchers = researcherService.searchResearchersByName(name);
            return new ResponseEntity<>(researchers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error filtering researchers: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateResearcher(
            @PathVariable Long id,
            @RequestBody ResearcherDTO researcherDTO,
            @AuthenticationPrincipal UserDetails loggedInUser) {
        try {
            checkPermission(id, loggedInUser);

            ResearcherEntity updatedResearcher = researcherService.updateResearcher(id, researcherDTO.toEntity());
            return new ResponseEntity<>(updatedResearcher, HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>("Permission denied: " + e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Validation error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating researcher: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteResearcher(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails loggedInUser) {
        try {
            checkPermission(id, loggedInUser);

            userResearcherDeleteOrchestrator.orchestrate(id);
            return new ResponseEntity<>("Researcher deleted successfully", HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>("Permission denied: " + e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting researcher" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void checkPermission(Long targetResearcherId, UserDetails loggedInUser) {
        boolean isAdmin = loggedInUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ADMINISTRADOR"));

        if (isAdmin) {return;}
        ResearcherEntity loggedResearcher = researcherService.getResearcherByEmail(loggedInUser.getUsername());
        if (!Objects.equals(loggedResearcher.getId(), targetResearcherId)) {
            throw new IllegalStateException("Usuário não tem permissão para modificar este perfil.");
        }
    }
}
