package br.tads.ufpr.sgci_backend.experiment.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
        name = "tb_participantes",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"document"})}
)
public class ParticipantEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String lastname;
    private String phone;
    private String email;

    @Column(unique = true)
    private String document;

    private String observations;
    private String genre;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    public ParticipantEntity() {
        super();
    }

    public ParticipantEntity(String name, String lastname, String phone, String email, String document,String observations, String genre, LocalDate dateOfBirth) {
        super();
        this.name = name;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.document = document;
        this.observations = observations;
        this.genre = genre;
        this.dateOfBirth = dateOfBirth;
    }

    public ParticipantEntity(long id, String name, String lastname, String phone, String email, String document) {
        super();
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.document = document;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
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

    public boolean hasNullFields() {
        return this.getName() == null ||
                this.getLastname() == null ||
                this.getPhone() == null ||
                this.getEmail() == null ||
                this.getDocument() == null ||
                this.getDateOfBirth() == null ||
                this.getGenre() == null;
    }
}