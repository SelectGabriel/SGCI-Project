package br.tads.ufpr.sgci_backend.researcher.model;

import java.io.Serializable;

import jakarta.persistence.*;

@Entity
@Table(
        name = "tb_pesquisadores",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"document"})}
)
public class ResearcherEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long UUID;
    private String name;
    private String lastname;
    private String phone;
    private String email;
    private String institution;
    private ResearcherType type;

    @Column(unique = true)
    private String document;

    public ResearcherEntity() {
        super();
    }

    public ResearcherEntity(long id, String name, String lastname, String phone, String email, String document, ResearcherType type, long UUID, String institution) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.document = document;
        this.type = type;
        this.UUID = UUID;
        this.institution = institution;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

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

    public ResearcherEntity(ResearcherType type) {
        this.type = type;
    }

    public ResearcherType getType() {
        return type;
    }

    public void setType(ResearcherType type) {
        this.type = type;
    }

    public long getUUID() {
        return UUID;
    }

    public void setUUID(long UUID) {
        this.UUID = UUID;
    }

    @Override
    public String toString() {
        return "ResearcherEntity{" +
                "id=" + id +
                ", UUID=" + UUID +
                ", name='" + name + '\'' +
                ", lastname='" + lastname + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", document='" + document + '\'' +
                ", type=" + type +
                '}';
    }

    public boolean hasNullFields() {
        return this.getName() == null ||
                this.getLastname() == null ||
                this.getPhone() == null ||
                this.getEmail() == null ||
                this.getDocument() == null ||
                this.getType() == null;
    }
}
