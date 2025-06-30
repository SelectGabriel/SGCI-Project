package br.tads.ufpr.sgci_backend.authentication.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_usuarios")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String username;
    private String password;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuarios_funcoes", joinColumns = @JoinColumn(name = "id_usuario", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "id_funcao", referencedColumnName = "id"))
    private List<Role> roles = new ArrayList<>();

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public UserEntity() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
