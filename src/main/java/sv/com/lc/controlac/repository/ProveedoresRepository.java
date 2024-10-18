package sv.com.lc.controlac.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sv.com.lc.controlac.domain.Proveedores;

/**
 * Spring Data JPA repository for the Proveedores entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProveedoresRepository extends JpaRepository<Proveedores, Long> {}
