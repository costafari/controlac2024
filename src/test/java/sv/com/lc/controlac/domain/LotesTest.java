package sv.com.lc.controlac.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static sv.com.lc.controlac.domain.FacturasTestSamples.*;
import static sv.com.lc.controlac.domain.LotesTestSamples.*;
import static sv.com.lc.controlac.domain.ProductosTestSamples.*;
import static sv.com.lc.controlac.domain.ProveedoresTestSamples.*;

import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;
import sv.com.lc.controlac.web.rest.TestUtil;

class LotesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Lotes.class);
        Lotes lotes1 = getLotesSample1();
        Lotes lotes2 = new Lotes();
        assertThat(lotes1).isNotEqualTo(lotes2);

        lotes2.setId(lotes1.getId());
        assertThat(lotes1).isEqualTo(lotes2);

        lotes2 = getLotesSample2();
        assertThat(lotes1).isNotEqualTo(lotes2);
    }

    @Test
    void proveedoresTest() {
        Lotes lotes = getLotesRandomSampleGenerator();
        Proveedores proveedoresBack = getProveedoresRandomSampleGenerator();

        lotes.setProveedores(proveedoresBack);
        assertThat(lotes.getProveedores()).isEqualTo(proveedoresBack);

        lotes.proveedores(null);
        assertThat(lotes.getProveedores()).isNull();
    }

    @Test
    void productosTest() {
        Lotes lotes = getLotesRandomSampleGenerator();
        Productos productosBack = getProductosRandomSampleGenerator();

        lotes.addProductos(productosBack);
        assertThat(lotes.getProductos()).containsOnly(productosBack);
        assertThat(productosBack.getLotes()).isEqualTo(lotes);

        lotes.removeProductos(productosBack);
        assertThat(lotes.getProductos()).doesNotContain(productosBack);
        assertThat(productosBack.getLotes()).isNull();

        lotes.productos(new HashSet<>(Set.of(productosBack)));
        assertThat(lotes.getProductos()).containsOnly(productosBack);
        assertThat(productosBack.getLotes()).isEqualTo(lotes);

        lotes.setProductos(new HashSet<>());
        assertThat(lotes.getProductos()).doesNotContain(productosBack);
        assertThat(productosBack.getLotes()).isNull();
    }

    @Test
    void facturasTest() {
        Lotes lotes = getLotesRandomSampleGenerator();
        Facturas facturasBack = getFacturasRandomSampleGenerator();

        lotes.addFacturas(facturasBack);
        assertThat(lotes.getFacturas()).containsOnly(facturasBack);
        assertThat(facturasBack.getLotes()).isEqualTo(lotes);

        lotes.removeFacturas(facturasBack);
        assertThat(lotes.getFacturas()).doesNotContain(facturasBack);
        assertThat(facturasBack.getLotes()).isNull();

        lotes.facturas(new HashSet<>(Set.of(facturasBack)));
        assertThat(lotes.getFacturas()).containsOnly(facturasBack);
        assertThat(facturasBack.getLotes()).isEqualTo(lotes);

        lotes.setFacturas(new HashSet<>());
        assertThat(lotes.getFacturas()).doesNotContain(facturasBack);
        assertThat(facturasBack.getLotes()).isNull();
    }
}
