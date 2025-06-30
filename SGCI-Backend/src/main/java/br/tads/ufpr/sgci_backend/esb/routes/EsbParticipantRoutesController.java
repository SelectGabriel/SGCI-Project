package br.tads.ufpr.sgci_backend.esb.routes;

import br.tads.ufpr.sgci_backend.esb.DTO.ParticipantDTO;
import br.tads.ufpr.sgci_backend.esb.service.ParticipantRegisterService;
import br.tads.ufpr.sgci_backend.experiment.model.ParticipantEntity;
import br.tads.ufpr.sgci_backend.experiment.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/participant")
public class EsbParticipantRoutesController {
    private final ParticipantService participantService;
    private final ParticipantRegisterService participantRegisterService;

    @Autowired
    public EsbParticipantRoutesController(ParticipantService participantService, ParticipantRegisterService participantRegisterService) {
        this.participantService = participantService;
        this.participantRegisterService = participantRegisterService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody ParticipantDTO participantDTO) {
        try {
            ParticipantEntity participant = participantRegisterService.registerParticipant(participantDTO);
            participantService.createParticipant(participant);
            return new ResponseEntity<>("Participant created successfully", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception err) {
            return new ResponseEntity<>("Error creating participant: " + err.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getParticipantById(@PathVariable Long id) {
        try {
            ParticipantEntity participant = participantService.getParticipantById(id);
            if (participant != null) {
                return new ResponseEntity<>(participant, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Participant not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving participant: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllParticipants() {
        try {
            List<ParticipantEntity> participants = participantService.getAllParticipants();
            return new ResponseEntity<>(participants, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving participants: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterParticipants(@RequestParam(required = false) String name) {
        try {
            List<ParticipantEntity> participants = participantService.getParticipantsByName(name);
            return new ResponseEntity<>(participants, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error filtering participants: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateParticipant(@PathVariable Long id, @RequestBody ParticipantDTO participantDTO) {
        try {
            ParticipantEntity participantToUpdate = participantRegisterService.registerParticipant(participantDTO);
            ParticipantEntity updatedParticipant = participantService.updateParticipant(id, participantToUpdate);
            if (updatedParticipant != null) {
                return new ResponseEntity<>(updatedParticipant, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Participant not found", HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating participant: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteParticipant(@PathVariable Long id) {
        try {
            participantService.deleteParticipant(id);
            return new ResponseEntity<>("Participante excluído com sucesso", HttpStatus.OK);

        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>(
                    "Este participante não pode ser excluído pois está associado a um ou mais experimentos.",
                    HttpStatus.CONFLICT
            );
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro ao excluir participante: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}