package br.tads.ufpr.sgci_backend.esb.routes;

import br.tads.ufpr.sgci_backend.authentication.model.PasswordResetToken;
import br.tads.ufpr.sgci_backend.authentication.model.Role;
import br.tads.ufpr.sgci_backend.authentication.model.UserEntity;
import br.tads.ufpr.sgci_backend.authentication.repository.PasswordResetTokenRepository;
import br.tads.ufpr.sgci_backend.authentication.repository.RoleRepository;
import br.tads.ufpr.sgci_backend.authentication.repository.UserRepository;
import br.tads.ufpr.sgci_backend.authentication.service.JWTGenerator;
import br.tads.ufpr.sgci_backend.authentication.service.JwtBlacklistService;
import br.tads.ufpr.sgci_backend.authentication.service.SecurityConstants;
import br.tads.ufpr.sgci_backend.authentication.service.UserCustomService;
import br.tads.ufpr.sgci_backend.esb.DTO.RegisterDTO;
import br.tads.ufpr.sgci_backend.esb.orchestrator.UserResearcherRegisterOrchestrator;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.researcher.service.ResearcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.GrantedAuthority;


import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
public class EsbAuthRoutesController {
    private final AuthenticationManager authenticationManager;
    private final JWTGenerator jwtGenerator;
    private final UserResearcherRegisterOrchestrator userResearcherRegisterOrchestrator;
    private final JwtBlacklistService jwtBlacklistService;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final ResearcherService researcherService;
    private final RoleRepository roleRepository;
    private final UserCustomService userCustomService;


    @Autowired
    public EsbAuthRoutesController(AuthenticationManager authenticationManager,
                                   JWTGenerator jwtGenerator, UserResearcherRegisterOrchestrator userResearcherRegisterOrchestrator,
                                   JwtBlacklistService jwtBlacklistService,
                                   PasswordResetTokenRepository tokenRepository,
                                   JavaMailSender mailSender, UserRepository userRepository,
                                   ResearcherService researcherService, RoleRepository roleRepository,
                                   UserCustomService userCustomService) {
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
        this.userResearcherRegisterOrchestrator = userResearcherRegisterOrchestrator;
        this.jwtBlacklistService = jwtBlacklistService;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.researcherService = researcherService;
        this.roleRepository = roleRepository;
        this.userCustomService = userCustomService;
    }

    public record LoginDTO (String username, String password) {}
    public record AuthResponseDTO (String accessToken, String tokenType, ResearcherEntity researcher){};

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(login.username, login.password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtGenerator.generateToken(authentication);
            ResearcherEntity researcher = researcherService.getResearcherByEmail(login.username);
            AuthResponseDTO authResponseDTO = new AuthResponseDTO(token, "Bearer ", researcher);
            return ResponseEntity.ok(authResponseDTO);
        } catch (org.springframework.security.core.AuthenticationException authEx) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas. Verifique seu login e senha.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno no servidor. Por favor, tente novamente mais tarde.");
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader(name = "Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            jwtBlacklistService.blacklistToken(token, SecurityConstants.JWT_EXPIRATION);
            return new ResponseEntity<>("User logged out successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Authorization header missing or invalid", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register (@RequestBody RegisterDTO register) {
        try{
            userResearcherRegisterOrchestrator.orchestrate(register);
            return new ResponseEntity<>("User created successfully", HttpStatus.OK);
        }catch (Exception err){
            System.out.println(err);
            return new ResponseEntity<>("Error creating user", HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody String email) {
        System.out.println(email);
        if (!userRepository.existsByUsername(email)) {
            return ResponseEntity.badRequest().body("Email não encontrado");
        }

        String token = UUID.randomUUID().toString();
        tokenRepository.deleteByEmail(email);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiration(LocalDateTime.now().plusHours(1));
        tokenRepository.save(resetToken);

        String resetUrl = "http://localhost:3000/alterar-senha?token=" + token;
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("gabriel.cunha.afonso@gmail.com");
        mailMessage.setTo(email);
        mailMessage.setSubject("Recuperação de senha");
        mailMessage.setText("Clique no link para redefinir sua senha: " + resetUrl);
        mailSender.send(mailMessage);

        return ResponseEntity.ok("E-mail de recuperação enviado");
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findByToken(token);

        if (resetTokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token inválido");
        }

        PasswordResetToken resetToken = resetTokenOpt.get();

        if (resetToken.getExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token expirado");
        }

        updatePassword(resetToken.getEmail(), newPassword);

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Senha redefinida com sucesso");
    }

    @PostMapping("/promote/{researcherId}")
    public ResponseEntity<?> promoteToAdmin(
            @PathVariable Long researcherId,
            @AuthenticationPrincipal UserDetails loggedInUser) {

        boolean isCallingUserAdmin = loggedInUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ADMINISTRADOR"));

        if (!isCallingUserAdmin) {
            return new ResponseEntity<>("Apenas administradores podem promover outros usuários.", HttpStatus.FORBIDDEN);
        }

        try {
            ResearcherEntity targetResearcher = researcherService.getResearcherById(researcherId);

            ResearcherEntity callingResearcher = researcherService.getResearcherByEmail(loggedInUser.getUsername());
            if (Objects.equals(callingResearcher.getId(), targetResearcher.getId())) {
                return new ResponseEntity<>("Um administrador não pode alterar as próprias permissões.", HttpStatus.BAD_REQUEST);
            }

            UserEntity targetUser = userRepository.findByUsername(targetResearcher.getEmail())
                    .orElseThrow(() -> new IllegalStateException("Conta de usuário para o pesquisador " + targetResearcher.getName() + " não encontrada."));

            Role adminRole = roleRepository.findByName("ADMINISTRADOR")
                    .orElseThrow(() -> new IllegalStateException("A role 'ADMINISTRADOR' não foi encontrada no banco. Crie-a primeiro."));

            if (targetUser.getRoles().contains(adminRole)) {
                return new ResponseEntity<>("Este usuário já é um administrador.", HttpStatus.OK);
            }

            targetUser.getRoles().add(adminRole);
            userRepository.save(targetUser);

            return new ResponseEntity<>("Usuário promovido a administrador com sucesso.", HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void updatePassword(String email, String newPassword) {
        userCustomService.setPasswordByUsername(email, newPassword);
    }
}