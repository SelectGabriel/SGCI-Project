package br.tads.ufpr.sgci_backend.researcher.repository;

import br.tads.ufpr.sgci_backend.researcher.model.ResearcherEntity;
import br.tads.ufpr.sgci_backend.researcher.model.ResearcherType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResearcherRepository extends JpaRepository<ResearcherEntity, Long> {

    // RF001 - Listar Pesquisadores
    @Query("SELECT r FROM ResearcherEntity r ORDER BY r.name")
    List<ResearcherEntity> listAllResearchers();

    // NF1.1 - Filtrar pesquisadores por Nome
    @Query("SELECT r FROM ResearcherEntity r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ResearcherEntity> findByName(String name);

    // RF002 - Inserir Pesquisador (validação automática via JPA para campos obrigatórios)
    default ResearcherEntity saveResearcher(ResearcherEntity researcher) {
        if (researcher.hasNullFields()) {
            throw new IllegalArgumentException("Todos os campos obrigatórios devem ser preenchidos!");
        }
        return save(researcher);
    }

    // RF003 - Alterar Pesquisador
    @Transactional
    @Modifying
    @Query("UPDATE ResearcherEntity r SET r.name = :name, r.institution = institution , r.lastname = :lastname, r.phone = :phone, r.email = :email, r.document = :document, r.type = :type WHERE r.id = :id")
    void updateResearcher(Long id, String name, String lastname, String phone, String email, String document, ResearcherType type);

    // RF004 - Remover Pesquisador
    @Transactional
    @Modifying
    @Query("DELETE FROM ResearcherEntity r WHERE r.id = :id")
    void deleteById(@NonNull Long id);

    Optional<ResearcherEntity> findByEmail(String email);
    Optional<ResearcherEntity> findByDocument(String document);


}
