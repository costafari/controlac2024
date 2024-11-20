package sv.com.lc.controlac.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sv.com.lc.controlac.domain.Detalles;

/**
 * Spring Data JPA repository for the Detalles entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DetallesRepository extends JpaRepository<Detalles, Long> {}
