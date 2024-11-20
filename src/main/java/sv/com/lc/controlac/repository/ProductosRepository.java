package sv.com.lc.controlac.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sv.com.lc.controlac.domain.Productos;

/**
 * Spring Data JPA repository for the Productos entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductosRepository extends JpaRepository<Productos, Long> {}
