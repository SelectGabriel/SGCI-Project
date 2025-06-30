package br.tads.ufpr.sgci_backend.esb.DTO;

import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherType;

public class ResearcherDTO {
    private String name;
    private String lastname;
    private String phone;
    private String email;
    private String document;
    private String institution;
    private ResearcherType type;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDocument() {
        return document;
    }

    public void setDocument(String document) {
        this.document = document;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public ResearcherType getType() {
        return type;
    }

    public void setType(ResearcherType type) {
        this.type = type;
    }

    public ResearcherEntity toEntity() {
        ResearcherEntity researcher = new ResearcherEntity();
        researcher.setName(this.name);
        researcher.setLastname(this.lastname);
        researcher.setPhone(this.phone);
        researcher.setEmail(this.email);
        researcher.setDocument(this.document);
        researcher.setInstitution(this.institution);
        researcher.setType(this.type);
        return researcher;
    }
}
