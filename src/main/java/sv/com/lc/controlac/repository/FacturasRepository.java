package sv.com.lc.controlac.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sv.com.lc.controlac.domain.Facturas;

/**
 * Spring Data JPA repository for the Facturas entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FacturasRepository extends JpaRepository<Facturas, Long> {}
