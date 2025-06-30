package br.tads.ufpr.sgci_backend.esb.routes;

import br.tads.ufpr.sgci_backend.experiment.model.ExperimentEntity;
import br.tads.ufpr.sgci_backend.experiment.model.WalkEntity;
import br.tads.ufpr.sgci_backend.experiment.service.ExperimentService;
import br.tads.ufpr.sgci_backend.experiment.service.WalkService;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.researcher.service.ResearcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.GrantedAuthority;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/experiments/walks")
public class EsbWalkRoutesController {

    private final WalkService walkService;
    private final ResearcherService researcherService;
    private final ExperimentService experimentService;

    @Autowired
    public EsbWalkRoutesController(WalkService walkService, ResearcherService researcherService, ExperimentService experimentService) {
        this.walkService = walkService;
        this.researcherService = researcherService;
        this.experimentService = experimentService;
    }

    @PostMapping
    public ResponseEntity<?> createWalk(@RequestParam Long experimentId, @RequestBody WalkEntity walkDetails, @AuthenticationPrincipal UserDetails loggedInUser) {
        try {
            checkExperimentOwnership(experimentId, loggedInUser);
            WalkEntity walk = walkService.createWalk(experimentId, walkDetails);
            return ResponseEntity.status(HttpStatus.CREATED).body(walk);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar caminhada.");
        }
    }

