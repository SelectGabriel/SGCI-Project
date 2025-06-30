package br.tads.ufpr.sgci_backend.esb.DTO;

public record RegisterDTO(String username,
                          String password,
                          String name,
                          String lastname,
                          String phone,
                          String email,
                          String document,
                          String institution,
                          String type) {}