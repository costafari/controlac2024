package sv.com.lc.controlac.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static sv.com.lc.controlac.domain.LotesTestSamples.*;
import static sv.com.lc.controlac.domain.ProductosTestSamples.*;

import org.junit.jupiter.api.Test;
import sv.com.lc.controlac.web.rest.TestUtil;

class ProductosTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Productos.class);
        Productos productos1 = getProductosSample1();
        Productos productos2 = new Productos();
        assertThat(productos1).isNotEqualTo(productos2);

        productos2.setId(productos1.getId());
        assertThat(productos1).isEqualTo(productos2);

        productos2 = getProductosSample2();
        assertThat(productos1).isNotEqualTo(productos2);
    }

    @Test
    void lotesTest() {
        Productos productos = getProductosRandomSampleGenerator();
        Lotes lotesBack = getLotesRandomSampleGenerator();

        productos.setLotes(lotesBack);
        assertThat(productos.getLotes()).isEqualTo(lotesBack);

        productos.lotes(null);
        assertThat(productos.getLotes()).isNull();
    }
}
