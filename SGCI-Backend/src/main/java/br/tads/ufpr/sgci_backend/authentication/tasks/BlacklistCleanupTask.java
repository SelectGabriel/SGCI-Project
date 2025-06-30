package br.tads.ufpr.sgci_backend.authentication.tasks;

import br.tads.ufpr.sgci_backend.authentication.service.JwtBlacklistService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BlacklistCleanupTask {

    private final JwtBlacklistService jwtBlacklistService;

    public BlacklistCleanupTask(JwtBlacklistService jwtBlacklistService) {
        this.jwtBlacklistService = jwtBlacklistService;
    }

    @Scheduled(fixedRate = 3600000)
    public void cleanBlacklist() {
        jwtBlacklistService.removeExpiredTokens();
    }
}
