package sv.com.lc.controlac.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static sv.com.lc.controlac.domain.DetallesTestSamples.*;
import static sv.com.lc.controlac.domain.FacturasTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;
import sv.com.lc.controlac.web.rest.TestUtil;

class DetallesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Detalles.class);
        Detalles detalles1 = getDetallesSample1();
        Detalles detalles2 = new Detalles();
        assertThat(detalles1).isNotEqualTo(detalles2);

        detalles2.setId(detalles1.getId());
        assertThat(detalles1).isEqualTo(detalles2);

        detalles2 = getDetallesSample2();
        assertThat(detalles1).isNotEqualTo(detalles2);
    }

    @Test
    void facturasTest() {
        Detalles detalles = getDetallesRandomSampleGenerator();
        Facturas facturasBack = getFacturasRandomSampleGenerator();

        detalles.addFacturas(facturasBack);
        assertThat(detalles.getFacturas()).containsOnly(facturasBack);
        assertThat(facturasBack.getDetalles()).isEqualTo(detalles);

        detalles.removeFacturas(facturasBack);
        assertThat(detalles.getFacturas()).doesNotContain(facturasBack);
        assertThat(facturasBack.getDetalles()).isNull();

        detalles.facturas(new HashSet<>(Set.of(facturasBack)));
        assertThat(detalles.getFacturas()).containsOnly(facturasBack);
        assertThat(facturasBack.getDetalles()).isEqualTo(detalles);

        detalles.setFacturas(new HashSet<>());
        assertThat(detalles.getFacturas()).doesNotContain(facturasBack);
        assertThat(facturasBack.getDetalles()).isNull();
    }
}
