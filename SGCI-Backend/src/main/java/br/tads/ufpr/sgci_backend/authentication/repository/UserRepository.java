package br.tads.ufpr.sgci_backend.authentication.repository;

import br.tads.ufpr.sgci_backend.authentication.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    boolean existsByUsername(String username);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM usuarios_funcoes WHERE id_usuario = :idUsuario", nativeQuery = true)
    void deleteFromUsuarioFuncoesByUserId(@Param("idUsuario") Long idUsuario);
}