    @PostMapping("/empty")
    public ResponseEntity<?> createEmptyWalk(@RequestParam Long experimentId, @AuthenticationPrincipal UserDetails loggedInUser) {
        try {
            checkExperimentOwnership(experimentId, loggedInUser);
            WalkEntity walk = walkService.createEmptyWalk(experimentId);
            return ResponseEntity.ok(walk);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar caminhada.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWalk(@PathVariable Long id, @RequestBody WalkEntity updatedWalk, @AuthenticationPrincipal UserDetails loggedInUser) {
        try {
            checkWalkOwnership(id, loggedInUser); // 3. VERIFICAÇÃO DE PERMISSÃO
            WalkEntity walk = walkService.updateWalk(id, updatedWalk);
            return ResponseEntity.ok(walk);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar caminhada.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWalk(@PathVariable Long id, @AuthenticationPrincipal UserDetails loggedInUser) {
        try {
            checkWalkOwnership(id, loggedInUser); // 3. VERIFICAÇÃO DE PERMISSÃO
            walkService.deleteWalk(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao excluir caminhada.");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllWalks() {
        try {
            List<WalkEntity> walks = walkService.getAllWalks();
            return ResponseEntity.ok(walks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao listar caminhadas.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWalkById(@PathVariable Long id) {
        try {
            WalkEntity walk = walkService.getWalkById(id);
            return ResponseEntity.ok(walk);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao buscar caminhada.");
        }
    }

    @GetMapping("/byExperiment/{experimentId}")
    public ResponseEntity<?> getWalksByExperimentId(@PathVariable Long experimentId) {
        try {
            List<WalkEntity> walks = walkService.getWalksByExperimentId(experimentId);
            return ResponseEntity.ok(walks);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao buscar caminhadas do experimento.");
        }
    }

    @PutMapping("/{id}/upload")
    public ResponseEntity<?> uploadFiles(
            @PathVariable Long id,
            @RequestPart(value = "termico", required = false) MultipartFile videoTermico,
            @RequestPart(value = "esqueleto", required = false) MultipartFile videoEsqueleto,
            @RequestPart(value = "csv", required = false) MultipartFile csv,
            @AuthenticationPrincipal UserDetails loggedInUser
    ) {
        try {
            checkWalkOwnership(id, loggedInUser);
            String uploadDir = "uploads/walks/" + id + "/";
            Files.createDirectories(Paths.get(uploadDir));

            String videoTermicoPath = null;
            String videoEsqueletoPath = null;
            String csvPath = null;

            if (videoTermico != null && !videoTermico.isEmpty()) {
                Path path = Paths.get(uploadDir + "video_termico_" + videoTermico.getOriginalFilename());
                Files.write(path, videoTermico.getBytes());
                videoTermicoPath = path.toString();
            }

            if (videoEsqueleto != null && !videoEsqueleto.isEmpty()) {
                Path path = Paths.get(uploadDir + "video_esqueleto_" + videoEsqueleto.getOriginalFilename());
                Files.write(path, videoEsqueleto.getBytes());
                videoEsqueletoPath = path.toString();
            }

            if (csv != null && !csv.isEmpty()) {
                Path path = Paths.get(uploadDir + "dados_" + csv.getOriginalFilename());
                Files.write(path, csv.getBytes());
                csvPath = path.toString();
            }

            WalkEntity walk = walkService.getWalkById(id);
            if (videoTermicoPath != null) walk.setThermalCameraVideo(videoTermicoPath);
            if (videoEsqueletoPath != null) walk.setSkeletonizationVideo(videoEsqueletoPath);
            if (csvPath != null) walk.setObservations(csvPath);

            walkService.updateWalk(id, walk);

            return ResponseEntity.ok(walk);

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao fazer upload dos arquivos.");
        }
    }

    @DeleteMapping("/{id}/remove-file")
    public ResponseEntity<?> deleteUploadedFile(
            @PathVariable Long id,
            @RequestParam("tipo") String tipo,
            @AuthenticationPrincipal UserDetails loggedInUser
    ) {
        try {
            checkWalkOwnership(id, loggedInUser);
            WalkEntity walk = walkService.getWalkById(id);

            switch (tipo) {
                case "termico" -> walk.setThermalCameraVideo(null);
                case "esqueleto" -> walk.setSkeletonizationVideo(null);
                case "csv" -> walk.setObservations(null);
                default -> {
                    return ResponseEntity.badRequest().body("Tipo de arquivo inválido.");
                }
            }

            walkService.updateWalk(id, walk);
            return ResponseEntity.ok(walk);

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao remover arquivo.");
        }
    }

    @GetMapping("/files/{folder}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String folder, @PathVariable String filename) {
        try {
            Path file = Paths.get("uploads/walks/" + folder).resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header("Content-Disposition", "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/public/files/{folder}/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String folder, @PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/walks/" + folder).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/public/stream/{folder}/{filename:.+}")
    public ResponseEntity<Resource> streamFile(@PathVariable String folder, @PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/walks/" + folder).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    //esses metodos poderiam estar em um orquestrador, mas como eles não salvam nada no banco de dados resolvi deixar aqui por simplicidade
    private void checkWalkOwnership(Long walkId, UserDetails loggedInUser) {
        boolean isAdmin = loggedInUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ADMINISTRADOR"));
        if (isAdmin) {
            return;
        }
        ResearcherEntity loggedResearcher = researcherService.getResearcherByEmail(loggedInUser.getUsername());
        WalkEntity walk = walkService.getWalkById(walkId);
        ExperimentEntity experiment = walk.getExperiment();

        if (!Objects.equals(experiment.getResearcher().getId(), loggedResearcher.getId())) {
            throw new IllegalStateException("O pesquisador logado não tem permissão para modificar esta caminhada.");
        }
    }

    private void checkExperimentOwnership(Long experimentId, UserDetails loggedInUser) {
        boolean isAdmin = loggedInUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ADMINISTRADOR"));

        if (isAdmin) {
            return;
        }

        ResearcherEntity loggedResearcher = researcherService.getResearcherByEmail(loggedInUser.getUsername());
        ExperimentEntity experiment = experimentService.getExperimentById(experimentId);

        if (!Objects.equals(experiment.getResearcher().getId(), loggedResearcher.getId())) {
            throw new IllegalStateException("O pesquisador logado não tem permissão para criar recursos para este experimento.");
        }
    }
}