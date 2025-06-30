package br.tads.ufpr.sgci_backend.esb.DTO;

import java.time.LocalDate;

public record ParticipantDTO(
                                     String name,
                                     String lastname,
                                     String phone,
                                     String email,
                                     String document,
                                     String observations,
                                     String genre,
                                     LocalDate dateOfBirth) {
}
